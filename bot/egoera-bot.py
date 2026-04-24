#!/usr/bin/env python3
"""
Egoera Psikologia Telegram Bot
Asistente de bienestar emocional: diario, respiracion, grounding, journaling,
afirmaciones, tests, estadisticas avanzadas, recordatorios personalizados y
modo de crisis.

Run: python3 egoera-bot.py poll
Install as service: python3 egoera-bot.py install-service
"""

import os
import sys
import json
import logging
import datetime
import random
import statistics
import time
import uuid
import threading
import mimetypes
from collections import Counter, defaultdict
from pathlib import Path
import urllib.request
import urllib.error
import urllib.parse

# ============ CONFIG ============

BOT_TOKEN = os.environ.get("EGOERA_BOT_TOKEN", "8510795900:AAH6q6GivNIX9Tdq77IWEMU4jfyh_5GwH1E")
DATA_DIR = Path(os.environ.get("EGOERA_DATA_DIR", str(Path(__file__).parent / "data")))
DATA_DIR.mkdir(exist_ok=True)

LOG_DIR = Path(os.environ.get("EGOERA_LOG_DIR", str(Path(__file__).parent / "logs")))
LOG_DIR.mkdir(exist_ok=True)

LOGO_PATH = Path(os.environ.get("EGOERA_LOGO_PATH", str(Path(__file__).parent / "egoera-logo.png")))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_DIR / "egoera-bot.log"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger("egoera-bot")

# In-memory per-user conversational state (grounding, journal, checkin, etc.)
# Not persisted across restarts — these are short-lived flows.
USER_STATE: dict = {}
STATE_LOCK = threading.Lock()


def set_state(chat_id: int, state):
    with STATE_LOCK:
        if state is None:
            USER_STATE.pop(chat_id, None)
        else:
            USER_STATE[chat_id] = state


def get_state(chat_id: int):
    with STATE_LOCK:
        return USER_STATE.get(chat_id)


# ============ DATA ============

MOODS = {
    "1": {"emoji": "😢", "label": "Muy mal", "value": 1},
    "2": {"emoji": "😟", "label": "Mal", "value": 2},
    "3": {"emoji": "😐", "label": "Normal", "value": 3},
    "4": {"emoji": "😊", "label": "Bien", "value": 4},
    "5": {"emoji": "😄", "label": "Excelente", "value": 5},
}

EMOTIONS = [
    "Ansiedad", "Tristeza", "Alegria", "Calma", "Frustracion",
    "Gratitud", "Enfado", "Esperanza", "Soledad", "Amor",
    "Estres", "Motivacion", "Culpa", "Orgullo", "Miedo",
]

TIPS = [
    {
        "text": "Respiracion 4-7-8: inhala 4 segundos, manten 7, exhala 8. Activa el sistema nervioso parasimpatico y reduce la ansiedad.",
        "source": "Dr. Andrew Weil",
        "related": "ventana-de-tolerancia",
    },
    {
        "text": "Grounding 5-4-3-2-1: nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas. Te devuelve al presente.",
        "source": "Terapia DBT",
        "related": "ventana-de-tolerancia",
    },
    {
        "text": "Tu ventana de tolerancia se puede ampliar. Cada vez que te autorregulas conscientemente, la estas entrenando.",
        "source": "Dan Siegel",
        "related": "ventana-de-tolerancia",
    },
    {
        "text": "Los sesgos cognitivos no te hacen tonto/a — te hacen humano/a. El primer paso para pensar con claridad es reconocerlos.",
        "source": "Daniel Kahneman",
        "related": "sesgos-cognitivos",
    },
    {
        "text": "Poner limites no es egoismo, es autocuidado. La persona adecuada para ti respetara tus limites.",
        "source": "H. Cloud & J. Townsend",
        "related": "poner-limites-sin-culpa",
    },
    {
        "text": "La ansiedad no es falta de voluntad. Es una respuesta del sistema nervioso que se puede regular con tecnicas especificas.",
        "source": "Psicologia clinica",
        "related": "mitos-ansiedad",
    },
    {
        "text": "Cambiar habitos no es cuestion de voluntad, es cuestion de diseno. Modifica las senales de tu entorno.",
        "source": "Charles Duhigg",
        "related": "ciencia-habitos",
    },
    {
        "text": "El Grit (perseverancia + pasion) predice el exito mejor que el talento. Y se puede entrenar.",
        "source": "Angela Duckworth",
        "related": "grit-perseverancia",
    },
    {
        "text": "La Comunicacion No Violenta tiene 4 pasos: Observacion, Sentimiento, Necesidad, Peticion. Transforma tus relaciones.",
        "source": "Marshall Rosenberg",
        "related": "comunicacion-no-violenta",
    },
    {
        "text": "La resiliencia no es aguantar sin quejarte. Es la capacidad de resurgir transformado de la adversidad.",
        "source": "Viktor Frankl",
        "related": "resiliencia-como-construirla",
    },
    {
        "text": "Metodo WOOP: Wish (deseo), Outcome (resultado), Obstacle (obstaculo), Plan (si-entonces). Convierte deseos en accion.",
        "source": "Gabriele Oettingen",
        "related": "metodo-woop",
    },
    {
        "text": "Las emociones positivas no solo se sienten bien — amplian tus recursos intelectuales y sociales de forma duradera.",
        "source": "Barbara Fredrickson",
        "related": "broaden-and-build",
    },
    {
        "text": "Un diario de gratitud de 3 cosas al dia durante 21 dias mejora significativamente el bienestar y reduce la ansiedad.",
        "source": "Robert Emmons",
        "related": "inteligencia-emocional",
    },
    {
        "text": "Tu estilo de apego influye en como amas y discutes. Pero se puede trabajar y cambiar hacia el apego seguro.",
        "source": "Bowlby & Ainsworth",
        "related": "estilos-de-apego",
    },
    {
        "text": "Wabi-Sabi: encuentra belleza en la imperfeccion. El perfeccionismo es una trampa, no una virtud.",
        "source": "Filosofia japonesa",
        "related": "wabi-sabi-psicologia",
    },
    {
        "text": "Perdonar no es justificar. Es soltar el veneno que tu mismo bebes esperando que el otro enferme.",
        "source": "Robert Enright",
        "related": "perdon-psicologia",
    },
    {
        "text": "Modelo PURE de Frankl: Proposito, Comprension, Responsabilidad, Disfrute. Los 4 ingredientes del significado vital.",
        "source": "Paul Wong",
        "related": "modelo-pure-frankl",
    },
]

BLOG_POSTS = [
    {"title": "Los 4 estilos de apego", "slug": "estilos-de-apego"},
    {"title": "Ventana de tolerancia", "slug": "ventana-de-tolerancia"},
    {"title": "7 sesgos cognitivos", "slug": "sesgos-cognitivos"},
    {"title": "Poner limites sin culpa", "slug": "poner-limites-sin-culpa"},
    {"title": "5 mitos sobre la ansiedad", "slug": "mitos-ansiedad"},
    {"title": "Ciencia de los habitos", "slug": "ciencia-habitos"},
    {"title": "Comunicacion No Violenta", "slug": "comunicacion-no-violenta"},
    {"title": "Que es el Grit", "slug": "grit-perseverancia"},
    {"title": "Paralisis por analisis", "slug": "paralisis-por-analisis"},
    {"title": "Resiliencia", "slug": "resiliencia-como-construirla"},
    {"title": "Metodo WOOP", "slug": "metodo-woop"},
    {"title": "Inteligencia emocional", "slug": "inteligencia-emocional"},
    {"title": "Wabi-Sabi y perfeccionismo", "slug": "wabi-sabi-psicologia"},
    {"title": "Broaden-and-Build", "slug": "broaden-and-build"},
    {"title": "El perdon psicologico", "slug": "perdon-psicologia"},
    {"title": "Modelo PURE de Frankl", "slug": "modelo-pure-frankl"},
]

