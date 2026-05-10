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


# ============ I18N (ES / EU / EN) ============
# Per-user language is stored in the user JSON ("lang"). Default: "es".
# For long therapy flows (grounding, breathing, weekly questions, attachment test)
# the canonical text stays in Spanish — those need a careful translation pass later.
# TODO: translate long therapy flows to EU / EN with clinical supervision.

LANGS = ("es", "eu", "en")
LANG_LABELS = {"es": "Español", "eu": "Euskara", "en": "English"}

I18N: dict = {
    # --- onboarding ---
    "welcome_title": {
        "es": "Kaixo {name}, te doy la bienvenida a Egoera",
        "eu": "Kaixo {name}, ongi etorri Egoerara",
        "en": "Hi {name}, welcome to Egoera",
    },
    "welcome_intro": {
        "es": "Soy un acompañante de bienestar emocional. Vamos despacio, sin prisa.",
        "eu": "Ongizate emozionaleko laguntzaile bat naiz. Astiro joango gara, presarik gabe.",
        "en": "I’m a quiet companion for your emotional wellbeing. We’ll move slowly.",
    },
    "welcome_section_diary": {
        "es": "<b>Diario</b>",
        "eu": "<b>Egunerokoa</b>",
        "en": "<b>Diary</b>",
    },
    "welcome_section_techniques": {
        "es": "<b>Para regularte</b>",
        "eu": "<b>Erregulatzeko</b>",
        "en": "<b>To regulate yourself</b>",
    },
    "welcome_section_content": {
        "es": "<b>Lectura y voz de Egoera</b>",
        "eu": "<b>Egoeraren irakurketa eta ahotsa</b>",
        "en": "<b>Reading and voice of Egoera</b>",
    },
    "welcome_section_other": {
        "es": "<b>Otros</b>",
        "eu": "<b>Besteak</b>",
        "en": "<b>Others</b>",
    },
    "welcome_question": {
        "es": "¿Por dónde te apetece empezar?",
        "eu": "Nondik hasi nahi duzu?",
        "en": "Where would you like to start?",
    },
    # --- main menu buttons ---
    "btn_register": {"es": "📝 Registrar", "eu": "📝 Erregistratu", "en": "📝 Log mood"},
    "btn_breathe": {"es": "🧘 Respirar", "eu": "🧘 Arnastu", "en": "🧘 Breathe"},
    "btn_progress": {"es": "📊 Progreso", "eu": "📊 Aurrerapena", "en": "📊 Progress"},
    "btn_tip": {"es": "💡 Una idea", "eu": "💡 Ideia bat", "en": "💡 An idea"},
    "btn_quote": {"es": "💬 Frase", "eu": "💬 Esaldia", "en": "💬 Quote"},
    "btn_notebook": {"es": "📓 Cuaderno", "eu": "📓 Koadernoa", "en": "📓 Notebook"},
    "btn_newsletter": {"es": "📨 Boletín", "eu": "📨 Buletina", "en": "📨 Newsletter"},
    "btn_manifesto": {"es": "🌿 Manifiesto", "eu": "🌿 Manifestua", "en": "🌿 Manifesto"},
    "btn_about": {"es": "🌱 Sobre Ander", "eu": "🌱 Anderri buruz", "en": "🌱 About Ander"},
    "btn_lang": {"es": "🌐 Idioma", "eu": "🌐 Hizkuntza", "en": "🌐 Language"},
    # --- common ---
    "lang_set": {
        "es": "Idioma guardado: <b>Español</b>. Cuando quieras, puedes cambiarlo con /idioma.",
        "eu": "Hizkuntza gordeta: <b>Euskara</b>. Nahi duzunean /idioma erabili dezakezu aldatzeko.",
        "en": "Language saved: <b>English</b>. You can change it anytime with /idioma.",
    },
    "lang_picker_title": {
        "es": "🌐 <b>Elige idioma</b>\n\nElige el idioma en el que prefieres que te escriba. Algunos textos largos seguirán en castellano por ahora.",
        "eu": "🌐 <b>Aukeratu hizkuntza</b>\n\nAukeratu zein hizkuntzatan idatzi nahi dizudan. Testu luze batzuk gaztelaniaz egongo dira oraingoz.",
        "en": "🌐 <b>Pick a language</b>\n\nChoose the language you’d like me to write in. Some long therapy flows are still in Spanish for now.",
    },
    # --- newsletter / manifesto / about / notebook ---
    "newsletter_title": {
        "es": "📨 <b>El boletín de Egoera</b>",
        "eu": "📨 <b>Egoeraren buletina</b>",
        "en": "📨 <b>Egoera’s newsletter</b>",
    },
    "newsletter_body": {
        "es": (
            "Una carta cada cierto tiempo, sin agenda comercial. Sólo psicología que se lee despacio.\n\n"
            "Si te apetece recibirla, puedes apuntarte aquí abajo. Sin prisas, y sin ruido."
        ),
        "eu": (
            "Noizean behin gutun bat, agenda komertzialik gabe. Astiro irakurtzen den psikologia, besterik ez.\n\n"
            "Jaso nahi baduzu, behean apunta zaitezke. Presarik gabe, eta zaratarik gabe."
        ),
        "en": (
            "A letter every now and then, no marketing agenda. Just psychology, read slowly.\n\n"
            "If you’d like to receive it, you can subscribe below. No rush, no noise."
        ),
    },
    "newsletter_btn": {
        "es": "📨 Apuntarme al boletín",
        "eu": "📨 Buletinera apuntatu",
        "en": "📨 Subscribe to the newsletter",
    },
    "manifesto_title": {
        "es": "🌿 <b>Manifiesto Egoera</b>",
        "eu": "🌿 <b>Egoeraren manifestua</b>",
        "en": "🌿 <b>Egoera Manifesto</b>",
    },
    "manifesto_body": {
        "es": (
            "Escribimos psicología despacio, sin recetas, sin imperativos.\n"
            "Creemos en lo cotidiano, en lo que se nombra con cuidado y en lo que no se grita.\n"
            "No hay listas mágicas. Hay tiempo, lectura y compañía.\n"
            "Si quieres leer el manifiesto entero, está aquí debajo."
        ),
        "eu": (
            "Astiro idazten dugu psikologia, errezetarik eta aginpiderik gabe.\n"
            "Eguneroko bizitzari erreparatzen diogu, kontuz izendatzen denari, oihukatzen ez denari.\n"
            "Ez dago zerrenda magikorik. Bai denbora, irakurketa eta lagungarritasuna.\n"
            "Manifestu osoa irakurri nahi baduzu, behean duzu."
        ),
        "en": (
            "We write psychology slowly, with no prescriptions, no imperatives.\n"
            "We pay attention to the everyday, to what is named with care, to what isn’t shouted.\n"
            "There are no magic lists. There is time, reading and company.\n"
            "If you’d like to read the full manifesto, it’s linked below."
        ),
    },
    "manifesto_btn": {
        "es": "🌿 Leer el manifiesto",
        "eu": "🌿 Manifestua irakurri",
        "en": "🌿 Read the manifesto",
    },
    "about_title": {
        "es": "🌱 <b>Sobre Ander</b>",
        "eu": "🌱 <b>Anderri buruz</b>",
        "en": "🌱 <b>About Ander</b>",
    },
    "about_body": {
        "es": (
            "Ander es psicólogo. Atiende en consulta y escribe Egoera como un cuaderno abierto.\n"
            "Si quieres conocer cómo trabaja, leer su recorrido o pedirle hora, puedes hacerlo desde la web."
        ),
        "eu": (
            "Ander psikologoa da. Kontsultan jarduten du eta Egoera koaderno ireki gisa idazten du.\n"
            "Nola lan egiten duen ezagutu, bere ibilbidea irakurri edo hitzordua eskatu nahi badiozu, webgunetik egin dezakezu."
        ),
        "en": (
            "Ander is a psychologist. He sees clients and writes Egoera as an open notebook.\n"
            "If you’d like to know how he works, read his story or book a session, you can do it from the website."
        ),
    },
    "about_btn": {
        "es": "🌱 Conocer a Ander",
        "eu": "🌱 Ander ezagutu",
        "en": "🌱 Meet Ander",
    },
    "notebook_title": {
        "es": "📓 <b>El cuaderno de Egoera</b>",
        "eu": "📓 <b>Egoeraren koadernoa</b>",
        "en": "📓 <b>Egoera’s notebook</b>",
    },
    "notebook_intro": {
        "es": "Las últimas entradas del cuaderno. Léelas con tiempo, no son listas para correr.",
        "eu": "Koadernoaren azken sarrerak. Astiro irakurri itzazu, ez dira korrika egiteko zerrendak.",
        "en": "The latest notebook entries. Read them slowly — they aren’t lists to skim.",
    },
    "notebook_btn_all": {
        "es": "📓 Ver todo el cuaderno",
        "eu": "📓 Koaderno osoa ikusi",
        "en": "📓 See the full notebook",
    },
    "notebook_empty": {
        "es": "📓 Ahora mismo no consigo traer las últimas entradas. Puedes leer el cuaderno entero en egoera.es/cuaderno.",
        "eu": "📓 Oraingoz ezin ditut azken sarrerak ekarri. Egoera.es/cuaderno helbidean irakur dezakezu koaderno osoa.",
        "en": "📓 I can’t fetch the latest entries right now. You can read the full notebook at egoera.es/cuaderno.",
    },
    # --- weekly digest ---
    "week_title": {
        "es": "📅 <b>Tu semana, en voz baja</b>",
        "eu": "📅 <b>Zure astea, ahots apalez</b>",
        "en": "📅 <b>Your week, in a low voice</b>",
    },
    "week_empty": {
        "es": "Esta semana aún no hay registros que mirar. Cuando dejes alguna huella con /registrar, podré devolverte una lectura.",
        "eu": "Aste honetan oraindik ez dago erregistrorik. /registrar erabiltzen duzunean, irakurketa bat itzuli ahal izango dizut.",
        "en": "There aren’t any entries this week yet. When you leave a trace with /registrar, I’ll be able to read it back to you.",
    },
}


