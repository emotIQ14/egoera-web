#!/usr/bin/env python3
"""
Egoera SEO Bot — auditor y organizador del vlog egoera.es

Audita salud SEO post a post, detecta huerfanos, duplicados, problemas de
taxonomia y oportunidades de enlazado interno. Reporta a Telegram. Puede
arreglar algunas cosas (slugs, categorias) bajo --fix con confirmacion.

Uso:
    python3 seo-bot.py audit                 # auditoria completa + reporte Telegram
    python3 seo-bot.py orphans               # solo paginas huerfanas
    python3 seo-bot.py duplicates            # solo duplicados de titulo/description
    python3 seo-bot.py taxonomy              # solo problemas de categorias/tags
    python3 seo-bot.py links <slug>          # sugerencias de enlace interno para un post
    python3 seo-bot.py daily                 # resumen breve para cron diario
    python3 seo-bot.py fix --uncategorized   # categoriza posts sin categoria (con confirmacion)

Sin dependencias externas (solo stdlib).
"""

from __future__ import annotations

import argparse
import base64
import datetime
import json
import logging
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

# ============ CONFIG ============

WP_HOST = "egoera.es"
WP_IP = "217.160.0.3"  # fallback IP si el DNS falla
USERNAME = "user13182230948955"
APP_PASSWORD = "aMbS E65G G6As zBSt dEEN x9dG"
WP_BASE = f"https://{WP_HOST}/wp-json/wp/v2"
SITE = f"https://{WP_HOST}"

TELEGRAM_TOKEN = "8781890350:AAHGuGoP2EsY9P1O5p08_3BU2cbB21DltAU"
TELEGRAM_CHAT_ID = 8201259371

DATA_DIR = Path(__file__).parent / "data"
LOG_DIR = Path(__file__).parent / "logs"
DATA_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_DIR / "seo-bot.log"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger("seo-bot")

# Umbrales SEO
TITLE_MIN, TITLE_MAX = 30, 65
DESC_MIN, DESC_MAX = 110, 160
WORD_MIN_PILAR = 800
WORD_MIN_NORMAL = 400
INTERNAL_LINKS_MIN = 2
ALT_COVERAGE_MIN = 0.7

# ============ DNS workaround ============

_orig_getaddrinfo = socket.getaddrinfo


def _patched(host, *args, **kwargs):
    if host == WP_HOST:
        return _orig_getaddrinfo(WP_IP, *args, **kwargs)
    return _orig_getaddrinfo(host, *args, **kwargs)


socket.getaddrinfo = _patched


# ============ HTTP helpers ============


def _auth() -> str:
    return "Basic " + base64.b64encode(f"{USERNAME}:{APP_PASSWORD}".encode()).decode()


def wp_get(path: str) -> dict | list:
    url = f"{WP_BASE}{path}"
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", _auth())
    req.add_header("Accept", "application/json")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def wp_patch(path: str, payload: dict) -> dict:
    url = f"{WP_BASE}{path}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", _auth())
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def http_get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "EgoeraSEOBot/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def telegram_send(text: str, parse_mode: str = "HTML") -> bool:
    data = urllib.parse.urlencode({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text[:4000],  # Telegram limit
        "parse_mode": parse_mode,
        "disable_web_page_preview": "true",
    }).encode()
    try:
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            data=data,
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read()).get("ok", False)
    except Exception as e:
        log.error(f"Telegram failed: {e}")
        return False


# ============ DATA ACCESS ============


def fetch_all_posts(per_page: int = 100, status: str = "publish") -> list[dict]:
    """Trae todos los posts paginados."""
    posts: list[dict] = []
    page = 1
    while True:
        try:
            batch = wp_get(
                f"/posts?per_page={per_page}&page={page}&status={status}"
                f"&_fields=id,slug,title,excerpt,date,modified,categories,tags,content,link,sticky"
            )
        except urllib.error.HTTPError as e:
            if e.code == 400:
                break
            raise
        if not batch:
            break
        posts.extend(batch)
        if len(batch) < per_page:
            break
        page += 1
    return posts