# Affirmations / quotes curadas (>50)
AFFIRMATIONS = [
    ("Entre el estimulo y la respuesta hay un espacio. En ese espacio esta nuestro poder de elegir.", "Viktor Frankl"),
    ("Quien tiene un por que para vivir, puede soportar casi cualquier como.", "Viktor Frankl"),
    ("Todo lo que te irrita de otros puede llevarte a entenderte a ti mismo.", "Carl Jung"),
    ("No soy lo que me sucedio, soy lo que elijo ser.", "Carl Jung"),
    ("Hasta que lo inconsciente no se haga consciente, dirigira tu vida y lo llamaras destino.", "Carl Jung"),
    ("La curiosa paradoja es que cuando me acepto tal como soy, entonces puedo cambiar.", "Carl Rogers"),
    ("La buena vida es un proceso, no un estado del ser. Es una direccion, no un destino.", "Carl Rogers"),
    ("La vulnerabilidad no es ganar ni perder: es tener el coraje de aparecer cuando no puedes controlar el resultado.", "Brene Brown"),
    ("La verguenza necesita tres cosas para crecer: secreto, silencio y juicio.", "Brene Brown"),
    ("Habla contigo mismo como lo harias con alguien a quien amas.", "Brene Brown"),
    ("Lo mas terrible es aceptarse a uno mismo completamente.", "Carl Jung"),
    ("No eres tus pensamientos, eres quien los observa.", "Eckhart Tolle"),
    ("El dolor es inevitable, el sufrimiento es opcional.", "Haruki Murakami"),
    ("Cuida tus pensamientos, se convierten en palabras. Cuida tus palabras, se convierten en acciones.", "Lao Tse"),
    ("No puedes detener las olas, pero puedes aprender a surfear.", "Jon Kabat-Zinn"),
    ("La mayor gloria no es nunca caer, sino levantarse siempre.", "Confucio"),
    ("La unica forma de salir es atravesando.", "Robert Frost"),
    ("Lo que niegas te somete. Lo que aceptas te transforma.", "Carl Jung"),
    ("Nadie puede hacerte sentir inferior sin tu consentimiento.", "Eleanor Roosevelt"),
    ("Se tu mismo. Los demas papeles ya estan ocupados.", "Oscar Wilde"),
    ("Si cambias la manera en que miras las cosas, las cosas que miras cambian.", "Wayne Dyer"),
    ("El autocuidado no es un lujo, es mantenimiento basico.", "Audre Lorde"),
    ("Amarse a uno mismo es el principio de un romance para toda la vida.", "Oscar Wilde"),
    ("Nuestra mayor debilidad radica en rendirnos. La forma mas segura de tener exito es intentarlo una vez mas.", "Thomas Edison"),
    ("El 80% del exito consiste en estar presente.", "Woody Allen"),
    ("Donde pones tu atencion, pones tu energia.", "Tony Robbins"),
    ("La felicidad no es algo hecho. Viene de tus propias acciones.", "Dalai Lama"),
    ("La calma es un superpoder.", "Naval Ravikant"),
    ("La paz comienza con una sonrisa.", "Madre Teresa"),
    ("No hay manera de ser feliz. La felicidad es el camino.", "Thich Nhat Hanh"),
    ("Respira. Estas a salvo. Estas aqui.", "Practica mindfulness"),
    ("Sentir no es debilidad. Sentir es humanidad.", "Egoera"),
    ("Hoy es suficiente con hacer lo que puedas con lo que tienes.", "Teddy Roosevelt"),
    ("Los limites son el distanciamiento entre yo y lo que me hace dano.", "Prentis Hemphill"),
    ("Lo opuesto a la depresion no es la felicidad, es la vitalidad.", "Andrew Solomon"),
    ("La ansiedad es la dizziness de la libertad.", "Kierkegaard"),
    ("El dolor que no se transforma se transmite.", "Richard Rohr"),
    ("Tu no eres una gota en el oceano. Eres el oceano entero en una gota.", "Rumi"),
    ("Las heridas son el lugar por donde la luz entra en ti.", "Rumi"),
    ("Lo que te resiste, persiste. Lo que aceptas, se disuelve.", "Carl Jung"),
    ("Cada manana tenemos la oportunidad de empezar de nuevo.", "Buda"),
    ("No puedes volver atras y cambiar el principio, pero puedes empezar donde estas y cambiar el final.", "C.S. Lewis"),
    ("Confia en el proceso, incluso cuando no entiendas el camino.", "Anonimo"),
    ("Ser vulnerable no es debilidad; es la mayor medida de coraje.", "Brene Brown"),
    ("La mente es todo. En lo que piensas te conviertes.", "Buda"),
    ("No tienes que ser perfecto para ser merecedor de amor.", "Egoera"),
    ("Escucha tu cuerpo: susurra antes de gritar.", "Practica somatica"),
    ("Descansar tambien es productivo.", "Egoera"),
    ("Ser amable contigo mismo no te hara vago. Te hara humano.", "Kristin Neff"),
    ("La autocompasion es la base del cambio sostenible.", "Kristin Neff"),
    ("Lo importante no es lo que te ocurre, sino como reaccionas.", "Epicteto"),
    ("Hoy no tienes que tenerlo todo resuelto. Solo el siguiente paso.", "Egoera"),
    ("Estar presente es el regalo mas grande que te puedes dar.", "Thich Nhat Hanh"),
    ("Tus emociones son mensajeras, no enemigas.", "Susan David"),
    ("La agilidad emocional es la capacidad de estar con lo que sientes sin ser arrastrado.", "Susan David"),
    ("Tambien las estrellas necesitan de la noche para brillar.", "Anonimo"),
]

# 52 preguntas semanales (una por semana del ano)
WEEKLY_QUESTIONS = [
    "Que has aprendido de ti mismo/a esta semana?",
    "Cual ha sido tu momento mas conectado contigo mismo/a?",
    "Que emocion ha aparecido con mas fuerza y que crees que te queria decir?",
    "A quien necesitas perdonar esta semana, incluyendote a ti?",
    "Que limite nuevo te has atrevido a poner?",
    "Cuando te has sentido mas tu mismo/a en los ultimos dias?",
    "Que miedo ha estado dirigiendo tus decisiones?",
    "Que te ha nutrido y que te ha vaciado?",
    "Si tu cuerpo pudiera hablarte, que te diria ahora?",
    "Que historia llevas repitiendote que ya no es verdad?",
    "Que persona de tu vida ha sido un espejo esta semana?",
    "Cual ha sido tu pequena victoria del dia?",
    "Que relacion necesita una conversacion pendiente?",
    "Que actividad te ha hecho perder la nocion del tiempo?",
    "Que te dice tu yo de hace 5 anos que ha avanzado hoy?",
    "En que situacion te has traicionado esta semana?",
    "Que patron se repite y que podrias hacer distinto?",
    "Que necesitas soltar para poder avanzar?",
    "Que gratitud te ha sorprendido hoy?",
    "Cuando has dicho si queriendo decir no? Por que?",
    "Que parte de ti esta pidiendo mas espacio?",
    "Que te ha conmovido esta semana?",
    "Cual ha sido tu mayor aprendizaje de una incomodidad reciente?",
    "Que te falta permitirte?",
    "Que recuerdo reciente volverias a vivir?",
    "Que habito esta construyendo a la persona en la que te quieres convertir?",
    "Que habito la esta erosionando?",
    "Que necesidad tuya ha estado desatendida?",
    "Como ha sido tu dialogo interno esta semana: amable o duro?",
    "Que expectativa ajena llevas a cuestas que ya no quieres cargar?",
    "Que te hubiera gustado que te dijeran de pequeno/a?",
    "Dite eso ahora.",
    "Que tema te genera culpa sin causa real?",
    "Que decision aplazas por miedo?",
    "Cual seria el primer paso minimo hacia ella?",
    "Que espacio (fisico o mental) necesitas reorganizar?",
    "A quien debes un gracias?",
    "A quien debes un perdon?",
    "A quien debes un te quiero?",
    "Que mentira piadosa te estas contando?",
    "Que parte de tu dia te sienta mejor y como ampliarla?",
    "Que parte te desgasta mas y como reducirla?",
    "Que proyecto personal lleva tiempo esperandote?",
    "Cuando fue la ultima vez que te sentiste orgulloso/a?",
    "Que significa exito para ti en esta etapa?",
    "Que creencia sobre ti mismo/a estas listo/a para revisar?",
    "Que te diria tu yo sabio ante tu preocupacion actual?",
    "Que pequena alegria puedes regalarte hoy?",
    "Que responsabilidad has asumido que no era tuya?",
    "Que vinculo quieres cultivar con mas intencion?",
    "Que esta intentando nacer en ti?",
    "Si esta semana fuera un titulo de capitulo, cual seria?",
]

# Test de apego rapido (5 preguntas, 4 opciones cada una: A=seguro, B=ansioso, C=evitativo, D=desorganizado)
ATTACHMENT_TEST = [
    {
        "q": "Cuando tu pareja tarda en responder a un mensaje, lo mas habitual en ti es:",
        "options": [
            ("Confio en que esta ocupado/a y respondera cuando pueda", "A"),
            ("Me pongo nervioso/a y reviso el movil a menudo", "B"),
            ("Me da igual, yo tambien tardo o no respondo", "C"),
            ("Oscilo entre preocuparme y querer aislarme", "D"),
        ],
    },
    {
        "q": "Ante un conflicto importante en tu relacion sueles:",
        "options": [
            ("Buscar dialogo calmado y escuchar al otro", "A"),
            ("Temer que se rompa todo y querer resolverlo ya", "B"),
            ("Evadirte, cerrar el tema o poner distancia", "C"),
            ("Acercarte y alejarte sin saber bien que hacer", "D"),
        ],
    },
    {
        "q": "Hablar de emociones profundas con alguien cercano te hace sentir:",
        "options": [
            ("Comodo/a, es parte natural del vinculo", "A"),
            ("Aliviado/a pero con miedo a ser juzgado/a", "B"),
            ("Incomodo/a, prefieres no hacerlo", "C"),
            ("Deseas hacerlo pero te cuesta sostenerlo", "D"),
        ],
    },
    {
        "q": "Si alguien importante se muestra frio/a contigo piensas:",
        "options": [
            ("Quiza tiene un mal dia, ya hablaremos", "A"),
            ("He hecho algo mal? Necesito confirmar que me quiere", "B"),
            ("Mejor me alejo, no voy a insistir", "C"),
            ("Me afecta mucho y reacciono de formas opuestas", "D"),
        ],
    },
    {
        "q": "Tu vision de la intimidad a largo plazo es:",
        "options": [
            ("Puedo estar cerca sin perderme, y separado sin sentirme abandonado/a", "A"),
            ("Temo perder al otro y estoy muy pendiente", "B"),
            ("Necesito mucho espacio; la cercania me agobia", "C"),
            ("La quiero y la temo a la vez", "D"),
        ],
    },
]

