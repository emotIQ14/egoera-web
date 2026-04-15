#!/usr/bin/env python3
"""
Egoera Psikologia Telegram Bot
- Diario emocional interactivo
- Tips diarios de psicologia
- Enlaces al blog
- Recordatorios de registro emocional
"""

import os
import json
import logging
import datetime
import random
from pathlib import Path

# Telegram Bot API
import urllib.request

BOT_TOKEN = os.environ.get("EGOERA_BOT_TOKEN", "")
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("egoera-bot")

# --- Mood options ---
MOODS = {
    "1": ("😢", "Muy mal", 1),
    "2": ("😟", "Mal", 2),
    "3": ("😐", "Normal", 3),
    "4": ("😊", "Bien", 4),
    "5": ("😄", "Excelente", 5),
}

EMOTIONS = [
    "Ansiedad", "Tristeza", "Alegria", "Calma", "Frustracion",
    "Gratitud", "Enfado", "Esperanza", "Soledad", "Amor",
    "Estres", "Motivacion", "Culpa", "Orgullo", "Miedo",
]

TIPS = [
    "Respira 4-7-8: inhala 4 segundos, manten 7, exhala 8. Activa tu sistema nervioso parasimpatico.",
    "Grounding 5-4-3-2-1: nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas.",
    "Tu ventana de tolerancia se puede ampliar. Cada vez que te autorregulas, la estas entrenando.",
    "Los sesgos cognitivos no te hacen tonto/a, te hacen humano/a. El primer paso es reconocerlos.",
    "Poner limites no es egoismo, es autocuidado. La persona adecuada respetara tus limites.",
    "La ansiedad no es falta de voluntad. Es una respuesta del sistema nervioso que se puede regular.",
    "Cambiar habitos no es cuestion de voluntad, es cuestion de diseno. Modifica las senales.",
    "El Grit (perseverancia + pasion) predice el exito mejor que el talento. Y se puede entrenar.",
    "La Comunicacion No Violenta tiene 4 pasos: Observacion, Sentimiento, Necesidad, Peticion.",
    "La resiliencia no es aguantar sin quejarte. Es la capacidad de resurgir transformado.",
    "El metodo WOOP: Wish (deseo), Outcome (resultado), Obstacle (obstaculo), Plan (si-entonces).",
    "Las emociones positivas no solo se sienten bien — amplian tus recursos intelectuales y sociales.",
    "Un diario de gratitud de 3 cosas al dia durante 21 dias mejora el bienestar significativamente.",
    "Tu estilo de apego influye en como amas y discutes. Pero se puede trabajar y cambiar.",
    "La paralisis por analisis ocurre cuando buscas la opcion perfecta. A veces, 'suficientemente bueno' es mejor.",
]

BLOG_POSTS = [
    {"title": "Los 4 estilos de apego", "url": "https://egoera.es/estilos-de-apego/"},
    {"title": "Ventana de tolerancia", "url": "https://egoera.es/ventana-de-tolerancia/"},
    {"title": "7 sesgos cognitivos", "url": "https://egoera.es/sesgos-cognitivos/"},
    {"title": "Poner limites sin culpa", "url": "https://egoera.es/poner-limites-sin-culpa/"},
    {"title": "5 mitos sobre la ansiedad", "url": "https://egoera.es/mitos-ansiedad/"},
    {"title": "Ciencia de los habitos", "url": "https://egoera.es/ciencia-habitos/"},
    {"title": "Comunicacion No Violenta", "url": "https://egoera.es/comunicacion-no-violenta/"},
    {"title": "Que es el Grit", "url": "https://egoera.es/grit-perseverancia/"},
    {"title": "Paralisis por analisis", "url": "https://egoera.es/paralisis-por-analisis/"},
    {"title": "Resiliencia", "url": "https://egoera.es/resiliencia-como-construirla/"},
    {"title": "Metodo WOOP", "url": "https://egoera.es/metodo-woop/"},
    {"title": "Inteligencia emocional", "url": "https://egoera.es/inteligencia-emocional/"},
]