def fetch_categories() -> dict[int, dict]:
    cats = wp_get("/categories?per_page=100&_fields=id,name,slug,count")
    return {c["id"]: c for c in cats}


def fetch_tags() -> dict[int, dict]:
    tags = wp_get("/tags?per_page=100&_fields=id,name,slug,count")
    return {t["id"]: t for t in tags}


# ============ SEO CHECKS ============


def strip_html(html: str) -> str:
    text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&[a-z]+;", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def extract_meta(html: str, name: str) -> str | None:
    m = re.search(
        rf'<meta\s+(?:name|property)=["\']{re.escape(name)}["\']\s+content=["\']([^"\']+)["\']',
        html, re.IGNORECASE,
    )
    return m.group(1) if m else None


def extract_canonical(html: str) -> str | None:
    m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', html, re.IGNORECASE)
    return m.group(1) if m else None


def count_internal_links(html: str, all_slugs: set[str]) -> tuple[int, list[str]]:
    """Cuenta enlaces internos a otros posts/paginas del propio dominio."""
    found = []
    for m in re.finditer(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html, re.IGNORECASE):
        href = m.group(1)
        if href.startswith("/") or WP_HOST in href:
            slug = href.rstrip("/").rsplit("/", 1)[-1]
            if slug in all_slugs:
                found.append(slug)
    return len(set(found)), list(set(found))


def count_external_links(html: str) -> int:
    n = 0
    for m in re.finditer(r'<a\s+[^>]*href=["\'](https?://[^"\']+)["\']', html, re.IGNORECASE):
        href = m.group(1)
        if WP_HOST not in href:
            n += 1
    return n


def img_alt_coverage(html: str) -> tuple[int, int, float]:
    imgs = re.findall(r"<img[^>]*>", html, re.IGNORECASE)
    if not imgs:
        return 0, 0, 1.0
    with_alt = sum(1 for i in imgs if re.search(r'\salt=["\'][^"\']{2,}["\']', i, re.IGNORECASE))
    return with_alt, len(imgs), with_alt / len(imgs)


def has_schema(html: str, schema_type: str) -> bool:
    pattern = rf'"@type"\s*:\s*"{re.escape(schema_type)}"'
    return bool(re.search(pattern, html))


def audit_post(post: dict, all_slugs: set[str], pilar_slugs: set[str]) -> dict:
    """Auditoria completa de un post. Devuelve dict con issues + score."""
    title = post["title"]["rendered"]
    excerpt = strip_html(post.get("excerpt", {}).get("rendered", ""))
    content = post["content"]["rendered"]
    plain = strip_html(content)
    word_count = len(plain.split())

    issues: list[tuple[str, str]] = []  # (severity, msg)

    # Title
    if not title:
        issues.append(("error", "Sin titulo"))
    elif len(title) < TITLE_MIN:
        issues.append(("warn", f"Titulo corto ({len(title)} chars, min {TITLE_MIN})"))
    elif len(title) > TITLE_MAX:
        issues.append(("warn", f"Titulo largo ({len(title)} chars, max {TITLE_MAX})"))

    # Meta description (excerpt o meta description)
    meta_desc = extract_meta(content, "description") or excerpt
    if not meta_desc:
        issues.append(("error", "Sin meta description ni excerpt"))
    elif len(meta_desc) < DESC_MIN:
        issues.append(("warn", f"Description corta ({len(meta_desc)}, min {DESC_MIN})"))
    elif len(meta_desc) > DESC_MAX:
        issues.append(("warn", f"Description larga ({len(meta_desc)}, max {DESC_MAX})"))

    # Canonical
    canonical = extract_canonical(content)
    expected = f"{SITE}/{post['slug']}/"
    if canonical and canonical != expected:
        issues.append(("warn", f"Canonical raro: {canonical}"))

    # Word count
    is_pilar = bool(set(post.get("categories", [])) & pilar_slugs)
    word_min = WORD_MIN_PILAR if is_pilar else WORD_MIN_NORMAL
    if word_count < word_min:
        issues.append(("warn", f"Pocas palabras ({word_count}, min {word_min})"))

    # Internal links
    n_internal, internal_slugs = count_internal_links(content, all_slugs)
    if n_internal < INTERNAL_LINKS_MIN:
        issues.append(("warn", f"Pocos enlaces internos ({n_internal}, min {INTERNAL_LINKS_MIN})"))

    # External links
    n_external = count_external_links(content)

    # Image alt coverage
    with_alt, total_imgs, ratio = img_alt_coverage(content)
    if total_imgs > 0 and ratio < ALT_COVERAGE_MIN:
        issues.append(("warn", f"Alt coverage baja: {with_alt}/{total_imgs} ({ratio:.0%})"))

    # Schema
    has_article = has_schema(content, "Article")
    has_faq = has_schema(content, "FAQPage")
    if not has_article:
        issues.append(("warn", "Falta schema Article"))

    # Categorias
    if not post.get("categories"):
        issues.append(("error", "Sin categoria asignada"))
    elif len(post.get("categories", [])) > 3:
        issues.append(("warn", f"Demasiadas categorias ({len(post['categories'])})"))

    # Score: 100 - 15*errors - 5*warns
    errors = sum(1 for s, _ in issues if s == "error")
    warns = sum(1 for s, _ in issues if s == "warn")
    score = max(0, 100 - 15 * errors - 5 * warns)

    return {
        "id": post["id"],
        "slug": post["slug"],
        "title": title,
        "url": post["link"],
        "word_count": word_count,
        "internal_links": n_internal,
        "internal_slugs": internal_slugs,
        "external_links": n_external,
        "img_alt": (with_alt, total_imgs),
        "has_schema_article": has_article,
        "has_schema_faq": has_faq,
        "categories": post.get("categories", []),
        "tags": post.get("tags", []),
        "issues": issues,
        "score": score,
    }