ATTACHMENT_PROFILES = {
    "A": {
        "name": "Seguro",
        "text": "Te sientes comodo/a con la intimidad y la autonomia. Puedes pedir apoyo sin perderte y dar espacio sin sentirte abandonado/a. Confias en que las dificultades se pueden hablar.",
    },
    "B": {
        "name": "Ansioso-preocupado",
        "text": "Deseas cercania profunda y temes perderla. Eres sensible a las senales del otro y puedes hiperactivar el vinculo cuando sientes distancia. Aprender a autorregularte y validarte desde dentro es clave.",
    },
    "C": {
        "name": "Evitativo",
        "text": "Valoras mucho la autonomia y tiendes a desactivar la necesidad de los demas. La intimidad puede sentirse invasiva. Trabajar la tolerancia a la vulnerabilidad y pedir ayuda abre nuevas posibilidades.",
    },
    "D": {
        "name": "Desorganizado",
        "text": "Deseas cercania y a la vez la temes. Puedes oscilar entre acercarte y apartarte. Suele aparecer tras experiencias vinculares dolorosas. Un acompanamiento psicologico ayuda a integrar estas partes.",
    },
}

# Respiracion patterns
BREATHING_PATTERNS = {
    "478": {
        "name": "Respiracion 4-7-8 (Weil)",
        "desc": "Inhalar 4s, mantener 7s, exhalar 8s. Calma el sistema nervioso y ayuda a conciliar el sueno.",
        "cycles": 4,
        "steps": [
            ("🫁 Inhala por la nariz", 4),
            ("⏸️ Manten el aire", 7),
            ("💨 Exhala por la boca despacio", 8),
        ],
    },
    "box": {
        "name": "Respiracion cuadrada (4-4-4-4)",
        "desc": "Inhalar 4s, mantener 4s, exhalar 4s, mantener 4s. Usada por fuerzas especiales para regular el estres.",
        "cycles": 4,
        "steps": [
            ("🫁 Inhala por la nariz", 4),
            ("⏸️ Manten el aire", 4),
            ("💨 Exhala por la boca", 4),
            ("⏸️ Manten sin aire", 4),
        ],
    },
    "diaf": {
        "name": "Respiracion diafragmatica",
        "desc": "Respiracion profunda abdominal, 4s inhalando, 6s exhalando. Activa el nervio vago.",
        "cycles": 5,
        "steps": [
            ("🫁 Inhala llevando el aire al abdomen", 4),
            ("💨 Exhala lento por la boca", 6),
        ],
    },
}

# Euskera saludos
EUSKERA = {
    "hello": "Kaixo",
    "welcome": "Ongi etorri",
    "thanks": "Eskerrik asko",
    "bye": "Agur",
    "goodmorning": "Egun on",
    "goodnight": "Gabon",
}

# SOS resources
SOS_TEXT = """🆘 <b>Modo emergencia</b>

Si estas pasando un momento dificil, no estas solo/a.

<b>📞 Telefono de la Esperanza (24h, gratuito):</b>
<code>717 003 717</code>

<b>📞 024 — Atencion a la conducta suicida (24h):</b>
<code>024</code>

<b>📞 112 — Emergencias</b>

<b>📧 Sesiones con Ander (psicologia):</b>
<a href="mailto:hola@egoera.es">hola@egoera.es</a>

<b>Tecnicas rapidas:</b>
• /respirar — ejercicio de respiracion guiada
• /grounding — volver al presente (5-4-3-2-1)
• /frase — afirmacion para sostenerte ahora

<i>Este bot NO sustituye la ayuda profesional. Si tu vida o la de alguien esta en riesgo, llama al 112.</i>"""


# ============ TELEGRAM API ============

def tg_request(method: str, data: dict = None, timeout: int = 35):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    req_data = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=req_data, method="POST" if data else "GET")
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        log.error(f"TG HTTP {e.code}: {e.read().decode()}")
        raise
    except Exception as e:
        log.error(f"TG error: {e}")
        raise


def tg_multipart(method: str, fields: dict, files: dict, timeout: int = 60):
    """POST multipart/form-data. files = {field: (filename, bytes, mime)}"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    boundary = f"----egoera{uuid.uuid4().hex}"
    body = bytearray()
    for k, v in fields.items():
        body += f"--{boundary}\r\n".encode()
        body += f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode()
        body += f"{v}\r\n".encode()
    for k, (fname, content, mime) in files.items():
        body += f"--{boundary}\r\n".encode()
        body += f'Content-Disposition: form-data; name="{k}"; filename="{fname}"\r\n'.encode()
        body += f"Content-Type: {mime}\r\n\r\n".encode()
        body += content
        body += b"\r\n"
    body += f"--{boundary}--\r\n".encode()

    req = urllib.request.Request(url, data=bytes(body), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        log.error(f"TG HTTP {e.code}: {e.read().decode()}")
        raise


def send_message(chat_id: int, text: str, reply_markup: dict = None, disable_preview: bool = False):
    data = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": disable_preview,
    }
    if reply_markup:
        data["reply_markup"] = reply_markup
    return tg_request("sendMessage", data)


def send_photo(chat_id: int, photo_path: Path, caption: str = None):
    if not photo_path.exists():
        log.warning(f"Photo not found: {photo_path}")
        return None
    content = photo_path.read_bytes()
    mime = mimetypes.guess_type(str(photo_path))[0] or "image/png"
    fields = {"chat_id": str(chat_id), "parse_mode": "HTML"}
    if caption:
        fields["caption"] = caption
    return tg_multipart("sendPhoto", fields, {"photo": (photo_path.name, content, mime)})


def send_document(chat_id: int, filename: str, content: bytes, caption: str = None, mime: str = "text/markdown"):
    fields = {"chat_id": str(chat_id), "parse_mode": "HTML"}
    if caption:
        fields["caption"] = caption
    return tg_multipart("sendDocument", fields, {"document": (filename, content, mime)})


def inline_keyboard(*rows):
    keyboard = []
    for row in rows:
        kb_row = []
        for item in row:
            if isinstance(item, tuple):
                label, data = item
                kb_row.append({"text": label, "callback_data": data})
            elif isinstance(item, dict):
                kb_row.append(item)
        keyboard.append(kb_row)
    return {"inline_keyboard": keyboard}


def answer_callback(cb_id: str, text: str = None):
    data = {"callback_query_id": cb_id}
    if text:
        data["text"] = text
    return tg_request("answerCallbackQuery", data)


def set_bot_commands():
    """Register commands in BotFather menu."""
    commands = [
        {"command": "start", "description": "Iniciar el bot"},
        {"command": "registrar", "description": "Registrar estado de animo"},
        {"command": "checkin", "description": "Check-in diario (sueno, energia, estres)"},
        {"command": "progreso", "description": "Ver progreso emocional"},
        {"command": "stats", "description": "Estadisticas avanzadas"},
        {"command": "journal", "description": "Escribir en el diario libre"},
        {"command": "buscar", "description": "Buscar en tus entradas"},
        {"command": "exportar", "description": "Exportar tu diario"},
        {"command": "respirar", "description": "Ejercicios de respiracion"},
        {"command": "grounding", "description": "Ejercicio 5-4-3-2-1 anti-ansiedad"},
        {"command": "frase", "description": "Afirmacion o frase inspiradora"},
        {"command": "pregunta", "description": "Pregunta de reflexion semanal"},
        {"command": "test_apego", "description": "Test rapido de estilos de apego"},
        {"command": "tip", "description": "Tip de psicologia"},
        {"command": "blog", "description": "Articulos del blog Egoera"},
        {"command": "recordatorio", "description": "Configurar recordatorio diario"},
        {"command": "sos", "description": "Modo emergencia / recursos"},
        {"command": "kaixo", "description": "Saludo en euskera"},
        {"command": "ayuda", "description": "Ver todos los comandos"},
        {"command": "contacto", "description": "Contacto con Egoera"},
        {"command": "web", "description": "Ir a egoera.es"},
    ]
    try:
        tg_request("setMyCommands", {"commands": commands})
        log.info(f"Registered {len(commands)} bot commands.")
    except Exception as e:
        log.warning(f"setMyCommands failed: {e}")


# ============ USER DATA ============

def user_file(chat_id: int) -> Path:
    return DATA_DIR / f"user_{chat_id}.json"


def get_user_data(chat_id: int) -> dict:
    f = user_file(chat_id)
    if f.exists():
        try:
            data = json.loads(f.read_text())
        except Exception:
            data = {}
    else:
        data = {}
    # Defaults (merge-friendly so old users get new fields)
    defaults = {
        "entries": [],
        "journal": [],        # [{id, date, time, text}]
        "checkins": [],       # [{date, time, sleep, energy, stress}]
        "groundings": [],     # [{date, time, visto, tocado, oido, olido, saboreado}]
        "weekly_answers": [], # [{week, question, answer, date}]
        "streak": 0,
        "last_entry_date": None,
        "reminders": False,
        "reminder_time": "20:00",
        "first_name": "",
        "attachment_style": None,
        "last_low_mood_alert": None,
        "registered_at": datetime.datetime.now().isoformat(),
    }
    for k, v in defaults.items():
        data.setdefault(k, v)
    return data


def save_user_data(chat_id: int, data: dict):
    user_file(chat_id).write_text(json.dumps(data, indent=2, ensure_ascii=False))


def list_all_users() -> list:
    return [int(f.stem.replace("user_", "")) for f in DATA_DIR.glob("user_*.json")]


def compute_streak(entries: list) -> int:
    if not entries:
        return 0
    dates = sorted({e["date"] for e in entries}, reverse=True)
    today = datetime.date.today().isoformat()
    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
    if dates[0] not in (today, yesterday):
        return 0
    streak = 0
    check = datetime.date.fromisoformat(dates[0])
    for d in dates:
        d_obj = datetime.date.fromisoformat(d)
        if d_obj == check:
            streak += 1
            check -= datetime.timedelta(days=1)
        else:
            break
    return streak


# ============ COMMAND HANDLERS ============

def handle_start(chat_id: int, first_name: str):
    user = get_user_data(chat_id)
    user["first_name"] = first_name
    save_user_data(chat_id, user)

    # Send logo photo first (silently skip if not present)
    try:
        send_photo(chat_id, LOGO_PATH, caption=f"<b>Egoera Psikologia</b>\n<i>Tu estado importa.</i>")
    except Exception as e:
        log.warning(f"Logo send failed: {e}")

    text = f"""🧠 <b>Kaixo {first_name}! Bienvenido/a a Egoera</b>

