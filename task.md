# Nights Watch — egoera-web

> Tareas autónomas para Claude Nights Watch cuando la ventana de uso de Claude
> está a punto de expirar y conviene aprovecharla. Trabaja sobre el repo
> `/Users/anderbilbaocastejon/Documents/GitHub/egoera-web` y la producción
> `https://egoera.es`.

## CONTEXTO

Stack: **Next.js 16 + React 19 + TypeScript estricto**. Deploy en Vercel. Repo
local: `/Users/anderbilbaocastejon/Documents/GitHub/egoera-web/`.

Componentes clave introducidos en mayo 2026:
- `CinematicHero` (homepage) — sunset gradient + persona meditando + flores + polen + pétalos precalculados (220).
- `V5ArticleShell` (`/blog/[slug]`) — TOC sticky + HUD + mood checkpoints + breathing timer.
- `CuadernoCierre` — bloque papel-sepia con 4 post-its (idea/cuerpo/pregunta/práctica) al final de cada artículo.
- `extract-learnings.ts` — extractor heurístico server-side que alimenta el cuaderno.
- i18n cookie-based con 3 locales (ES, EU, EN); sitemap con 168 URLs y 672 hreflang.

## PRIORIDADES DE LA SESIÓN AUTÓNOMA

Ejecuta las tareas en este orden, parando cuando se agote el tiempo o cuando
una verificación crítica falle (en ese caso, deja log claro y termina).

### 1 · Verificar build verde (sanity check)

```bash
cd /Users/anderbilbaocastejon/Documents/GitHub/egoera-web
npm run build 2>&1 | tail -20
```

Si el build falla → repórtalo en el log y **detén la sesión**. No continúes.

### 2 · Verificar producción saludable

```bash
curl -s -o /dev/null -w "%{http_code}" https://egoera.es/
curl -s https://egoera.es/sitemap.xml | grep -c "<loc>"
```

Esperado: HTTP 200, sitemap con ≥165 URLs.

### 3 · Auditar extracción del CuadernoCierre en TODOS los posts

Lista todos los slugs del blog del sitemap:

```bash
SLUGS=$(curl -s https://egoera.es/sitemap.xml | grep -oE 'https://egoera\.es/es/blog/[a-z0-9-]+' | sort -u)
```

Para cada slug:
1. Descarga el HTML renderizado.
2. Cuenta cuántos post-its tiene (`grep -c noteText`).
3. Si tiene < 2 post-its → escribe en `~/scripts/egoera-cuaderno-audit/reports/missing-$(date +%Y-%m-%d).md` una propuesta de override manual con `<!-- cuaderno-idea: ... -->` para que el editor lo pegue.

### 4 · Generar propuestas de mejora para los posts con post-its pobres

Para cada slug donde los post-its sean pobres (genéricos, ruido UI, descripciones):
1. Lee el HTML del post.
2. Identifica los 2-3 mejores h2 + el último párrafo.
3. Genera 4 propuestas concretas (idea, cuerpo, pregunta, práctica) en formato comentario WordPress.

Guarda todo en un único informe markdown.

### 5 · Verificar tests (si existen)

```bash
ls src/components/article/*.test.* 2>/dev/null
```

Si hay tests → ejecútalos y reporta cobertura.

### 6 · Actualizar dependencias seguras

Sólo ejecuta `npm outdated` y propón actualizaciones en el log. **NO ejecutes
`npm update`** — eso requiere validación humana.

### 7 · Optimización SEO

Para cada categoría editorial activa (`autoconocimiento`,
`regulacion-emocional`, `relaciones-apego`, etc.):
1. Verifica que hay ≥3 posts en la categoría.
2. Si hay <3 → marcar en el informe como "categoría sub-poblada" (riesgo SEO).
3. Comprueba que cada post de esa categoría enlaza a otros 2-3 posts del cluster (internal linking).

### 8 · Sitemap diff vs ayer

Compara el sitemap actual con el de ayer (guarda diariamente en
`~/scripts/egoera-watchdog/sitemap-YYYY-MM-DD.xml`). Si hay diferencias:
- URLs añadidas → log "Nuevos posts indexados".
- URLs eliminadas → ALERTA (posible regresión SEO).

## REGLAS DE EJECUCIÓN

- **Lectura, auditoría y reportes**, no escritura masiva en código.
- Cualquier cambio de código requiere PR explícito → no commitear directo a `main`.
- Si necesitas tocar el repo, crea una rama `nights-watch/YYYY-MM-DD-<topic>` y abre un PR para que Ander lo revise.
- Logs en `/Users/anderbilbaocastejon/scripts/egoera-watchdog/nights-watch/$(date +%Y-%m-%d).log`.
- Reportes en `/Users/anderbilbaocastejon/scripts/egoera-cuaderno-audit/reports/`.
- **NO** ejecutes `npm run start` ni `npm run dev` — esos son procesos del usuario.
- **NO** toques WordPress directamente (es prod en vivo).
- Si todo OK al terminar: envía 1 mensaje breve a Telegram (`✅ Nights Watch egoera completado · X auditorías · 0 fallos`).

## CIERRE

Al terminar, escribe un resumen ejecutivo en
`/Users/anderbilbaocastejon/scripts/egoera-watchdog/nights-watch/summary-$(date +%Y-%m-%d).md`:
- Tiempo total invertido.
- Tareas completadas (✅) y omitidas (⏭).
- Hallazgos críticos (top 3).
- Sugerencias accionables para Ander.

Notifica a Telegram (token `8781890350:AAHGuGoP2EsY9P1O5p08_3BU2cbB21DltAU`,
chat_id en `~/scripts/daily-digest/.env`) con un resumen de 1-2 líneas.