# ============ AGGREGATE ANALYSIS ============


def find_orphans(audits: list[dict]) -> list[dict]:
    """Posts a los que no apunta nadie internamente."""
    incoming: dict[str, int] = defaultdict(int)
    for a in audits:
        for slug in a["internal_slugs"]:
            incoming[slug] += 1
    return [a for a in audits if incoming[a["slug"]] == 0]


def find_duplicate_titles(audits: list[dict]) -> list[tuple[str, list[str]]]:
    by_title: dict[str, list[str]] = defaultdict(list)
    for a in audits:
        normalized = re.sub(r"\s+", " ", a["title"].lower().strip())
        by_title[normalized].append(a["slug"])
    return [(t, slugs) for t, slugs in by_title.items() if len(slugs) > 1]


def taxonomy_issues(audits: list[dict], cats: dict, tags: dict) -> dict:
    no_cat = [a for a in audits if not a["categories"]]
    too_many_cat = [a for a in audits if len(a["categories"]) > 3]
    cat_count = Counter(c for a in audits for c in a["categories"])
    weak_cats = [
        cats[cid]["name"] for cid in cats
        if cat_count.get(cid, 0) < 2 and cats[cid]["count"] < 2
    ]
    return {
        "no_cat": no_cat,
        "too_many_cat": too_many_cat,
        "cat_distribution": {cats[cid]["name"]: cat_count.get(cid, 0) for cid in cats},
        "weak_cats": weak_cats,
        "n_tags": len(tags),
        "tags_unused": [t["name"] for t in tags.values() if t["count"] == 0],
    }


def suggest_internal_links(target_slug: str, audits: list[dict], top_n: int = 5) -> list[dict]:
    """Sugiere posts relacionados por solapamiento de tags/categorias."""
    target = next((a for a in audits if a["slug"] == target_slug), None)
    if not target:
        return []
    target_cats = set(target["categories"])
    target_tags = set(target["tags"])
    target_words = set(re.findall(r"\b[a-zA-ZáéíóúñÁÉÍÓÚÑ]{5,}\b", target["title"].lower()))

    scored = []
    for a in audits:
        if a["slug"] == target_slug:
            continue
        cat_overlap = len(target_cats & set(a["categories"])) * 3
        tag_overlap = len(target_tags & set(a["tags"])) * 2
        title_words = set(re.findall(r"\b[a-zA-ZáéíóúñÁÉÍÓÚÑ]{5,}\b", a["title"].lower()))
        word_overlap = len(target_words & title_words)
        already_linked = a["slug"] in target["internal_slugs"]
        score = cat_overlap + tag_overlap + word_overlap - (10 if already_linked else 0)
        if score > 0:
            scored.append({
                "slug": a["slug"],
                "title": a["title"],
                "url": a["url"],
                "score": score,
                "already_linked": already_linked,
            })
    scored.sort(key=lambda x: -x["score"])
    return scored[:top_n]