Soy tu asistente de bienestar emocional. Estoy aqui para acompanarte.

<b>📝 Diario:</b>
/registrar — registrar estado de animo
/checkin — sueno, energia y estres
/journal — diario libre
/progreso /stats — ver tu evolucion
/buscar /exportar — gestionar entradas

<b>🧘 Tecnicas:</b>
/respirar — respiracion guiada
/grounding — ejercicio 5-4-3-2-1
/frase — afirmaciones
/pregunta — reflexion semanal
/test_apego — test de apego

<b>📚 Contenido:</b>
/tip /blog /web

<b>⚙️ Otros:</b>
/recordatorio /sos /kaixo /ayuda /contacto

<b>Tu estado importa.</b> Por donde empezamos?"""

    keyboard = inline_keyboard(
        [("📝 Registrar", "cmd_registrar"), ("🧘 Respirar", "cmd_respirar")],
        [("📊 Progreso", "cmd_progreso"), ("💡 Tip", "cmd_tip")],
        [("💬 Frase", "cmd_frase"), ("📚 Blog", "cmd_blog")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def handle_registrar(chat_id: int):
    set_state(chat_id, None)
    text = "📝 <b>Como te sientes ahora?</b>\n\nSelecciona tu estado de animo:"
    keyboard = inline_keyboard(
        [("😢 Muy mal", "mood_1"), ("😟 Mal", "mood_2"), ("😐 Normal", "mood_3")],
        [("😊 Bien", "mood_4"), ("😄 Excelente", "mood_5")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def handle_mood_callback(chat_id: int, cb_id: str, mood_num: str):
    mood = MOODS.get(mood_num)
    if not mood:
        answer_callback(cb_id, "Opcion no valida")
        return

    user = get_user_data(chat_id)
    today = datetime.date.today().isoformat()
    now = datetime.datetime.now().strftime("%H:%M")

    entry = {
        "date": today,
        "time": now,
        "mood": mood["value"],
        "mood_label": mood["label"],
        "emoji": mood["emoji"],
        "note": "",
        "tags": [],
    }
    user["entries"] = [e for e in user.get("entries", []) if e["date"] != today]
    user["entries"].append(entry)
    user["last_entry_date"] = today
    user["streak"] = compute_streak(user["entries"])
    save_user_data(chat_id, user)

    answer_callback(cb_id, f"Registrado: {mood['label']}")

    streak_text = f"🔥 Racha: <b>{user['streak']} dia{'s' if user['streak'] != 1 else ''}</b>" if user["streak"] > 0 else ""

    text = f"""✅ <b>Registro guardado</b>

{mood['emoji']} <b>{mood['label']}</b>
📅 {today} a las {now}
{streak_text}

<b>Quieres anadir una nota?</b>
Envia un mensaje y lo guardare con tu registro."""

    rows = [
        [("💡 Tip", "cmd_tip"), ("📊 Progreso", "cmd_progreso")],
        [("💬 Frase", "cmd_frase")],
    ]
    # Mood <=2 → suggest tools
    if mood["value"] <= 2:
        text += "\n\n<i>Veo que hoy no estas en un buen momento. Te acompano con algo?</i>"
        rows = [
            [("🧘 Respirar", "cmd_respirar"), ("🌱 Grounding", "cmd_grounding")],
            [("📖 Journal", "cmd_journal"), ("💬 Frase", "cmd_frase")],
            [("📚 Articulo: ansiedad", "blog_mitos-ansiedad")],
            [("🆘 /sos", "cmd_sos")],
        ]

    send_message(chat_id, text, reply_markup=inline_keyboard(*rows))


def handle_progreso(chat_id: int):
    user = get_user_data(chat_id)
    entries = user.get("entries", [])

    if not entries:
        send_message(chat_id, "📊 Aun no tienes registros. Usa /registrar para empezar tu diario emocional.")
        return

    total = len(entries)
    avg = sum(e["mood"] for e in entries) / total
    streak = user.get("streak", 0)
    recent = sorted(entries, key=lambda e: e["date"])[-7:]
    timeline = " ".join(e["emoji"] for e in recent)

    dist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for e in entries:
        dist[e["mood"]] = dist.get(e["mood"], 0) + 1
    max_count = max(dist.values()) if dist.values() else 1
    dist_text = ""
    for k in sorted(dist.keys()):
        m = MOODS[str(k)]
        count = dist[k]
        bar_length = int((count / max_count) * 10) if max_count else 0
        bar = "▓" * bar_length + "░" * (10 - bar_length)
        dist_text += f"{m['emoji']} <code>{bar}</code> {count}\n"

    avg_int = max(1, min(5, round(avg)))
    avg_emoji = MOODS[str(avg_int)]["emoji"]

    today = datetime.date.today()
    week_ago = today - datetime.timedelta(days=7)
    two_weeks_ago = today - datetime.timedelta(days=14)
    this_week = [e for e in entries if datetime.date.fromisoformat(e["date"]) >= week_ago]
    prev_week = [e for e in entries if week_ago > datetime.date.fromisoformat(e["date"]) >= two_weeks_ago]

    trend = ""
    if this_week and prev_week:
        avg_this = sum(e["mood"] for e in this_week) / len(this_week)
        avg_prev = sum(e["mood"] for e in prev_week) / len(prev_week)
        diff = avg_this - avg_prev
        if abs(diff) < 0.2:
            trend = "➡️ Estable esta semana"
        elif diff > 0:
            trend = f"📈 Mejorando (+{diff:.1f} vs semana pasada)"
        else:
            trend = f"📉 Bajando ({diff:.1f} vs semana pasada)"

    text = f"""📊 <b>Tu progreso emocional</b>

📝 Total registros: <b>{total}</b>
🔥 Racha actual: <b>{streak} dia{'s' if streak != 1 else ''}</b>
{avg_emoji} Media: <b>{avg:.1f}/5</b>

<b>Ultimos {len(recent)} dias:</b>
{timeline}

<b>Distribucion de animo:</b>
{dist_text}
{trend}

Para mas detalle usa /stats."""
    keyboard = inline_keyboard(
        [("📈 Estadisticas avanzadas", "cmd_stats"), ("📝 Registrar hoy", "cmd_registrar")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def handle_stats(chat_id: int):
    user = get_user_data(chat_id)
    entries = user.get("entries", [])
    if len(entries) < 3:
        send_message(chat_id, "📈 Necesitas al menos 3 registros para ver estadisticas avanzadas. Sigue registrando con /registrar.")
        return

    moods = [e["mood"] for e in entries]
    avg = statistics.fmean(moods)
    stdev = statistics.pstdev(moods) if len(moods) > 1 else 0

    # Best / worst weekday
    weekday_names = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
    by_weekday = defaultdict(list)
    for e in entries:
        wd = datetime.date.fromisoformat(e["date"]).weekday()
        by_weekday[wd].append(e["mood"])
    avg_by_wd = {wd: statistics.fmean(v) for wd, v in by_weekday.items() if v}
    best_wd = max(avg_by_wd, key=avg_by_wd.get) if avg_by_wd else None
    worst_wd = min(avg_by_wd, key=avg_by_wd.get) if avg_by_wd else None

    # Most frequent hour
    hours = [int(e.get("time", "00:00").split(":")[0]) for e in entries if e.get("time")]
    freq_hour = Counter(hours).most_common(1)[0][0] if hours else None

    # Tag / emotion correlation (from entries notes/tags + journal)
    tag_counter = Counter()
    tag_mood = defaultdict(list)
    for e in entries:
        for t in e.get("tags", []):
            tag_counter[t] += 1
            tag_mood[t].append(e["mood"])
    # Also scan notes for EMOTIONS keywords
    for e in entries:
        note = (e.get("note") or "").lower()
        for emo in EMOTIONS:
            if emo.lower() in note:
                tag_counter[emo] += 1
                tag_mood[emo].append(e["mood"])
    top_tags = tag_counter.most_common(3)

    # Checkins averages
    checkins = user.get("checkins", [])
    checkin_line = ""
    if checkins:
        sleep_avg = statistics.fmean([c["sleep"] for c in checkins])
        energy_avg = statistics.fmean([c["energy"] for c in checkins])
        stress_avg = statistics.fmean([c["stress"] for c in checkins])
        checkin_line = (
            f"\n<b>Check-ins ({len(checkins)}):</b>\n"
            f"😴 Sueno: <b>{sleep_avg:.1f}/5</b>\n"
            f"⚡ Energia: <b>{energy_avg:.1f}/5</b>\n"
            f"🔥 Estres: <b>{stress_avg:.1f}/5</b>\n"
        )

    text = f"""📈 <b>Estadisticas avanzadas</b>

📊 Media global: <b>{avg:.2f}/5</b>
📉 Variabilidad (σ): <b>{stdev:.2f}</b>
📝 Registros totales: <b>{len(entries)}</b>
📖 Journal: <b>{len(user.get('journal', []))}</b>