def tg_request(method, data=None):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    if data:
        body = json.dumps(data).encode()
        req = urllib.request.Request(url, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
    else:
        req = urllib.request.Request(url)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def send_message(chat_id, text, reply_markup=None, parse_mode="HTML"):
    data = {"chat_id": chat_id, "text": text, "parse_mode": parse_mode}
    if reply_markup:
        data["reply_markup"] = reply_markup
    return tg_request("sendMessage", data)


def get_user_data(chat_id):
    filepath = DATA_DIR / f"user_{chat_id}.json"
    if filepath.exists():
        return json.loads(filepath.read_text())
    return {"entries": [], "streak": 0, "last_entry_date": None}


def save_user_data(chat_id, data):
    filepath = DATA_DIR / f"user_{chat_id}.json"
    filepath.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def handle_start(chat_id, first_name):
    text = f"""🧠 <b>Hola {first_name}! Soy el bot de Egoera Psikologia.</b>

Tu estado importa. Estoy aqui para ayudarte a registrar como te sientes y darte herramientas de psicologia practicas.

<b>Que puedo hacer:</b>
📝 /registrar — Registrar tu estado de animo
📊 /progreso — Ver tu progreso emocional
💡 /tip — Recibir un tip de psicologia
📚 /blog — Leer un articulo del blog
🔔 /recordatorio — Activar recordatorio diario
ℹ️ /ayuda — Ver todos los comandos

<b>Empieza ahora:</b> usa /registrar para hacer tu primer registro emocional."""
    send_message(chat_id, text)


def handle_registrar(chat_id):
    text = """📝 <b>Como te sientes ahora?</b>

Elige tu estado de animo:

1️⃣ 😢 Muy mal
2️⃣ 😟 Mal
3️⃣ 😐 Normal
4️⃣ 😊 Bien
5️⃣ 😄 Excelente

Responde con el numero (1-5):"""
    send_message(chat_id, text)


def handle_mood_entry(chat_id, mood_num, text_after=""):
    emoji, label, value = MOODS[mood_num]
    user_data = get_user_data(chat_id)
    today = datetime.date.today().isoformat()

    entry = {
        "date": today,
        "time": datetime.datetime.now().strftime("%H:%M"),
        "mood": value,
        "mood_label": label,
        "emoji": emoji,
        "note": text_after.strip() if text_after else "",
    }

    user_data["entries"].append(entry)

    # Calculate streak
    if user_data["last_entry_date"] == (datetime.date.today() - datetime.timedelta(days=1)).isoformat():
        user_data["streak"] = user_data.get("streak", 0) + 1
    elif user_data["last_entry_date"] != today:
        user_data["streak"] = 1
    user_data["last_entry_date"] = today

    save_user_data(chat_id, user_data)

    streak_text = f"🔥 Racha: {user_data['streak']} dias" if user_data["streak"] > 1 else ""

    response = f"""✅ <b>Registro guardado!</b>

{emoji} <b>{label}</b>
📅 {today} a las {entry['time']}
{f'📝 {entry["note"]}' if entry["note"] else ''}
{streak_text}

Quieres anadir una nota? Escribe lo que quieras y lo guardo con tu registro.
O usa /tip para recibir un consejo de psicologia."""
    send_message(chat_id, response)


def handle_progreso(chat_id):
    user_data = get_user_data(chat_id)
    entries = user_data.get("entries", [])

    if not entries:
        send_message(chat_id, "📊 Aun no tienes registros. Usa /registrar para empezar!")
        return

    total = len(entries)
    avg = sum(e["mood"] for e in entries) / total
    streak = user_data.get("streak", 0)

    # Last 7 entries
    recent = entries[-7:]
    timeline = " ".join(e["emoji"] for e in recent)

    # Mood distribution
    dist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for e in entries:
        dist[e["mood"]] += 1

    dist_text = "\n".join(
        f"  {MOODS[str(k)][0]} {MOODS[str(k)][1]}: {'█' * v} {v}"
        for k, v in sorted(dist.items())
    )

    avg_emoji = MOODS[str(round(avg))][0]

    text = f"""📊 <b>Tu progreso emocional</b>

📝 Total registros: <b>{total}</b>
🔥 Racha actual: <b>{streak} dias</b>
{avg_emoji} Media: <b>{avg:.1f}/5</b>

<b>Ultimos registros:</b>
{timeline}

<b>Distribucion:</b>
{dist_text}

Sigue registrando para ver patrones! /registrar"""
    send_message(chat_id, text)


def handle_tip(chat_id):
    tip = random.choice(TIPS)
    post = random.choice(BLOG_POSTS)
    text = f"""💡 <b>Tip de psicologia</b>

{tip}

📚 <b>Lee mas:</b> <a href="{post['url']}">{post['title']}</a>

🌐 <b>Blog:</b> egoera.es/blog
📝 <b>Registra como te sientes:</b> /registrar"""
    send_message(chat_id, text, parse_mode="HTML")


def handle_blog(chat_id):
    posts_text = "\n".join(
        f"  • <a href=\"{p['url']}\">{p['title']}</a>"
        for p in random.sample(BLOG_POSTS, min(5, len(BLOG_POSTS)))
    )
    text = f"""📚 <b>Articulos del blog de Egoera</b>

{posts_text}

🌐 <b>Ver todos:</b> egoera.es/blog
💡 <b>Tip rapido:</b> /tip"""
    send_message(chat_id, text, parse_mode="HTML")


def handle_ayuda(chat_id):
    text = """ℹ️ <b>Comandos disponibles</b>

📝 /registrar — Registrar tu estado de animo
📊 /progreso — Ver tu progreso emocional
💡 /tip — Recibir un tip de psicologia
📚 /blog — Leer articulos del blog
🔔 /recordatorio — Activar recordatorio diario
🌐 /web — Abrir egoera.es
📞 /contacto — Informacion de contacto
ℹ️ /ayuda — Ver esta ayuda

<b>Egoera Psikologia</b> — Tu estado importa
🌐 egoera.es | 📧 hola@egoera.es"""
    send_message(chat_id, text)


def handle_contacto(chat_id):
    text = """📞 <b>Contacto — Egoera Psikologia</b>

📧 Email: hola@egoera.es
📸 Instagram: @egoera.psikologia
🌐 Web: egoera.es

<b>Servicios:</b>
• Terapia individual: 65 EUR / 50 min
• Terapia de pareja: 80 EUR / 60 min
• Primera consulta GRATIS

<a href="https://egoera.es/contacto/">Reservar consulta gratuita →</a>"""
    send_message(chat_id, text, parse_mode="HTML")


def process_update(update):
    msg = update.get("message")
    if not msg:
        return

    chat_id = msg["chat"]["id"]
    text = msg.get("text", "").strip()
    first_name = msg["chat"].get("first_name", "")

    if text == "/start":
        handle_start(chat_id, first_name)
    elif text == "/registrar":
        handle_registrar(chat_id)
    elif text in ["1", "2", "3", "4", "5"]:
        handle_mood_entry(chat_id, text)
    elif text == "/progreso":
        handle_progreso(chat_id)
    elif text == "/tip":
        handle_tip(chat_id)
    elif text == "/blog":
        handle_blog(chat_id)
    elif text == "/ayuda" or text == "/help":
        handle_ayuda(chat_id)
    elif text == "/contacto":
        handle_contacto(chat_id)
    elif text == "/web":
        send_message(chat_id, "🌐 <b>Visita nuestra web:</b> <a href='https://egoera.es'>egoera.es</a>", parse_mode="HTML")
    elif text == "/recordatorio":
        send_message(chat_id, "🔔 <b>Recordatorio activado!</b>\n\nTe enviaremos un recordatorio diario a las 20:00 para que registres como te sientes.\n\n(Funcion en desarrollo — pronto disponible)")
    else:
        # If user sends text that's not a command, save it as a note on the last entry
        user_data = get_user_data(chat_id)
        if user_data.get("entries"):
            last = user_data["entries"][-1]
            if last["date"] == datetime.date.today().isoformat() and not last.get("note"):
                last["note"] = text
                save_user_data(chat_id, user_data)
                send_message(chat_id, f"📝 Nota anadida a tu registro de hoy ({last['emoji']} {last['mood_label']}).\n\nUsa /progreso para ver tu historial.")
                return
        send_message(chat_id, "No he entendido ese comando. Usa /ayuda para ver que puedo hacer.")


def poll():
    """Long polling - run this to start the bot"""
    log.info("Egoera Bot started. Polling...")
    offset = 0
    while True:
        try:
            updates = tg_request("getUpdates", {"offset": offset, "timeout": 30})
            for update in updates.get("result", []):
                offset = update["update_id"] + 1
                process_update(update)
        except KeyboardInterrupt:
            log.info("Bot stopped.")
            break
        except Exception as e:
            log.error(f"Error: {e}")


def send_daily_update(chat_id, token=None):
    """Send daily update to a specific chat ID"""
    old_token = BOT_TOKEN
    if token:
        globals()["BOT_TOKEN"] = token

    tip = random.choice(TIPS)
    post = random.choice(BLOG_POSTS)
    today = datetime.date.today().strftime("%d/%m/%Y")

    text = f"""🧠 <b>Egoera Psikologia — Update {today}</b>

💡 <b>Tip del dia:</b>
{tip}

📚 <b>Lee en el blog:</b>
<a href="{post['url']}">{post['title']}</a>

📊 <b>Estado del proyecto:</b>
• 12 articulos publicados en egoera.es
• 8 paginas activas (servicios, cursos, recursos, contacto...)
• 6 categorias de contenido
• Monetizacion: Amazon Afiliados, servicios, cursos, recursos premium
• Newsletter lista para Brevo (pendiente API key)

🌐 egoera.es | 📧 hola@egoera.es"""

    try:
        send_message(chat_id, text, parse_mode="HTML")
        log.info(f"Daily update sent to {chat_id}")
    except Exception as e:
        log.error(f"Failed to send to {chat_id}: {e}")

    if token:
        globals()["BOT_TOKEN"] = old_token


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "poll":
        poll()
    elif len(sys.argv) > 1 and sys.argv[1] == "update":
        # Send update to both bots
        TOKENS = [
            "8781890350:AAHGuGoP2EsY9P1O5p08_3BU2cbB21DltAU",
            "8752111954:AAH5S9rzpcP_V8LMs3GBs2op3xdWi80i8A8",
        ]
        for t in TOKENS:
            globals()["BOT_TOKEN"] = t
            updates = tg_request("getUpdates")
            for u in updates.get("result", []):
                cid = u.get("message", {}).get("chat", {}).get("id")
                if cid:
                    send_daily_update(cid, t)
                    break
    else:
        print("Usage: python egoera-bot.py [poll|update]")