# ============ SITEMAP CHECK ============


def audit_sitemap() -> dict:
    """Comprueba sitemaps WP y devuelve resumen."""
    out: dict = {"index_status": None, "children": [], "total_urls": 0, "issues": []}
    try:
        idx = http_get(f"{SITE}/wp-sitemap.xml")
        out["index_status"] = "ok"
        children = re.findall(r"<loc>([^<]+)</loc>", idx)
        for child_url in children:
            try:
                xml = http_get(child_url)
                n = len(re.findall(r"<url>", xml))
                out["children"].append({"url": child_url, "n_urls": n})
                out["total_urls"] += n
            except Exception as e:
                out["issues"].append(f"No se pudo obtener {child_url}: {e}")
    except Exception as e:
        out["index_status"] = f"error: {e}"
        out["issues"].append("wp-sitemap.xml inaccesible")
    return out


# ============ REPORT ============


def emoji_score(s: int) -> str:
    if s >= 90: return "🟢"
    if s >= 70: return "🟡"
    if s >= 50: return "🟠"
    return "🔴"


def format_report(audits: list[dict], orphans: list[dict], dupes: list, tax: dict, sitemap: dict) -> str:
    avg_score = sum(a["score"] for a in audits) / len(audits) if audits else 0
    grade = emoji_score(int(avg_score))

    by_score = sorted(audits, key=lambda x: x["score"])
    worst = by_score[:5]

    lines = [
        f"<b>📊 Egoera SEO · Auditoria · {datetime.date.today().isoformat()}</b>",
        "",
        f"<b>Salud media:</b> {grade} {avg_score:.0f}/100 sobre {len(audits)} posts",
        f"<b>Sitemap:</b> {sitemap['index_status']} · {sitemap['total_urls']} URLs",
        "",
    ]

    if worst:
        lines.append("<b>🚨 Posts con peor SEO:</b>")
        for a in worst:
            issue_count = len(a["issues"])
            lines.append(f"{emoji_score(a['score'])} <b>{a['score']}</b> · {a['title'][:55]}")
            lines.append(f"   <a href=\"{a['url']}\">link</a> · {issue_count} issues")
        lines.append("")

    if orphans:
        lines.append(f"<b>👻 Posts huerfanos ({len(orphans)}):</b> sin enlaces internos entrantes")
        for a in orphans[:5]:
            lines.append(f"   • {a['title'][:60]}")
        if len(orphans) > 5:
            lines.append(f"   ...y {len(orphans) - 5} mas")
        lines.append("")

    if dupes:
        lines.append(f"<b>👯 Titulos duplicados ({len(dupes)}):</b>")
        for title, slugs in dupes[:3]:
            lines.append(f"   • \"{title[:60]}\" en {len(slugs)} posts")
        lines.append("")

    if tax["no_cat"]:
        lines.append(f"<b>🏷 Sin categoria ({len(tax['no_cat'])}):</b>")
        for a in tax["no_cat"][:3]:
            lines.append(f"   • {a['title'][:60]}")
        lines.append("")

    if tax["weak_cats"]:
        lines.append(f"<b>🪶 Categorias debiles (&lt;2 posts):</b> {', '.join(tax['weak_cats'][:5])}")
        lines.append("")

    lines.append("<b>📈 Distribucion por pilar:</b>")
    for cat, n in sorted(tax["cat_distribution"].items(), key=lambda x: -x[1]):
        if n > 0:
            lines.append(f"   {n:3} · {cat}")

    return "\n".join(lines)


# ============ COMMANDS ============