<b>Dia mejor:</b> {weekday_names[best_wd] if best_wd is not None else '—'} ({avg_by_wd[best_wd]:.1f}/5)
<b>Dia peor:</b> {weekday_names[worst_wd] if worst_wd is not None else '—'} ({avg_by_wd[worst_wd]:.1f}/5)
<b>Hora mas frecuente:</b> {f'{freq_hour:02d}:00' if freq_hour is not None else '—'}
"""
    if top_tags:
        text += "\n<b>Emociones/tags mas frecuentes:</b>\n"
        for t, c in top_tags:
            mood_avg = statistics.fmean(tag_mood[t])
            text += f"• {t} — {c} veces (animo medio {mood_avg:.1f})\n"
    text += checkin_line

    if stdev > 1.0:
        text += "\n<i>Tu animo varia bastante. Puede ser util observar patrones (trabajo, descanso, relaciones).</i>"
    elif stdev < 0.5:
        text += "\n<i>Tu animo se mantiene estable. Observa si hay emocionalidad que se queda en silencio.</i>"

    send_message(chat_id, text)


def handle_tip(chat_id: int):
    tip = random.choice(TIPS)
    related_post = next((p for p in BLOG_POSTS if p["slug"] == tip["related"]), None)

    text = f"""💡 <b>Tip de psicologia</b>

{tip['text']}

<i>— {tip['source']}</i>"""

    keyboard_rows = []
    if related_post:
        keyboard_rows.append([{
            "text": f"📚 Leer: {related_post['title']}",
            "url": f"https://egoera.es/{related_post['slug']}/",
        }])
    keyboard_rows.append([
        {"text": "💡 Otro tip", "callback_data": "cmd_tip"},
        {"text": "📝 Registrar", "callback_data": "cmd_registrar"},
    ])
    send_message(chat_id, text, reply_markup={"inline_keyboard": keyboard_rows})


def handle_blog(chat_id: int):
    picks = random.sample(BLOG_POSTS, min(5, len(BLOG_POSTS)))
    text = "📚 <b>Articulos del blog de Egoera</b>\n\n"
    for p in picks:
        text += f"• <a href=\"https://egoera.es/{p['slug']}/\">{p['title']}</a>\n"
    text += f"\n🌐 Ver todos: <a href=\"https://egoera.es/blog/\">egoera.es/blog</a>"
    keyboard = inline_keyboard([{"text": "🌐 Ir al blog", "url": "https://egoera.es/blog/"}])
    send_message(chat_id, text, reply_markup=keyboard)


def handle_frase(chat_id: int):
    quote, author = random.choice(AFFIRMATIONS)
    text = f"""💬 <b>Afirmacion del momento</b>

"{quote}"

<i>— {author}</i>"""
    keyboard = inline_keyboard([
        ("💬 Otra frase", "cmd_frase"),
        ("📖 Journal", "cmd_journal"),
    ])
    send_message(chat_id, text, reply_markup=keyboard)


def handle_pregunta(chat_id: int):
    week = datetime.date.today().isocalendar()[1]
    idx = (week - 1) % len(WEEKLY_QUESTIONS)
    question = WEEKLY_QUESTIONS[idx]
    set_state(chat_id, {"flow": "pregunta", "week": week, "question": question})
    text = f"""🧘 <b>Pregunta de la semana {week}</b>

{question}

<i>Responde con un mensaje cuando quieras. Guardare tu respuesta junto a tu diario. Escribe /cancelar para salir.</i>"""
    send_message(chat_id, text)


def handle_pregunta_response(chat_id: int, state: dict, text: str):
    user = get_user_data(chat_id)
    user["weekly_answers"].append({
        "week": state["week"],
        "question": state["question"],
        "answer": text,
        "date": datetime.datetime.now().isoformat(),
    })
    save_user_data(chat_id, user)
    set_state(chat_id, None)
    send_message(chat_id, "🪶 <b>Respuesta guardada.</b>\n\nEsta reflexion queda en tu historial. Puedes verla con /exportar.")


# ----- Respirar -----

def handle_respirar(chat_id: int):
    set_state(chat_id, None)
    text = """🧘 <b>Ejercicios de respiracion</b>

Elige una tecnica. Te guiare paso a paso."""
    keyboard = inline_keyboard(
        [("4-7-8 (Weil)", "resp_478")],
        [("Cuadrada (4-4-4-4)", "resp_box")],
        [("Diafragmatica", "resp_diaf")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def run_breathing(chat_id: int, pattern_key: str):
    pat = BREATHING_PATTERNS.get(pattern_key)
    if not pat:
        return
    send_message(
        chat_id,
        f"🧘 <b>{pat['name']}</b>\n\n{pat['desc']}\n\nPreparate. Haremos {pat['cycles']} ciclos.",
    )
    time.sleep(2)
    for cycle in range(1, pat["cycles"] + 1):
        send_message(chat_id, f"🔄 <b>Ciclo {cycle}/{pat['cycles']}</b>")
        for label, secs in pat["steps"]:
            # Send header
            send_message(chat_id, f"{label} — <b>{secs}s</b>")
            time.sleep(max(1, secs))
    send_message(
        chat_id,
        "✅ <b>Ejercicio completado.</b>\n\nObserva tu cuerpo. Notas algun cambio?\n\nPuedes repetir o registrarlo con /registrar.",
        reply_markup=inline_keyboard(
            [("🔁 Repetir", f"resp_{pattern_key}"), ("📝 Registrar", "cmd_registrar")],
        ),
    )


# ----- Grounding 5-4-3-2-1 -----

GROUNDING_STEPS = [
    ("visto", 5, "👀 <b>5 cosas que ves</b>\n\nMira alrededor y escribe 5 cosas que veas ahora mismo. Pueden ser detalles pequenos (un reflejo, una textura). Envialas separadas por comas o en un mensaje."),
    ("tocado", 4, "✋ <b>4 cosas que puedes tocar</b>\n\nTocalas realmente. Siente la temperatura, textura, peso. Escribe 4."),
    ("oido", 3, "👂 <b>3 cosas que oyes</b>\n\nEscucha 10 segundos con atencion. Escribe 3 sonidos (aunque sean sutiles)."),
    ("olido", 2, "👃 <b>2 cosas que hueles</b>\n\nSi no hueles nada obvio, acerca la nariz a tu ropa, cafe, mano... Escribe 2."),
    ("saboreado", 1, "👅 <b>1 cosa que saboreas</b>\n\nPuede ser el sabor residual en tu boca, un sorbo de agua. Escribe 1."),
]


def handle_grounding(chat_id: int):
    set_state(chat_id, {"flow": "grounding", "step": 0, "answers": {}})
    send_message(
        chat_id,
        "🌱 <b>Grounding 5-4-3-2-1</b>\n\nEjercicio DBT para volver al presente cuando la ansiedad sube.\nTe guiare paso a paso. Puedes escribir /cancelar para salir.\n",
    )
    send_message(chat_id, GROUNDING_STEPS[0][2])


def handle_grounding_response(chat_id: int, state: dict, text: str):
    step = state["step"]
    key, n, _ = GROUNDING_STEPS[step]
    state["answers"][key] = text
    state["step"] += 1
    if state["step"] < len(GROUNDING_STEPS):
        set_state(chat_id, state)
        send_message(chat_id, GROUNDING_STEPS[state["step"]][2])
    else:
        user = get_user_data(chat_id)
        record = {
            "date": datetime.date.today().isoformat(),
            "time": datetime.datetime.now().strftime("%H:%M"),
            **state["answers"],
        }
        user["groundings"].append(record)
        save_user_data(chat_id, user)
        set_state(chat_id, None)
        summary = "\n".join([f"• <b>{k}:</b> {v[:80]}" for k, v in state["answers"].items()])
        send_message(
            chat_id,
            f"✅ <b>Grounding completado</b>\n\n{summary}\n\nCentrate en tu respiracion unos segundos mas. Estas aqui, estas a salvo.",
            reply_markup=inline_keyboard([("🧘 Respirar", "cmd_respirar"), ("📝 Registrar animo", "cmd_registrar")]),
        )


# ----- Check-in diario -----

CHECKIN_STEPS = [
    ("sleep", "😴 <b>Como has dormido?</b> (1 = fatal, 5 = perfecto)"),
    ("energy", "⚡ <b>Nivel de energia</b> (1 = agotado/a, 5 = lleno/a)"),
    ("stress", "🔥 <b>Nivel de estres</b> (1 = muy calmado/a, 5 = desbordado/a)"),
]


def handle_checkin(chat_id: int):
    set_state(chat_id, {"flow": "checkin", "step": 0, "answers": {}})
    send_message(chat_id, "🩺 <b>Check-in diario</b>\n\nTres preguntas rapidas.")
    send_message(
        chat_id,
        CHECKIN_STEPS[0][1],
        reply_markup=inline_keyboard([(str(i), f"chk_{CHECKIN_STEPS[0][0]}_{i}") for i in range(1, 6)]),
    )


def handle_checkin_callback(chat_id: int, cb_id: str, data: str):
    state = get_state(chat_id)
    if not state or state.get("flow") != "checkin":
        answer_callback(cb_id, "Sesion expirada. Usa /checkin de nuevo.")
        return
    _, key, val = data.split("_")
    state["answers"][key] = int(val)
    state["step"] += 1
    answer_callback(cb_id, f"{key}: {val}")

    if state["step"] < len(CHECKIN_STEPS):
        set_state(chat_id, state)
        next_key, next_q = CHECKIN_STEPS[state["step"]]
        send_message(
            chat_id,
            next_q,
            reply_markup=inline_keyboard([(str(i), f"chk_{next_key}_{i}") for i in range(1, 6)]),
        )
    else:
        user = get_user_data(chat_id)
        record = {
            "date": datetime.date.today().isoformat(),
            "time": datetime.datetime.now().strftime("%H:%M"),
            **state["answers"],
        }
        user["checkins"].append(record)
        save_user_data(chat_id, user)
        set_state(chat_id, None)
        s, e, st = state["answers"]["sleep"], state["answers"]["energy"], state["answers"]["stress"]
        send_message(
            chat_id,
            f"""✅ <b>Check-in guardado</b>