def t(key: str, lang: str = "es", **fmt) -> str:
    """Translate. Falls back to ES if the key/lang is missing."""
    entry = I18N.get(key, {})
    text = entry.get(lang) or entry.get("es") or key
    if fmt:
        try:
            return text.format(**fmt)
        except Exception:
            return text
    return text


def get_lang(chat_id: int) -> str:
    user = get_user_data(chat_id)
    lang = user.get("lang", "es")
    return lang if lang in LANGS else "es"


def set_lang(chat_id: int, lang: str):
    if lang not in LANGS:
        return
    user = get_user_data(chat_id)
    user["lang"] = lang
    save_user_data(chat_id, user)


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
SOS_TEXT = """🆘 <b>Si estás en un mal momento</b>

No estás solo/a. Aquí van algunos números, por si los necesitas.

<b>📞 Teléfono de la Esperanza</b> (24 h, gratuito):
<code>717 003 717</code>

<b>📞 024</b> — atención a la conducta suicida (24 h):
<code>024</code>

<b>📞 112</b> — emergencias.

<b>📧 Sesiones con Ander (psicología):</b>
<a href="mailto:hola@egoera.es">hola@egoera.es</a>

<b>Y aquí, ahora:</b>
• /respirar — respiración guiada
• /grounding — volver al presente (5-4-3-2-1)
• /frase — una frase para sostenerte

<i>Este bot no sustituye la ayuda profesional. Si tu vida o la de alguien está en riesgo, llama al 112.</i>"""


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
        {"command": "start", "description": "Empezar"},
        {"command": "registrar", "description": "Anotar cómo estás ahora"},
        {"command": "checkin", "description": "Check-in (sueño, energía, estrés)"},
        {"command": "progreso", "description": "Ver tu evolución"},
        {"command": "stats", "description": "Lectura más detallada"},
        {"command": "semana", "description": "Resumen narrativo de tu semana"},
        {"command": "journal", "description": "Diario libre"},
        {"command": "buscar", "description": "Buscar entre tus entradas"},
        {"command": "exportar", "description": "Exportar lo que has escrito"},
        {"command": "respirar", "description": "Respiración guiada"},
        {"command": "grounding", "description": "Volver al presente (5-4-3-2-1)"},
        {"command": "frase", "description": "Una frase para sostenerte"},
        {"command": "pregunta", "description": "Pregunta de la semana"},
        {"command": "test_apego", "description": "Test orientativo de apego"},
        {"command": "tip", "description": "Una idea de psicología"},
        {"command": "cuaderno", "description": "Últimas entradas del cuaderno"},
        {"command": "boletin", "description": "Sobre el boletín de Egoera"},
        {"command": "manifiesto", "description": "Cómo escribimos en Egoera"},
        {"command": "sobre", "description": "Sobre Ander"},
        {"command": "blog", "description": "Artículos del cuaderno (alias)"},
        {"command": "recordatorio", "description": "Recordatorio diario"},
        {"command": "idioma", "description": "Cambiar idioma (ES / EU / EN)"},
        {"command": "sos", "description": "Recursos para un mal momento"},
        {"command": "kaixo", "description": "Saludo en euskera"},
        {"command": "ayuda", "description": "Lista de comandos"},
        {"command": "contacto", "description": "Cómo escribir a Egoera"},
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
        "lang": "es",
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
    if "lang" not in user:
        user["lang"] = "es"
    save_user_data(chat_id, user)
    lang = user.get("lang", "es")

    # Send logo photo first (silently skip if not present)
    try:
        send_photo(
            chat_id,
            LOGO_PATH,
            caption="<b>Egoera</b>\n<i>«psicología, despacio»</i>",
        )
    except Exception as e:
        log.warning(f"Logo send failed: {e}")

    title = t("welcome_title", lang, name=first_name or "")
    intro = t("welcome_intro", lang)
    sec_diary = t("welcome_section_diary", lang)
    sec_tech = t("welcome_section_techniques", lang)
    sec_content = t("welcome_section_content", lang)
    sec_other = t("welcome_section_other", lang)
    question = t("welcome_question", lang)

    text = f"""🌱 <b>{title}</b>

{intro}

{sec_diary}
/registrar — anotar cómo estás
/checkin — sueño, energía, estrés
/journal — diario libre
/progreso · /stats · /semana — leerte por dentro
/buscar · /exportar — recuperar lo escrito

{sec_tech}
/respirar — respiración guiada
/grounding — volver al presente (5-4-3-2-1)
/frase — una frase para sostenerte
/pregunta — pregunta de la semana
/test_apego — test orientativo de apego

{sec_content}
/cuaderno — últimas entradas
/boletin — el boletín «despacio»
/manifiesto — cómo escribimos
/sobre — quién es Ander

{sec_other}
/recordatorio · /idioma · /sos · /kaixo · /ayuda · /contacto

{question}"""

    keyboard = inline_keyboard(
        [(t("btn_register", lang), "cmd_registrar"), (t("btn_breathe", lang), "cmd_respirar")],
        [(t("btn_progress", lang), "cmd_progreso"), (t("btn_tip", lang), "cmd_tip")],
        [(t("btn_quote", lang), "cmd_frase"), (t("btn_notebook", lang), "cmd_cuaderno")],
        [(t("btn_newsletter", lang), "cmd_boletin"), (t("btn_manifesto", lang), "cmd_manifiesto")],
        [(t("btn_about", lang), "cmd_sobre"), (t("btn_lang", lang), "cmd_idioma")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def handle_registrar(chat_id: int):
    set_state(chat_id, None)
    text = "📝 <b>¿Cómo estás ahora mismo?</b>\n\nNo hay respuestas correctas. Elige lo que más se acerque."
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

    answer_callback(cb_id, f"Anotado: {mood['label']}")

    streak_text = f"🔥 Racha: <b>{user['streak']} día{'s' if user['streak'] != 1 else ''}</b>" if user["streak"] > 0 else ""

    text = f"""✅ <b>Anotado</b>

{mood['emoji']} <b>{mood['label']}</b>
📅 {today}, a las {now}
{streak_text}

¿Quieres añadir algo? Si te apetece, escribe un mensaje y lo guardo junto a tu registro."""

    rows = [
        [("💡 Una idea", "cmd_tip"), ("📊 Progreso", "cmd_progreso")],
        [("💬 Frase", "cmd_frase")],
    ]
    # Mood <=2 → suggest tools (without imperative voice)
    if mood["value"] <= 2:
        text += "\n\n<i>Hoy no es un buen momento. Si te apetece, podemos ir despacio juntos.</i>"
        rows = [
            [("🧘 Respirar", "cmd_respirar"), ("🌱 Grounding", "cmd_grounding")],
            [("📖 Diario libre", "cmd_journal"), ("💬 Frase", "cmd_frase")],
            [("📓 Una lectura: «mitos de la ansiedad»", "blog_mitos-ansiedad")],
            [("🆘 Recursos /sos", "cmd_sos")],
        ]

    send_message(chat_id, text, reply_markup=inline_keyboard(*rows))


def handle_progreso(chat_id: int):
    user = get_user_data(chat_id)
    entries = user.get("entries", [])

    if not entries:
        send_message(chat_id, "📊 Todavía no hay registros. Cuando quieras empezar, /registrar abre el diario.")
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
            trend = "➡️ Esta semana se ha mantenido estable."
        elif diff > 0:
            trend = f"📈 Algo mejor que la semana pasada (+{diff:.1f})."
        else:
            trend = f"📉 Algo peor que la semana pasada ({diff:.1f})."

    text = f"""📊 <b>Tu evolución</b>

📝 Registros: <b>{total}</b>
🔥 Racha: <b>{streak} día{'s' if streak != 1 else ''}</b>
{avg_emoji} Media: <b>{avg:.1f}/5</b>

<b>Últimos {len(recent)} días:</b>
{timeline}

<b>Cómo se reparte tu ánimo:</b>
{dist_text}
{trend}

Si te apetece una lectura más detallada, /stats. Para un resumen narrativo de la semana, /semana."""
    keyboard = inline_keyboard(
        [("📈 Más detalle", "cmd_stats"), ("📅 Resumen de la semana", "cmd_semana")],
        [("📝 Anotar hoy", "cmd_registrar")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def handle_stats(chat_id: int):
    user = get_user_data(chat_id)
    entries = user.get("entries", [])
    if len(entries) < 3:
        send_message(chat_id, "📈 Con menos de tres registros no hay mucho que leer todavía. Cuando haya un poco más, /stats devolverá una lectura más fina.")
        return

    moods = [e["mood"] for e in entries]
    avg = statistics.fmean(moods)
    stdev = statistics.pstdev(moods) if len(moods) > 1 else 0

    # Best / worst weekday
    weekday_names = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
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
        for tag in e.get("tags", []):
            tag_counter[tag] += 1
            tag_mood[tag].append(e["mood"])
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
            f"😴 Sueño: <b>{sleep_avg:.1f}/5</b>\n"
            f"⚡ Energía: <b>{energy_avg:.1f}/5</b>\n"
            f"🔥 Estrés: <b>{stress_avg:.1f}/5</b>\n"
        )

    text = f"""📈 <b>Lectura más fina</b>

📊 Media global: <b>{avg:.2f}/5</b>
📉 Variabilidad (σ): <b>{stdev:.2f}</b>
📝 Registros: <b>{len(entries)}</b>
📖 Diario libre: <b>{len(user.get('journal', []))}</b> entradas

<b>Día más amable:</b> {weekday_names[best_wd] if best_wd is not None else '—'} ({avg_by_wd[best_wd]:.1f}/5)
<b>Día más cuesta arriba:</b> {weekday_names[worst_wd] if worst_wd is not None else '—'} ({avg_by_wd[worst_wd]:.1f}/5)
<b>Hora a la que sueles escribirme:</b> {f'{freq_hour:02d}:00' if freq_hour is not None else '—'}
"""
    if top_tags:
        text += "\n<b>Lo que más aparece en tus notas:</b>\n"
        for tg, c in top_tags:
            mood_avg = statistics.fmean(tag_mood[tg])
            text += f"• «{tg}» — {c} veces (ánimo medio {mood_avg:.1f})\n"
    text += checkin_line

    if stdev > 1.0:
        text += "\n<i>Tu ánimo se mueve bastante. Puede que merezca la pena mirar despacio qué hay alrededor: trabajo, descanso, vínculos.</i>"
    elif stdev < 0.5:
        text += "\n<i>Tu ánimo se mantiene muy plano. A veces lo que no se nombra también pesa.</i>"

    send_message(chat_id, text)


def handle_tip(chat_id: int):
    tip = random.choice(TIPS)
    related_post = next((p for p in BLOG_POSTS if p["slug"] == tip["related"]), None)

    text = f"""💡 <b>Una idea, sin prisa</b>

{tip['text']}

<i>— {tip['source']}</i>"""

    keyboard_rows = []
    if related_post:
        keyboard_rows.append([{
            "text": f"📓 Leer en el cuaderno: {related_post['title']}",
            "url": f"https://egoera.es/{related_post['slug']}/",
        }])
    keyboard_rows.append([
        {"text": "💡 Otra idea", "callback_data": "cmd_tip"},
        {"text": "📝 Anotar cómo estás", "callback_data": "cmd_registrar"},
    ])
    send_message(chat_id, text, reply_markup={"inline_keyboard": keyboard_rows})


def handle_blog(chat_id: int):
    """Alias semántico: en la nueva web «el blog» se llama «cuaderno»."""
    handle_cuaderno(chat_id)


def handle_frase(chat_id: int):
    quote, author = random.choice(AFFIRMATIONS)
    text = f"""💬 <b>Una frase para sostenerte</b>

«{quote}»

<i>— {author}</i>"""
    keyboard = inline_keyboard([
        ("💬 Otra frase", "cmd_frase"),
        ("📖 Diario libre", "cmd_journal"),
    ])
    send_message(chat_id, text, reply_markup=keyboard)


def handle_pregunta(chat_id: int):
    week = datetime.date.today().isocalendar()[1]
    idx = (week - 1) % len(WEEKLY_QUESTIONS)
    question = WEEKLY_QUESTIONS[idx]
    set_state(chat_id, {"flow": "pregunta", "week": week, "question": question})
    text = f"""🧘 <b>Pregunta de la semana {week}</b>

{question}

<i>Cuando te apetezca, responde con un mensaje. Lo guardo junto a tu diario. Si quieres salir, /cancelar.</i>"""
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
    send_message(chat_id, "🪶 <b>Guardado.</b>\n\nQueda en tu historial. Si quieres releerlo, /exportar.")


# ----- Respirar -----

def handle_respirar(chat_id: int):
    set_state(chat_id, None)
    text = """🧘 <b>Respiración guiada</b>

Tres caminos posibles. ¿Cuál te apetece probar ahora?"""
    keyboard = inline_keyboard(
        [("4-7-8 (Weil)", "resp_478")],
        [("Cuadrada (4-4-4-4)", "resp_box")],
        [("Diafragmática", "resp_diaf")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def run_breathing(chat_id: int, pattern_key: str):
    pat = BREATHING_PATTERNS.get(pattern_key)
    if not pat:
        return
    send_message(
        chat_id,
        f"🧘 <b>{pat['name']}</b>\n\n{pat['desc']}\n\nNos tomamos {pat['cycles']} ciclos. Sin prisa.",
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
        "✅ <b>Hecho.</b>\n\n¿Notas algo en el cuerpo? Si te apetece, lo dejamos por escrito con /registrar.",
        reply_markup=inline_keyboard(
            [("🔁 Otra vez", f"resp_{pattern_key}"), ("📝 Anotar cómo estás", "cmd_registrar")],
        ),
    )


# ----- Grounding 5-4-3-2-1 -----

GROUNDING_STEPS = [
    ("visto", 5, "👀 <b>Cinco cosas que ves</b>\n\nSi te apetece, mira alrededor y escribe cinco cosas que veas ahora mismo. Pueden ser detalles pequeños: un reflejo, una textura. Envíalas en un mensaje, juntas o separadas por comas."),
    ("tocado", 4, "✋ <b>Cuatro cosas que puedes tocar</b>\n\nTócalas de verdad. ¿Qué temperatura tienen? ¿Qué textura? Escribe cuatro."),
    ("oido", 3, "👂 <b>Tres cosas que oyes</b>\n\nDiez segundos de escucha. Tres sonidos, aunque sean sutiles."),
    ("olido", 2, "👃 <b>Dos cosas que hueles</b>\n\nSi no hueles nada obvio, acerca la nariz a tu ropa, a un café, a tu propia mano. Dos."),
    ("saboreado", 1, "👅 <b>Una cosa que saboreas</b>\n\nPuede ser el sabor que queda en tu boca, un sorbo de agua. Solo una."),
]


def handle_grounding(chat_id: int):
    set_state(chat_id, {"flow": "grounding", "step": 0, "answers": {}})
    send_message(
        chat_id,
        "🌱 <b>Volver al presente: 5-4-3-2-1</b>\n\nUn ejercicio breve para cuando la ansiedad sube. Vamos paso a paso, sin prisa. Si en algún momento quieres parar, /cancelar.\n",
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
            f"✅ <b>Hecho</b>\n\n{summary}\n\nUnos segundos más con la respiración. Estás aquí. Estás a salvo.",
            reply_markup=inline_keyboard([("🧘 Respirar", "cmd_respirar"), ("📝 Anotar cómo estás", "cmd_registrar")]),
        )


# ----- Check-in diario -----

CHECKIN_STEPS = [
    ("sleep", "😴 <b>¿Cómo has dormido?</b>\n<i>(1 = fatal · 5 = perfecto)</i>"),
    ("energy", "⚡ <b>¿Cómo está tu energía?</b>\n<i>(1 = agotado/a · 5 = lleno/a)</i>"),
    ("stress", "🔥 <b>¿Cómo está tu estrés?</b>\n<i>(1 = muy calmado/a · 5 = desbordado/a)</i>"),
]


def handle_checkin(chat_id: int):
    set_state(chat_id, {"flow": "checkin", "step": 0, "answers": {}})
    send_message(chat_id, "🩺 <b>Check-in</b>\n\nTres preguntas breves. Sin nota.")
    send_message(
        chat_id,
        CHECKIN_STEPS[0][1],
        reply_markup=inline_keyboard([(str(i), f"chk_{CHECKIN_STEPS[0][0]}_{i}") for i in range(1, 6)]),
    )


def handle_checkin_callback(chat_id: int, cb_id: str, data: str):
    state = get_state(chat_id)
    if not state or state.get("flow") != "checkin":
        answer_callback(cb_id, "Sesión expirada. Si te apetece, /checkin la abre de nuevo.")
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
            f"""✅ <b>Anotado</b>

😴 Sueño: <b>{s}/5</b>
⚡ Energía: <b>{e}/5</b>
🔥 Estrés: <b>{st}/5</b>

Cuando haya un poco más de historial, /stats irá devolviéndote correlaciones.""",
        )


# ----- Journal libre -----

def handle_journal(chat_id: int):
    set_state(chat_id, {"flow": "journal"})
    send_message(
        chat_id,
        "📖 <b>Diario libre</b>\n\nEscribe lo que necesites soltar. Lo guardo con su fecha y hora.\nSi quieres salir, /cancelar.",
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
        f"✅ <b>Guardado</b> ({entry['date']} {entry['time']})\n\nLlevas <b>{len(user['journal'])}</b> entradas en el diario libre.",
        reply_markup=inline_keyboard(
            [("🔎 Buscar", "cmd_buscar"), ("📤 Exportar", "cmd_exportar"), ("📖 Otra entrada", "cmd_journal")],
        ),
    )


# ----- Buscar -----

def handle_buscar(chat_id: int):
    set_state(chat_id, {"flow": "buscar"})
    send_message(
        chat_id,
        "🔎 <b>Buscar en tu diario</b>\n\nEnvía una palabra clave o una fecha (YYYY-MM-DD). Si quieres salir, /cancelar.",
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
        send_message(chat_id, f"🔎 Nada encontrado para «{query}».")
        return

    lines = [f"🔎 <b>{len(results)} resultado(s) para «{query}»</b>\n"]
    for kind, r in results[:15]:
        if kind == "journal":
            lines.append(f"📖 {r['date']} {r['time']} — {r['text'][:120]}")
        elif kind == "mood":
            lines.append(f"📝 {r['date']} {r.get('time','')} — {r['emoji']} {r['mood_label']} {('— ' + r['note'][:100]) if r.get('note') else ''}")
        elif kind == "weekly":
            lines.append(f"🧘 {r['date'][:10]} (sem. {r['week']}) — {r['answer'][:120]}")
    if len(results) > 15:
        lines.append(f"\n<i>Te muestro los primeros 15 de {len(results)}. Para tenerlo todo, /exportar.</i>")
    send_message(chat_id, "\n\n".join(lines))


# ----- Exportar -----

def handle_exportar(chat_id: int):
    user = get_user_data(chat_id)
    name = user.get("first_name") or f"user{chat_id}"
    lines = [f"# Diario Egoera — {name}", f"_Exportado el {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}_", ""]

    entries = sorted(user.get("entries", []), key=lambda e: (e["date"], e.get("time", "")))
    if entries:
        lines.append("## Registros de ánimo\n")
        for e in entries:
            lines.append(f"- **{e['date']} {e.get('time','')}** — {e['emoji']} {e['mood_label']} ({e['mood']}/5)")
            if e.get("note"):
                lines.append(f"  > {e['note']}")
        lines.append("")

    journal = sorted(user.get("journal", []), key=lambda j: (j["date"], j["time"]))
    if journal:
        lines.append("## Diario libre\n")
        for j in journal:
            lines.append(f"### {j['date']} {j['time']}")
            lines.append(j["text"])
            lines.append("")

    checkins = sorted(user.get("checkins", []), key=lambda c: (c["date"], c.get("time", "")))
    if checkins:
        lines.append("## Check-ins (sueño / energía / estrés)\n")
        for c in checkins:
            lines.append(f"- {c['date']} {c.get('time','')} — sueño {c['sleep']}/5 · energía {c['energy']}/5 · estrés {c['stress']}/5")
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
        send_message(chat_id, "📤 Aún no hay nada que exportar. Cuando dejes alguna huella en /registrar, /journal, /checkin o /pregunta, podré devolvértela.")
        return

    content = "\n".join(lines).encode("utf-8")
    fname = f"egoera-diario-{datetime.date.today().isoformat()}.md"
    send_document(chat_id, fname, content, caption=f"📤 Tu diario completo: {len(entries)} registros, {len(journal)} entradas libres, {len(checkins)} check-ins.")


# ----- Test apego -----

def handle_test_apego(chat_id: int):
    set_state(chat_id, {"flow": "test_apego", "step": 0, "scores": {"A": 0, "B": 0, "C": 0, "D": 0}})
    send_message(
        chat_id,
        "💞 <b>Un test orientativo de apego</b>\n\nCinco preguntas. No hay respuestas correctas: elige la opción que más se acerque a ti. Es orientativo, no diagnóstico. Si quieres salir, /cancelar.",
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
        answer_callback(cb_id, "Sesión expirada. Si te apetece, /test_apego empieza de nuevo.")
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

<i>Es un test orientativo. No sustituye una evaluación profesional.</i>"""
        keyboard = inline_keyboard([{
            "text": "📓 Leer en el cuaderno: Los 4 estilos de apego",
            "url": "https://egoera.es/estilos-de-apego/",
        }])
        send_message(chat_id, text, reply_markup=keyboard)


# ----- Recordatorio personalizable -----

def handle_recordatorio(chat_id: int):
    user = get_user_data(chat_id)
    status = "activado" if user.get("reminders") else "desactivado"
    hr = user.get("reminder_time", "20:00")
    text = f"""🔔 <b>Recordatorio diario</b>

Estado actual: <b>{status}</b>
Hora: <b>{hr}</b>

¿Qué te apetece hacer?"""
    rows = [
        [("🔔 Activar / desactivar", "rem_toggle")],
        [("⏰ Cambiar la hora", "rem_sethour")],
    ]
    send_message(chat_id, text, reply_markup=inline_keyboard(*rows))


def handle_recordatorio_toggle(chat_id: int, cb_id: str):
    user = get_user_data(chat_id)
    user["reminders"] = not user.get("reminders", False)
    save_user_data(chat_id, user)
    answer_callback(cb_id, "Recordatorio " + ("activado" if user["reminders"] else "desactivado"))
    if user["reminders"]:
        send_message(chat_id, f"🔔 Recordatorios <b>activados</b>. Te escribiré cada día a las <b>{user['reminder_time']}</b>, sin agobio.")
    else:
        send_message(chat_id, "🔕 Recordatorios <b>desactivados</b>. Cuando los quieras de vuelta, /recordatorio.")


def handle_recordatorio_sethour(chat_id: int, cb_id: str):
    answer_callback(cb_id)
    set_state(chat_id, {"flow": "set_hour"})
    send_message(chat_id, "⏰ Envía la hora en formato <b>HH:MM</b> (24 h). Por ejemplo: <code>20:00</code> o <code>08:30</code>.\n\nSi quieres salir, /cancelar.")


def handle_sethour_response(chat_id: int, text: str):
    txt = text.strip()
    try:
        hh, mm = txt.split(":")
        hh, mm = int(hh), int(mm)
        if not (0 <= hh <= 23 and 0 <= mm <= 59):
            raise ValueError
    except Exception:
        send_message(chat_id, "❌ El formato no me cuadra. Probemos con HH:MM (24 h), por ejemplo 20:00.")
        return
    user = get_user_data(chat_id)
    user["reminder_time"] = f"{hh:02d}:{mm:02d}"
    user["reminders"] = True
    save_user_data(chat_id, user)
    set_state(chat_id, None)
    send_message(chat_id, f"✅ Guardado. Te escribiré cada día a las <b>{user['reminder_time']}</b>. Recordatorios <b>activados</b>.")


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
    text = f"""🇪🇺 <b>{EUSKERA['hello']}{', ' + name if name else ''}.</b>

{EUSKERA['welcome']} Egoerara. {EUSKERA['thanks']} hemen egoteagatik.

<b>Mini hiztegia:</b>
• Kaixo — Hola
• Egun on — Buenos días
• Gabon — Buenas noches
• Eskerrik asko — Muchas gracias
• Agur — Adiós

<i>Egoera también trabaja en euskera. Si prefieres sesiones en euskera, escribe a Ander.</i>"""
    send_message(chat_id, text)


# ----- Ayuda / contacto / web -----

def handle_ayuda(chat_id: int):
    text = """ℹ️ <b>Lo que puedo hacer</b>

<b>📝 Diario</b>
/registrar — anotar cómo estás ahora
/checkin — sueño, energía, estrés
/journal — diario libre
/progreso — tu evolución
/stats — lectura más fina
/semana — resumen narrativo de la semana
/buscar — buscar entre tus entradas
/exportar — descargar todo en Markdown

<b>🧘 Para regularte</b>
/respirar — respiración guiada (4-7-8, cuadrada, diafragmática)
/grounding — volver al presente (5-4-3-2-1)
/frase — una frase para sostenerte
/pregunta — pregunta de la semana
/test_apego — test orientativo de apego

<b>📓 Lectura y voz de Egoera</b>
/cuaderno — últimas entradas del cuaderno
/boletin — el boletín «despacio»
/manifiesto — cómo escribimos
/sobre — sobre Ander
/tip — una idea de psicología
/web — egoera.es

<b>⚙️ Otros</b>
/recordatorio — recordatorio diario
/idioma — cambiar idioma (ES / EU / EN)
/sos — recursos para un mal momento
/kaixo — saludo en euskera
/contacto — cómo escribir
/cancelar — salir de cualquier flujo

<b>Texto libre:</b> si me escribes algo fuera de un flujo y tienes un registro de hoy, lo guardo como nota tuya."""
    send_message(chat_id, text, disable_preview=True)


def handle_contacto(chat_id: int):
    text = """📞 <b>Cómo escribir a Egoera</b>

📧 Email: <a href="mailto:hola@egoera.es">hola@egoera.es</a>
🌐 Web: <a href="https://egoera.es">egoera.es</a>
📓 Cuaderno: <a href="https://egoera.es/cuaderno/">egoera.es/cuaderno</a>
📨 Boletín: <a href="https://egoera.es/boletin/">egoera.es/boletin</a>
📸 Instagram: @egoera.psikologia
🎵 TikTok: @egoera.psikologia
🎬 YouTube: @egoerapsikologia"""
    send_message(chat_id, text, disable_preview=True)


def handle_cancelar(chat_id: int):
    state = get_state(chat_id)
    set_state(chat_id, None)
    if state:
        send_message(chat_id, f"✅ Salimos del flujo: <b>{state.get('flow')}</b>.")
    else:
        send_message(chat_id, "No tenías ningún flujo abierto.")


# ----- Cuaderno (pulls latest WP posts) -----

def fetch_latest_posts(per_page: int = 3) -> list:
    """Pull the latest published posts from egoera.es WP REST API.
    Returns [] on any failure — callers must handle the empty case gracefully."""
    url = f"https://egoera.es/wp-json/wp/v2/posts?per_page={per_page}&_fields=id,date,link,title,excerpt"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "egoera-bot/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        out = []
        for p in data:
            title = (p.get("title", {}) or {}).get("rendered", "Sin título")
            link = p.get("link", "https://egoera.es/cuaderno/")
            # crude HTML strip on title (decode entities is rarely needed for post titles)
            title = (title.replace("&#8217;", "’").replace("&amp;", "&")
                          .replace("&#8211;", "–").replace("&nbsp;", " ").strip())
            out.append({"title": title, "link": link})
        return out
    except Exception as e:
        log.warning(f"WP fetch failed: {e}")
        return []


def handle_cuaderno(chat_id: int):
    lang = get_lang(chat_id)
    posts = fetch_latest_posts(3)
    title = t("notebook_title", lang)
    intro = t("notebook_intro", lang)

    if not posts:
        # Fallback: short curated picks from the local catalogue
        send_message(
            chat_id,
            f"{title}\n\n{t('notebook_empty', lang)}",
            reply_markup=inline_keyboard([{
                "text": t("notebook_btn_all", lang),
                "url": "https://egoera.es/cuaderno/",
            }]),
            disable_preview=True,
        )
        return

    body = "\n".join([f"• <a href=\"{p['link']}\">{p['title']}</a>" for p in posts])
    text = f"{title}\n\n{intro}\n\n{body}"
    keyboard = inline_keyboard([{
        "text": t("notebook_btn_all", lang),
        "url": "https://egoera.es/cuaderno/",
    }])
    send_message(chat_id, text, reply_markup=keyboard, disable_preview=True)


# ----- Boletín -----

def handle_boletin(chat_id: int):
    lang = get_lang(chat_id)
    text = f"{t('newsletter_title', lang)}\n\n{t('newsletter_body', lang)}"
    keyboard = inline_keyboard([{
        "text": t("newsletter_btn", lang),
        "url": "https://egoera.es/boletin/",
    }])
    send_message(chat_id, text, reply_markup=keyboard, disable_preview=True)


# ----- Manifiesto -----

def handle_manifiesto(chat_id: int):
    lang = get_lang(chat_id)
    text = f"{t('manifesto_title', lang)}\n\n{t('manifesto_body', lang)}"
    keyboard = inline_keyboard([{
        "text": t("manifesto_btn", lang),
        "url": "https://egoera.es/manifiesto/",
    }])
    send_message(chat_id, text, reply_markup=keyboard, disable_preview=True)


# ----- Sobre Ander -----

def handle_sobre(chat_id: int):
    lang = get_lang(chat_id)
    text = f"{t('about_title', lang)}\n\n{t('about_body', lang)}"
    keyboard = inline_keyboard([{
        "text": t("about_btn", lang),
        "url": "https://egoera.es/sobre-nosotros/",
    }])
    send_message(chat_id, text, reply_markup=keyboard, disable_preview=True)


# ----- Idioma -----

def handle_idioma(chat_id: int):
    lang = get_lang(chat_id)
    text = t("lang_picker_title", lang)
    keyboard = inline_keyboard(
        [(LANG_LABELS["es"] + (" ✓" if lang == "es" else ""), "lang_es"),
         (LANG_LABELS["eu"] + (" ✓" if lang == "eu" else ""), "lang_eu"),
         (LANG_LABELS["en"] + (" ✓" if lang == "en" else ""), "lang_en")],
    )
    send_message(chat_id, text, reply_markup=keyboard)


def handle_lang_callback(chat_id: int, cb_id: str, code: str):
    if code not in LANGS:
        answer_callback(cb_id, "?")
        return
    set_lang(chat_id, code)
    answer_callback(cb_id, LANG_LABELS[code])
    send_message(chat_id, t("lang_set", code))


# ----- Semana (weekly digest, narrative) -----

def _weekly_narrative(user: dict, lang: str = "es") -> str:
    """Build a narrative, anti-clinical 2-3 paragraph summary of the last 7 days.
    Only Spanish for now; English/Euskara fall back to ES too (TODO: localize)."""
    today = datetime.date.today()
    week_ago = today - datetime.timedelta(days=7)

    entries = [e for e in user.get("entries", [])
               if datetime.date.fromisoformat(e["date"]) >= week_ago]
    journals = [j for j in user.get("journal", [])
                if datetime.date.fromisoformat(j["date"]) >= week_ago]
    checkins = [c for c in user.get("checkins", [])
                if datetime.date.fromisoformat(c["date"]) >= week_ago]

    if not entries and not journals and not checkins:
        return ""

    # Numbers — used as anchors, never as the main voice
    n = len(entries)
    avg = statistics.fmean([e["mood"] for e in entries]) if entries else None
    days_logged = len({e["date"] for e in entries})

    # Texture: look at notes + journals for emotional language
    text_blob = " ".join(
        [e.get("note", "") or "" for e in entries] +
        [j.get("text", "") or "" for j in journals]
    ).lower()
    emo_hits = [emo for emo in EMOTIONS if emo.lower() in text_blob]
    top_emo = emo_hits[:3]

    # Trend vs previous week (if any)
    two_weeks_ago = today - datetime.timedelta(days=14)
    prev_entries = [e for e in user.get("entries", [])
                    if week_ago > datetime.date.fromisoformat(e["date"]) >= two_weeks_ago]
    prev_avg = statistics.fmean([e["mood"] for e in prev_entries]) if prev_entries else None

    # Paragraph 1: a quiet opening
    if days_logged >= 5:
        p1 = f"Esta semana te has dejado leer en {days_logged} días. No es poco: hay constancia, y la constancia, en lo emocional, ya es cuidado."
    elif days_logged >= 2:
        p1 = f"Esta semana hay {days_logged} días con huella. Algunos días estuviste cerca, otros no. Es lo que hay, y no es poco."
    else:
        p1 = "Esta semana apenas has pasado por aquí. No te lo cuento como un reproche; lo cuento como un dato. A veces el ánimo no encuentra palabras."

    # Paragraph 2: the texture
    if avg is not None:
        if avg >= 4.0:
            tone = f"La media ha estado por encima de la línea de flotación ({avg:.1f}/5). Hay cierta luz."
        elif avg >= 3.0:
            tone = f"La media se ha sostenido en el «normal» ({avg:.1f}/5). Ni rally ni caída."
        elif avg >= 2.0:
            tone = f"La media ha estado por debajo de lo cómodo ({avg:.1f}/5). Habrá tenido sus razones."
        else:
            tone = f"Ha sido una semana cuesta arriba ({avg:.1f}/5). Conviene mirarla con suavidad."
        p2 = tone
        if top_emo:
            emos_es = ", ".join(f"«{e.lower()}»" for e in top_emo)
            p2 += f" En tus notas asomaron, sobre todo, {emos_es}."
    else:
        p2 = "No hay registros de ánimo, pero sí trazos en lo que has escrito."

    # Paragraph 3: trend + closing, no imperatives
    if prev_avg is not None and avg is not None:
        diff = avg - prev_avg
        if diff >= 0.5:
            p3 = f"Comparada con la semana anterior, esta queda algo mejor (+{diff:.1f}). Algo se mueve en buena dirección, aunque no haga falta celebrarlo en alto."
        elif diff <= -0.5:
            p3 = f"Comparada con la semana anterior, esta queda más abajo ({diff:.1f}). Si te apetece, podemos ir despacio: /respirar, /grounding, o leer algo en /cuaderno."
        else:
            p3 = "Comparada con la semana anterior, está más o menos en el mismo lugar. Tampoco hay que correr a moverlo."
    else:
        p3 = "Aún no tengo semana previa con la que comparar; lo iré ajustando."

    closing = "Si quieres, /pregunta tiene la pregunta de la semana. Y si necesitas un ratito tranquilo, /respirar o /grounding están aquí."

    return f"{p1}\n\n{p2}\n\n{p3}\n\n<i>{closing}</i>"


def handle_semana(chat_id: int):
    lang = get_lang(chat_id)
    user = get_user_data(chat_id)
    body = _weekly_narrative(user, lang)
    title = t("week_title", lang)
    if not body:
        send_message(chat_id, f"{title}\n\n{t('week_empty', lang)}")
        return
    send_message(chat_id, f"{title}\n\n{body}", disable_preview=True)


# ============ TEXT ROUTER (notes / flows) ============

def handle_text_note(chat_id: int, text: str):
    """Save free text as note on today's latest mood entry."""
    user = get_user_data(chat_id)
    today = datetime.date.today().isoformat()
    today_entries = [e for e in user.get("entries", []) if e["date"] == today]

    if not today_entries:
        send_message(
            chat_id,
            "📝 Hoy todavía no hay registro. Si te apetece, /registrar abre uno y /journal el diario libre.",
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
        f"📝 Anotado junto a tu registro de hoy ({last['emoji']} {last['mood_label']}).\n\n<i>«{text[:200]}{'…' if len(text) > 200 else ''}»</i>\n\nSi quieres ver tu historial, /progreso.",
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
        elif data == "cmd_cuaderno":
            answer_callback(cb_id); handle_cuaderno(chat_id)
        elif data == "cmd_boletin":
            answer_callback(cb_id); handle_boletin(chat_id)
        elif data == "cmd_manifiesto":
            answer_callback(cb_id); handle_manifiesto(chat_id)
        elif data == "cmd_sobre":
            answer_callback(cb_id); handle_sobre(chat_id)
        elif data == "cmd_idioma":
            answer_callback(cb_id); handle_idioma(chat_id)
        elif data == "cmd_semana":
            answer_callback(cb_id); handle_semana(chat_id)
        elif data.startswith("lang_"):
            handle_lang_callback(chat_id, cb_id, data.split("_", 1)[1])
        else:
            answer_callback(cb_id, "Acción desconocida")
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
        elif cmd in ("blog", "cuaderno"):
            handle_cuaderno(chat_id)
        elif cmd in ("boletin", "boletín", "newsletter"):
            handle_boletin(chat_id)
        elif cmd in ("manifiesto", "manifesto"):
            handle_manifiesto(chat_id)
        elif cmd in ("sobre", "ander", "about"):
            handle_sobre(chat_id)
        elif cmd in ("idioma", "lang", "language"):
            handle_idioma(chat_id)
        elif cmd in ("semana", "weekly", "week"):
            handle_semana(chat_id)
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
            send_message(chat_id, "🌐 <b>egoera.es</b>\n\nPsicología, despacio. Cuaderno, boletín y diario emocional.\n\n<a href=\"https://egoera.es\">Ir a la web →</a>")
        else:
            send_message(chat_id, "No reconozco ese comando. /ayuda los lista todos.")
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
                "🌙 <b>Un momento, despacio</b>\n\nHoy todavía no has dejado huella aquí. Si te apetece, /registrar abre el diario.\nY si no es buen día para escribir, no pasa nada.",
                reply_markup=inline_keyboard([("📝 Anotar ahora", "cmd_registrar")]),
            )
            sent += 1
        except Exception as e:
            log.warning(f"Reminder failed for {chat_id}: {e}")
    log.info(f"Daily reminders sent: {sent}")


def send_weekly_summary():
    """Sunday-morning narrative digest. Uses the new editorial voice."""
    for chat_id in list_all_users():
        user = get_user_data(chat_id)
        entries = user.get("entries", [])
        if not entries:
            continue
        week_ago = datetime.date.today() - datetime.timedelta(days=7)
        this_week = [e for e in entries if datetime.date.fromisoformat(e["date"]) >= week_ago]
        if not this_week:
            continue
        lang = user.get("lang", "es")
        title = t("week_title", lang)
        narrative = _weekly_narrative(user, lang)
        text = f"{title}\n\n{narrative}" if narrative else f"{title}\n\n{t('week_empty', lang)}"
        try:
            send_message(chat_id, text, disable_preview=True)
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
                    f"""🤍 <b>Solo quería escribirte</b>

Esta semana te he leído algo más cuesta arriba que la anterior (media {statistics.fmean(this_week):.1f} frente a {statistics.fmean(prev_week):.1f}). No pasa nada por estar así.

Si te apetece, podemos ir despacio:
• /respirar — respiración guiada
• /grounding — volver al presente
• /journal — soltar por escrito

Y si lo necesitas, /sos. Ander también atiende en <a href=\"mailto:hola@egoera.es\">hola@egoera.es</a>.

Cuídate. 🌱""",
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