def cmd_audit(args) -> int:
    log.info("Iniciando auditoria SEO completa de egoera.es")
    posts = fetch_all_posts()
    log.info(f"Posts publicados: {len(posts)}")
    cats = fetch_categories()
    tags = fetch_tags()
    all_slugs = {p["slug"] for p in posts}
    pilar_slugs = set(cats.keys())  # todas las categorias se consideran pilares

    audits = [audit_post(p, all_slugs, pilar_slugs) for p in posts]
    orphans = find_orphans(audits)
    dupes = find_duplicate_titles(audits)
    tax = taxonomy_issues(audits, cats, tags)
    sitemap = audit_sitemap()

    # Persiste el snapshot
    snap = {
        "date": datetime.datetime.now().isoformat(),
        "audits": audits,
        "orphans": [a["slug"] for a in orphans],
        "duplicates": [{"title": t, "slugs": s} for t, s in dupes],
        "taxonomy": {
            "no_cat": [a["slug"] for a in tax["no_cat"]],
            "weak_cats": tax["weak_cats"],
        },
        "sitemap": sitemap,
    }
    snap_path = DATA_DIR / f"seo-audit-{datetime.date.today().isoformat()}.json"
    snap_path.write_text(json.dumps(snap, ensure_ascii=False, indent=2))
    log.info(f"Snapshot guardado en {snap_path}")

    report = format_report(audits, orphans, dupes, tax, sitemap)
    print(report.replace("<b>", "").replace("</b>", "").replace('<a href="', '').replace('">link</a>', ''))

    if not args.no_telegram:
        ok = telegram_send(report)
        log.info(f"Telegram enviado: {ok}")
    return 0


def cmd_orphans(args) -> int:
    posts = fetch_all_posts()
    cats = fetch_categories()
    all_slugs = {p["slug"] for p in posts}
    pilar_slugs = set(cats.keys())
    audits = [audit_post(p, all_slugs, pilar_slugs) for p in posts]
    orphans = find_orphans(audits)
    print(f"Huerfanos: {len(orphans)}")
    for a in orphans:
        print(f"  • {a['slug']} · {a['title']}")
    return 0


def cmd_duplicates(args) -> int:
    posts = fetch_all_posts()
    cats = fetch_categories()
    all_slugs = {p["slug"] for p in posts}
    pilar_slugs = set(cats.keys())
    audits = [audit_post(p, all_slugs, pilar_slugs) for p in posts]
    dupes = find_duplicate_titles(audits)
    print(f"Duplicados: {len(dupes)}")
    for title, slugs in dupes:
        print(f"  • \"{title}\"  →  {slugs}")
    return 0


def cmd_taxonomy(args) -> int:
    posts = fetch_all_posts()
    cats = fetch_categories()
    tags = fetch_tags()
    all_slugs = {p["slug"] for p in posts}
    audits = [audit_post(p, all_slugs, set(cats.keys())) for p in posts]
    tax = taxonomy_issues(audits, cats, tags)
    print(f"Sin categoria: {len(tax['no_cat'])}")
    for a in tax["no_cat"]:
        print(f"  • {a['slug']}")
    print(f"\nDistribucion:")
    for c, n in sorted(tax["cat_distribution"].items(), key=lambda x: -x[1]):
        print(f"  {n:3} · {c}")
    print(f"\nCategorias debiles: {tax['weak_cats']}")
    print(f"Tags totales: {tax['n_tags']} · sin uso: {len(tax['tags_unused'])}")
    return 0


def cmd_links(args) -> int:
    target = args.slug
    posts = fetch_all_posts()
    cats = fetch_categories()
    all_slugs = {p["slug"] for p in posts}
    audits = [audit_post(p, all_slugs, set(cats.keys())) for p in posts]
    suggestions = suggest_internal_links(target, audits)
    if not suggestions:
        print(f"No hay sugerencias para {target}")
        return 1
    print(f"Sugerencias de enlace interno para '{target}':")
    for s in suggestions:
        flag = " (ya enlazado)" if s["already_linked"] else ""
        print(f"  score={s['score']:3} · {s['url']}{flag}")
        print(f"             {s['title']}")
    return 0