😴 Sueno: <b>{s}/5</b>
⚡ Energia: <b>{e}/5</b>
🔥 Estres: <b>{st}/5</b>

Veremos correlaciones en /stats cuando tengas mas datos.""",
        )


# ----- Journal libre -----

def handle_journal(chat_id: int):
    set_state(chat_id, {"flow": "journal"})
    send_message(
        chat_id,
        "📖 <b>Journal libre</b>\n\nEscribe lo que necesites. Se guardara con fecha y hora.\nEscribe /cancelar para salir.",
    )


def handle_journal_entry(chat_id: int, text: str):
    user = get_user_data(chat_id)
    entry = {
        "id": uuid.uuid4().hex[:8],
        "date": datetime.date.today().isoformat(),
        "time": datetime.datetime.now().strftime("%H:%M"),
        "text": text,
    }
    user["journal"].append(entry)
    save_user_data(chat_id, user)
    set_state(chat_id, None)
    send_message(
        chat_id,
        f"✅ <b>Entrada guardada</b> ({entry['date']} {entry['time']})\n\nTienes <b>{len(user['journal'])}</b> entradas en tu diario libre.",
        reply_markup=inline_keyboard(
            [("🔎 Buscar", "cmd_buscar"), ("📤 Exportar", "cmd_exportar"), ("📖 Otra entrada", "cmd_journal")],
        ),
    )


# ----- Buscar -----

def handle_buscar(chat_id: int):
    set_state(chat_id, {"flow": "buscar"})
    send_message(
        chat_id,
        "🔎 <b>Buscar en tu diario</b>\n\nEnvia una palabra clave o una fecha (YYYY-MM-DD). Escribe /cancelar para salir.",
    )


def handle_buscar_query(chat_id: int, query: str):
    user = get_user_data(chat_id)
    set_state(chat_id, None)
    q = query.strip().lower()

    results = []
    is_date = False
    try:
        datetime.date.fromisoformat(query.strip())
        is_date = True
    except ValueError:
        pass

    for j in user.get("journal", []):
        if is_date and j["date"] == query.strip():
            results.append(("journal", j))
        elif not is_date and q in j["text"].lower():
            results.append(("journal", j))
    for e in user.get("entries", []):
        note = (e.get("note") or "").lower()
        if is_date and e["date"] == query.strip():
            results.append(("mood", e))
        elif not is_date and (q in note or q in e["mood_label"].lower()):
            results.append(("mood", e))
    for w in user.get("weekly_answers", []):
        if is_date and w["date"].startswith(query.strip()):
            results.append(("weekly", w))
        elif not is_date and (q in w["answer"].lower() or q in w["question"].lower()):
            results.append(("weekly", w))

    if not results:
        send_message(chat_id, f"🔎 Sin resultados para <b>{query}</b>.")
        return

    lines = [f"🔎 <b>{len(results)} resultado(s) para {query}</b>\n"]
    for kind, r in results[:15]:
        if kind == "journal":
            lines.append(f"📖 {r['date']} {r['time']} — {r['text'][:120]}")
        elif kind == "mood":
            lines.append(f"📝 {r['date']} {r.get('time','')} — {r['emoji']} {r['mood_label']} {('— ' + r['note'][:100]) if r.get('note') else ''}")
        elif kind == "weekly":
            lines.append(f"🧘 {r['date'][:10]} (sem {r['week']}) — {r['answer'][:120]}")
    if len(results) > 15:
        lines.append(f"\n<i>Mostrando primeros 15 de {len(results)}. Usa /exportar para el listado completo.</i>")
    send_message(chat_id, "\n\n".join(lines))


# ----- Exportar -----

def handle_exportar(chat_id: int):
    user = get_user_data(chat_id)
    name = user.get("first_name") or f"user{chat_id}"
    lines = [f"# Diario Egoera — {name}", f"_Exportado el {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}_", ""]

    entries = sorted(user.get("entries", []), key=lambda e: (e["date"], e.get("time", "")))
    if entries:
        lines.append("## Registros de animo\n")
        for e in entries:
            lines.append(f"- **{e['date']} {e.get('time','')}** — {e['emoji']} {e['mood_label']} ({e['mood']}/5)")
            if e.get("note"):
                lines.append(f"  > {e['note']}")
        lines.append("")

    journal = sorted(user.get("journal", []), key=lambda j: (j["date"], j["time"]))
    if journal:
        lines.append("## Journal libre\n")
        for j in journal:
            lines.append(f"### {j['date']} {j['time']}")
            lines.append(j["text"])
            lines.append("")

    checkins = sorted(user.get("checkins", []), key=lambda c: (c["date"], c.get("time", "")))
    if checkins:
        lines.append("## Check-ins (sueno / energia / estres)\n")
        for c in checkins:
            lines.append(f"- {c['date']} {c.get('time','')} — sueno {c['sleep']}/5 · energia {c['energy']}/5 · estres {c['stress']}/5")
        lines.append("")

    groundings = sorted(user.get("groundings", []), key=lambda g: (g["date"], g.get("time", "")))
    if groundings:
        lines.append("## Grounding 5-4-3-2-1\n")
        for g in groundings:
            lines.append(f"### {g['date']} {g.get('time','')}")
            for k in ("visto", "tocado", "oido", "olido", "saboreado"):
                if g.get(k):
                    lines.append(f"- **{k}:** {g[k]}")
            lines.append("")

    weekly = sorted(user.get("weekly_answers", []), key=lambda w: w["date"])
    if weekly:
        lines.append("## Preguntas semanales\n")
        for w in weekly:
            lines.append(f"### Semana {w['week']} — {w['date'][:10]}")
            lines.append(f"**{w['question']}**")
            lines.append("")
            lines.append(w["answer"])
            lines.append("")

    if len(lines) <= 3:
        send_message(chat_id, "📤 Aun no tienes contenido para exportar. Usa /registrar, /journal, /checkin o /pregunta.")
        return

    content = "\n".join(lines).encode("utf-8")
    fname = f"egoera-diario-{datetime.date.today().isoformat()}.md"
    send_document(chat_id, fname, content, caption=f"📤 Tu diario completo ({len(entries)} registros, {len(journal)} journals, {len(checkins)} check-ins).")


# ----- Test apego -----

def handle_test_apego(chat_id: int):
    set_state(chat_id, {"flow": "test_apego", "step": 0, "scores": {"A": 0, "B": 0, "C": 0, "D": 0}})
    send_message(
        chat_id,
        "💞 <b>Test rapido de estilos de apego</b>\n\n5 preguntas. Responde con la opcion que mas se ajuste a ti. No hay opciones correctas. Escribe /cancelar para salir.",
    )
    send_apego_question(chat_id, 0)


def send_apego_question(chat_id: int, step: int):
    q = ATTACHMENT_TEST[step]
    text = f"<b>Pregunta {step + 1}/5</b>\n\n{q['q']}"
    rows = []
    for i, (label, code) in enumerate(q["options"]):
        rows.append([(f"{chr(65+i)}. {label}", f"apg_{step}_{code}")])
    send_message(chat_id, text, reply_markup=inline_keyboard(*rows))


def handle_apego_callback(chat_id: int, cb_id: str, data: str):
    state = get_state(chat_id)
    if not state or state.get("flow") != "test_apego":
        answer_callback(cb_id, "Sesion expirada. Usa /test_apego.")
        return
    _, step_str, code = data.split("_")
    step = int(step_str)
    state["scores"][code] = state["scores"].get(code, 0) + 1
    state["step"] = step + 1
    answer_callback(cb_id, f"Respuesta: {code}")
    if state["step"] < len(ATTACHMENT_TEST):
        set_state(chat_id, state)
        send_apego_question(chat_id, state["step"])
    else:
        best = max(state["scores"], key=state["scores"].get)
        prof = ATTACHMENT_PROFILES[best]
        user = get_user_data(chat_id)
        user["attachment_style"] = best
        save_user_data(chat_id, user)
        set_state(chat_id, None)
        text = f"""💞 <b>Tu estilo dominante: {prof['name']}</b>

{prof['text']}

<i>Este test es orientativo y no sustituye una evaluacion profesional.</i>"""
        keyboard = inline_keyboard([{
            "text": "📚 Leer: Los 4 estilos de apego",
            "url": "https://egoera.es/estilos-de-apego/",
        }])
        send_message(chat_id, text, reply_markup=keyboard)


# ----- Recordatorio personalizable -----

def handle_recordatorio(chat_id: int):
    user = get_user_data(chat_id)
    status = "activado" if user.get("reminders") else "desactivado"
    hr = user.get("reminder_time", "20:00")
    text = f"""🔔 <b>Recordatorio diario</b>

Estado: <b>{status}</b>
Hora: <b>{hr}</b>

Que quieres hacer?"""
    rows = [
        [("🔔 Activar/Desactivar", "rem_toggle")],
        [("⏰ Cambiar hora", "rem_sethour")],
    ]
    send_message(chat_id, text, reply_markup=inline_keyboard(*rows))


def handle_recordatorio_toggle(chat_id: int, cb_id: str):
    user = get_user_data(chat_id)
    user["reminders"] = not user.get("reminders", False)
    save_user_data(chat_id, user)
    answer_callback(cb_id, "Recordatorio " + ("activado" if user["reminders"] else "desactivado"))
    if user["reminders"]:
        send_message(chat_id, f"🔔 Recordatorios <b>activados</b>. Te escribire cada dia a las <b>{user['reminder_time']}</b>.")
    else:
        send_message(chat_id, "🔕 Recordatorios <b>desactivados</b>.")


def handle_recordatorio_sethour(chat_id: int, cb_id: str):
    answer_callback(cb_id)
    set_state(chat_id, {"flow": "set_hour"})
    send_message(chat_id, "⏰ Envia la hora en formato <b>HH:MM</b> (24h). Ej: <code>20:00</code> o <code>08:30</code>.\n\n/cancelar para salir.")


def handle_sethour_response(chat_id: int, text: str):
    txt = text.strip()
    try:
        hh, mm = txt.split(":")
        hh, mm = int(hh), int(mm)
        if not (0 <= hh <= 23 and 0 <= mm <= 59):
            raise ValueError
    except Exception:
        send_message(chat_id, "❌ Formato no valido. Usa HH:MM (24h). Ej: 20:00.")
        return
    user = get_user_data(chat_id)
    user["reminder_time"] = f"{hh:02d}:{mm:02d}"
    user["reminders"] = True
    save_user_data(chat_id, user)
    set_state(chat_id, None)
    send_message(chat_id, f"✅ Hora de recordatorio guardada: <b>{user['reminder_time']}</b>. Recordatorios <b>activados</b>.")


# ----- SOS -----

def handle_sos(chat_id: int):
    keyboard = inline_keyboard(
        [("🧘 Respirar", "cmd_respirar"), ("🌱 Grounding", "cmd_grounding")],
        [("💬 Frase", "cmd_frase")],
        [{"text": "📧 Contactar con Ander", "url": "mailto:hola@egoera.es"}],
    )
    send_message(chat_id, SOS_TEXT, reply_markup=keyboard, disable_preview=True)


# ----- Kaixo (euskera) -----

def handle_kaixo(chat_id: int):
    user = get_user_data(chat_id)
    name = user.get("first_name", "")
    text = f"""🇪🇺 <b>{EUSKERA['hello']}{', ' + name if name else ''}!</b>

{EUSKERA['welcome']} Egoera-ra. {EUSKERA['thanks']} hemen egoteagatik.

<b>Mini hiztegia:</b>
• Kaixo — Hola
• Egun on — Buenos dias
• Gabon — Buenas noches
• Eskerrik asko — Muchas gracias
• Agur — Adios

<i>Egoera tambien trabaja en euskera. Contacta con Ander si prefieres sesiones en euskera.</i>"""
    send_message(chat_id, text)


# ----- Ayuda / contacto / web -----

def handle_ayuda(chat_id: int):
    text = """ℹ️ <b>Comandos disponibles</b>

<b>📝 Diario:</b>
/registrar — nuevo registro de animo
/checkin — sueno, energia, estres
/journal — diario libre
/progreso — estadisticas basicas
/stats — estadisticas avanzadas
/buscar — buscar entradas
/exportar — exportar todo (markdown)

<b>🧘 Tecnicas:</b>
/respirar — respiracion guiada (4-7-8, cuadrada, diafragmatica)
/grounding — ejercicio 5-4-3-2-1 para la ansiedad
/frase — afirmacion inspiradora
/pregunta — pregunta de reflexion semanal
/test_apego — test rapido de estilos de apego

<b>📚 Contenido:</b>
/tip — tip de psicologia
/blog — articulos del blog
/web — egoera.es

<b>⚙️ Otros:</b>
/recordatorio — recordatorio diario personalizable
/sos — modo emergencia
/kaixo — saludo en euskera
/contacto — contacto
/cancelar — salir de cualquier flujo en curso

<b>Texto libre:</b> si escribes cualquier mensaje fuera de un flujo y tienes registro hoy, lo guardo como nota."""
    send_message(chat_id, text, disable_preview=True)


def handle_contacto(chat_id: int):
    text = """📞 <b>Contacto — Egoera Psikologia</b>

📧 Email: <a href="mailto:hola@egoera.es">hola@egoera.es</a>
🌐 Web: <a href="https://egoera.es">egoera.es</a>
📸 Instagram: @egoera.psikologia
🎵 TikTok: @egoera.psikologia
🎬 YouTube: @egoerapsikologia

<b>Tu estado importa.</b>"""
    send_message(chat_id, text, disable_preview=True)


def handle_cancelar(chat_id: int):
    state = get_state(chat_id)
    set_state(chat_id, None)
    if state:
        send_message(chat_id, f"✅ Cancelado el flujo: <b>{state.get('flow')}</b>.")
    else:
        send_message(chat_id, "No tenias ningun flujo abierto.")


# ============ TEXT ROUTER (notes / flows) ============

def handle_text_note(chat_id: int, text: str):
    """Save free text as note on today's latest mood entry."""
    user = get_user_data(chat_id)
    today = datetime.date.today().isoformat()
    today_entries = [e for e in user.get("entries", []) if e["date"] == today]

    if not today_entries:
        send_message(
            chat_id,
            "📝 No tienes registro de hoy todavia.\n\nUsa /registrar o /journal para escribir libre.",
        )
        return

    last = today_entries[-1]
    last["note"] = (last["note"] + f"\n{text}") if last.get("note") else text
    # Auto-tag emotions mentioned in the note
    lowered = text.lower()
    for emo in EMOTIONS:
        if emo.lower() in lowered and emo not in last.get("tags", []):
            last.setdefault("tags", []).append(emo)
    save_user_data(chat_id, user)
    send_message(
        chat_id,
        f"📝 Nota anadida a tu registro de hoy ({last['emoji']} {last['mood_label']}).\n\n<i>{text[:200]}{'...' if len(text) > 200 else ''}</i>\n\n/progreso para ver tu historial.",
    )


# ============ UPDATE ROUTER ============

def process_update(update: dict):
    # Callback queries
    if "callback_query" in update:
        cb = update["callback_query"]
        cb_id = cb["id"]
        chat_id = cb["message"]["chat"]["id"]
        data = cb.get("data", "")

        if data.startswith("mood_"):
            handle_mood_callback(chat_id, cb_id, data.split("_")[1])
        elif data.startswith("resp_"):
            answer_callback(cb_id)
            threading.Thread(target=run_breathing, args=(chat_id, data.split("_", 1)[1]), daemon=True).start()
        elif data.startswith("chk_"):
            handle_checkin_callback(chat_id, cb_id, data)
        elif data.startswith("apg_"):
            handle_apego_callback(chat_id, cb_id, data)
        elif data.startswith("blog_"):
            slug = data.split("_", 1)[1]
            answer_callback(cb_id)
            send_message(chat_id, f"📚 <a href=\"https://egoera.es/{slug}/\">Leer articulo</a>")
        elif data == "rem_toggle":
            handle_recordatorio_toggle(chat_id, cb_id)
        elif data == "rem_sethour":
            handle_recordatorio_sethour(chat_id, cb_id)
        elif data == "cmd_registrar":
            answer_callback(cb_id); handle_registrar(chat_id)
        elif data == "cmd_progreso":
            answer_callback(cb_id); handle_progreso(chat_id)
        elif data == "cmd_stats":
            answer_callback(cb_id); handle_stats(chat_id)
        elif data == "cmd_tip":
            answer_callback(cb_id); handle_tip(chat_id)
        elif data == "cmd_blog":
            answer_callback(cb_id); handle_blog(chat_id)
        elif data == "cmd_frase":
            answer_callback(cb_id); handle_frase(chat_id)
        elif data == "cmd_respirar":
            answer_callback(cb_id); handle_respirar(chat_id)
        elif data == "cmd_grounding":
            answer_callback(cb_id); handle_grounding(chat_id)
        elif data == "cmd_journal":
            answer_callback(cb_id); handle_journal(chat_id)
        elif data == "cmd_buscar":
            answer_callback(cb_id); handle_buscar(chat_id)
        elif data == "cmd_exportar":
            answer_callback(cb_id); handle_exportar(chat_id)
        elif data == "cmd_sos":
            answer_callback(cb_id); handle_sos(chat_id)
        else:
            answer_callback(cb_id, "Accion desconocida")
        return

    msg = update.get("message")
    if not msg:
        return

    chat_id = msg["chat"]["id"]
    text = (msg.get("text") or "").strip()
    first_name = msg["chat"].get("first_name", "")

    # Commands — commands always break any flow except they may be /cancelar
    if text.startswith("/"):
        cmd = text.split()[0].lstrip("/").lower()
        if cmd == "cancelar":
            handle_cancelar(chat_id); return
        # Clear state for most commands
        if cmd not in ("journal",):  # journal sets its own state
            pass  # handlers call set_state as needed

        if cmd == "start":
            handle_start(chat_id, first_name)
        elif cmd == "registrar":
            handle_registrar(chat_id)
        elif cmd == "progreso":
            handle_progreso(chat_id)
        elif cmd == "stats":
            handle_stats(chat_id)
        elif cmd == "tip":
            handle_tip(chat_id)
        elif cmd == "blog":
            handle_blog(chat_id)
        elif cmd == "frase":
            handle_frase(chat_id)
        elif cmd == "pregunta":
            handle_pregunta(chat_id)
        elif cmd == "respirar":
            handle_respirar(chat_id)
        elif cmd == "grounding":
            handle_grounding(chat_id)
        elif cmd in ("journal", "diario"):
            handle_journal(chat_id)
        elif cmd == "buscar":
            handle_buscar(chat_id)
        elif cmd == "exportar":
            handle_exportar(chat_id)
        elif cmd == "checkin":
            handle_checkin(chat_id)
        elif cmd in ("test_apego", "testapego", "test-apego"):
            handle_test_apego(chat_id)
        elif cmd == "recordatorio":
            handle_recordatorio(chat_id)
        elif cmd == "sos":
            handle_sos(chat_id)
        elif cmd == "kaixo":
            handle_kaixo(chat_id)
        elif cmd in ("ayuda", "help"):
            handle_ayuda(chat_id)
        elif cmd == "contacto":
            handle_contacto(chat_id)
        elif cmd == "web":
            send_message(chat_id, "🌐 <b>egoera.es</b>\n\nBlog de psicologia y diario emocional.\n\n<a href=\"https://egoera.es\">Visitar la web →</a>")
        else:
            send_message(chat_id, "No reconozco ese comando. Usa /ayuda para ver los disponibles.")
        return

    if not text:
        return

    # Free text routing by active flow
    state = get_state(chat_id)
    if state:
        flow = state.get("flow")
        if flow == "grounding":
            handle_grounding_response(chat_id, state, text); return
        if flow == "journal":
            handle_journal_entry(chat_id, text); return
        if flow == "buscar":
            handle_buscar_query(chat_id, text); return
        if flow == "pregunta":
            handle_pregunta_response(chat_id, state, text); return
        if flow == "set_hour":
            handle_sethour_response(chat_id, text); return
        # checkin uses callback buttons; text falls through
    handle_text_note(chat_id, text)