def cmd_daily(args) -> int:
    """Resumen breve para cron diario."""
    posts = fetch_all_posts()
    cats = fetch_categories()
    all_slugs = {p["slug"] for p in posts}
    audits = [audit_post(p, all_slugs, set(cats.keys())) for p in posts]
    orphans = find_orphans(audits)
    avg = sum(a["score"] for a in audits) / len(audits) if audits else 0

    sitemap = audit_sitemap()
    lines = [
        f"<b>🌅 Egoera SEO · {datetime.date.today().isoformat()}</b>",
        f"Salud media: {emoji_score(int(avg))} {avg:.0f}/100 · {len(posts)} posts",
        f"Sitemap: {sitemap['total_urls']} URLs",
        f"Huerfanos: {len(orphans)}",
    ]
    worst = sorted(audits, key=lambda x: x["score"])[:3]
    if worst and worst[0]["score"] < 60:
        lines.append("\n<b>Necesitan atencion:</b>")
        for a in worst:
            if a["score"] < 70:
                lines.append(f"{emoji_score(a['score'])} {a['score']} · {a['slug']}")

    text = "\n".join(lines)
    print(text.replace("<b>", "").replace("</b>", ""))
    if not args.no_telegram:
        telegram_send(text)
    return 0


def cmd_fix(args) -> int:
    """Aplica fixes seleccionados con confirmacion."""
    posts = fetch_all_posts()
    cats = fetch_categories()
    all_slugs = {p["slug"] for p in posts}
    audits = [audit_post(p, all_slugs, set(cats.keys())) for p in posts]
    actions: list[dict] = []

    if args.uncategorized:
        no_cat = [a for a in audits if not a["categories"]]
        default_cat = next((cid for cid, c in cats.items() if c["slug"] == "psicologia-cotidiana"), None)
        if not default_cat:
            print("ERROR: no encontre la categoria por defecto 'psicologia-cotidiana'")
            return 1
        for a in no_cat:
            actions.append({
                "type": "set_category",
                "post_id": a["id"],
                "slug": a["slug"],
                "title": a["title"],
                "categories": [default_cat],
            })

    if not actions:
        print("No hay nada que arreglar.")
        return 0

    print(f"\nVoy a aplicar {len(actions)} acciones:")
    for a in actions:
        print(f"  • {a['type']:15} · {a['slug']}")
    if not args.yes:
        ans = input("\nConfirmar? [y/N] ").strip().lower()
        if ans != "y":
            print("Cancelado.")
            return 0

    done = 0
    for a in actions:
        try:
            if a["type"] == "set_category":
                wp_patch(f"/posts/{a['post_id']}", {"categories": a["categories"]})
                done += 1
                print(f"  ✓ {a['slug']}")
        except Exception as e:
            print(f"  ✗ {a['slug']}: {e}")

    telegram_send(f"<b>🔧 SEO Bot · Fixes aplicados</b>\n{done}/{len(actions)} acciones completadas.")
    return 0


# ============ MAIN ============


def main():
    parser = argparse.ArgumentParser(prog="seo-bot", description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("audit", help="Auditoria completa con reporte Telegram")
    p.add_argument("--no-telegram", action="store_true")
    p.set_defaults(func=cmd_audit)

    p = sub.add_parser("orphans", help="Solo posts huerfanos")
    p.set_defaults(func=cmd_orphans)

    p = sub.add_parser("duplicates", help="Solo titulos/descripciones duplicadas")
    p.set_defaults(func=cmd_duplicates)

    p = sub.add_parser("taxonomy", help="Solo categorias/tags")
    p.set_defaults(func=cmd_taxonomy)

    p = sub.add_parser("links", help="Sugerir enlaces internos para un slug")
    p.add_argument("slug")
    p.set_defaults(func=cmd_links)

    p = sub.add_parser("daily", help="Resumen breve diario (cron)")
    p.add_argument("--no-telegram", action="store_true")
    p.set_defaults(func=cmd_daily)

    p = sub.add_parser("fix", help="Aplicar fixes seleccionados")
    p.add_argument("--uncategorized", action="store_true", help="Asigna 'psicologia-cotidiana' a posts sin categoria")
    p.add_argument("--yes", "-y", action="store_true", help="Skip confirmation")
    p.set_defaults(func=cmd_fix)

    args = parser.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