# ============ SCHEDULED TASKS ============

def send_daily_reminders():
    """Send reminders to users whose reminder_time matches current HH:MM window."""
    now = datetime.datetime.now()
    today = now.date().isoformat()
    current = now.strftime("%H:%M")
    sent = 0
    for chat_id in list_all_users():
        user = get_user_data(chat_id)
        if not user.get("reminders"):
            continue
        # Match the hour precisely (allow 0-4 minute slippage handled by caller)
        if user.get("reminder_time", "20:00")[:2] != current[:2]:
            continue
        if user.get("last_entry_date") == today:
            continue
        try:
            send_message(
                chat_id,
                "🌙 <b>Recordatorio</b>\n\nHola. Aun no has registrado como te sientes hoy.\nUsa /registrar para anotar tu animo.",
                reply_markup=inline_keyboard([("📝 Registrar ahora", "cmd_registrar")]),
            )
            sent += 1
        except Exception as e:
            log.warning(f"Reminder failed for {chat_id}: {e}")
    log.info(f"Daily reminders sent: {sent}")


def send_weekly_summary():
    for chat_id in list_all_users():
        user = get_user_data(chat_id)
        entries = user.get("entries", [])
        if not entries:
            continue
        week_ago = datetime.date.today() - datetime.timedelta(days=7)
        this_week = [e for e in entries if datetime.date.fromisoformat(e["date"]) >= week_ago]
        if not this_week:
            continue
        avg = sum(e["mood"] for e in this_week) / len(this_week)
        avg_emoji = MOODS[str(max(1, min(5, round(avg))))]["emoji"]
        tip = random.choice(TIPS)
        text = f"""📅 <b>Tu semana en Egoera</b>

Esta semana has registrado {len(this_week)} dias.
{avg_emoji} Media semanal: <b>{avg:.1f}/5</b>
🔥 Racha actual: <b>{user.get('streak', 0)} dias</b>

💡 <b>Tip de la semana:</b>
{tip['text']}

— <i>{tip['source']}</i>

Sigue cuidandote. 🧠"""
        try:
            send_message(chat_id, text)
        except Exception as e:
            log.warning(f"Weekly summary failed for {chat_id}: {e}")


def check_low_mood_trend():
    """Proactively send caring message if avg mood dropped >1 point vs previous week."""
    today = datetime.date.today()
    today_iso = today.isoformat()
    for chat_id in list_all_users():
        user = get_user_data(chat_id)
        entries = user.get("entries", [])
        if len(entries) < 5:
            continue
        if user.get("last_low_mood_alert") == today_iso:
            continue
        week_ago = today - datetime.timedelta(days=7)
        two_weeks_ago = today - datetime.timedelta(days=14)
        this_week = [e["mood"] for e in entries if datetime.date.fromisoformat(e["date"]) >= week_ago]
        prev_week = [e["mood"] for e in entries if week_ago > datetime.date.fromisoformat(e["date"]) >= two_weeks_ago]
        if len(this_week) < 2 or len(prev_week) < 2:
            continue
        diff = statistics.fmean(this_week) - statistics.fmean(prev_week)
        if diff <= -1.0:
            try:
                send_message(
                    chat_id,
                    f"""🤍 <b>Solo queria escribirte</b>

He notado que esta semana te has sentido peor que la anterior (media {statistics.fmean(this_week):.1f} vs {statistics.fmean(prev_week):.1f}).

No pasa nada por estar asi. Puedo acompanarte con:
• /respirar — respiracion guiada
• /grounding — volver al presente
• /journal — desahogarte por escrito

Si lo necesitas: /sos. Y recuerda que Ander atiende en <a href=\"mailto:hola@egoera.es\">hola@egoera.es</a>.

Cuidate. 🌱""",
                    disable_preview=True,
                )
                user["last_low_mood_alert"] = today_iso
                save_user_data(chat_id, user)
            except Exception as e:
                log.warning(f"Low mood alert failed for {chat_id}: {e}")


# ============ POLLING LOOP ============

def poll():
    log.info(f"Egoera Bot started. Token: {BOT_TOKEN[:10]}...")
    try:
        set_bot_commands()
    except Exception as e:
        log.warning(f"set_bot_commands failed: {e}")

    offset = 0
    last_reminder_minute = None
    last_summary_date = None
    last_lowmood_date = None

    while True:
        try:
            now = datetime.datetime.now()
            today = now.date()
            hm = now.strftime("%H:%M")

            # Per-minute reminder check (respects each user's reminder_time)
            if last_reminder_minute != hm:
                try:
                    send_daily_reminders()
                except Exception as e:
                    log.warning(f"reminders loop error: {e}")
                last_reminder_minute = hm

            # Weekly summary on Sunday at 09:00
            if today.weekday() == 6 and now.hour == 9 and now.minute < 5 and last_summary_date != today:
                send_weekly_summary()
                last_summary_date = today

            # Low-mood trend check once per day at 18:00
            if now.hour == 18 and now.minute < 5 and last_lowmood_date != today:
                check_low_mood_trend()
                last_lowmood_date = today

            resp = tg_request("getUpdates", {"offset": offset, "timeout": 30})
            for update in resp.get("result", []):
                offset = update["update_id"] + 1
                try:
                    process_update(update)
                except Exception as e:
                    log.error(f"process_update error: {e}", exc_info=True)

        except KeyboardInterrupt:
            log.info("Bot stopped by user.")
            break
        except urllib.error.HTTPError as e:
            log.error(f"HTTP {e.code}: {e.read().decode()[:200]}")
            time.sleep(10)
        except Exception as e:
            log.error(f"Loop error: {e}", exc_info=True)
            time.sleep(5)


# ============ CLI ============

def install_service():
    plist_path = Path.home() / "Library/LaunchAgents/com.egoera.bot.plist"
    script_path = Path(__file__).resolve()
    python_path = sys.executable
    plist = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.egoera.bot</string>
  <key>ProgramArguments</key>
  <array>
    <string>{python_path}</string>
    <string>{script_path}</string>
    <string>poll</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>EGOERA_BOT_TOKEN</key>
    <string>{BOT_TOKEN}</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>{LOG_DIR / 'egoera-bot.stdout.log'}</string>
  <key>StandardErrorPath</key>
  <string>{LOG_DIR / 'egoera-bot.stderr.log'}</string>
  <key>WorkingDirectory</key>
  <string>{script_path.parent}</string>
</dict>
</plist>
"""
    plist_path.write_text(plist)
    os.system(f"launchctl unload {plist_path} 2>/dev/null")
    rc = os.system(f"launchctl load {plist_path}")
    print(f"Service installed at: {plist_path}")
    print(f"Load result: {'OK' if rc == 0 else 'FAILED'}")


def uninstall_service():
    plist_path = Path.home() / "Library/LaunchAgents/com.egoera.bot.plist"
    if plist_path.exists():
        os.system(f"launchctl unload {plist_path}")
        plist_path.unlink()
        print("Service uninstalled")
    else:
        print("Service not installed")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 egoera-bot.py <command>")
        print("Commands: poll | install-service | uninstall-service | test-reminder | test-summary | test-lowmood | set-commands | status")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "poll":
        poll()
    elif cmd == "install-service":
        install_service()
    elif cmd == "uninstall-service":
        uninstall_service()
    elif cmd == "test-reminder":
        send_daily_reminders()
    elif cmd == "test-summary":
        send_weekly_summary()
    elif cmd == "test-lowmood":
        check_low_mood_trend()
    elif cmd == "set-commands":
        set_bot_commands()
    elif cmd == "status":
        info = tg_request("getMe")["result"]
        users = list_all_users()
        print(f"Bot: @{info['username']} ({info['first_name']})")
        print(f"Users registered: {len(users)}")
        for uid in users:
            u = get_user_data(uid)
            print(f"  [{uid}] {u.get('first_name','?')} — {len(u.get('entries',[]))} entries, streak={u.get('streak',0)}, journal={len(u.get('journal',[]))}")
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()

