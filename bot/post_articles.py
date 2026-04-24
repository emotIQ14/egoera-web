#!/usr/bin/env python3
"""Publish 4 blog articles to egoera.es via the WordPress REST API.

Usage: python3 post_articles.py
"""

from __future__ import annotations

import base64
import json
import socket
import sys
import urllib.error
import urllib.request

WP_HOST = "egoera.es"
WP_IP = "217.160.0.3"
USERNAME = "user13182230948955"
APP_PASSWORD = "aMbS E65G G6As zBSt dEEN x9dG"
BASE = f"https://{WP_HOST}/wp-json/wp/v2"

# --- Force the egoera.es hostname to resolve to its IP (handles flaky DNS). ---
_orig_getaddrinfo = socket.getaddrinfo


def _patched_getaddrinfo(host, *args, **kwargs):
    if host == WP_HOST:
        return _orig_getaddrinfo(WP_IP, *args, **kwargs)
    return _orig_getaddrinfo(host, *args, **kwargs)


socket.getaddrinfo = _patched_getaddrinfo


def _auth_header() -> str:
    raw = f"{USERNAME}:{APP_PASSWORD}".encode()
    return "Basic " + base64.b64encode(raw).decode()


def wp_request(method: str, path: str, payload: dict | None = None) -> dict:
    url = f"{BASE}{path}"
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", _auth_header())
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    req.add_header("Host", WP_HOST)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {path} -> {e.code}: {body[:500]}") from None


def wp_post(title: str, content: str, category_id: int, excerpt: str, slug: str) -> dict:
    payload = {
        "title": title,
        "slug": slug,
        "content": content,
        "excerpt": excerpt,
        "status": "publish",
        "categories": [category_id],
        "comment_status": "open",
    }
    return wp_request("POST", "/posts", payload)


# ----------------------------- ARTICLES ------------------------------

ARTICLES = [
    {
        "title": "La tecnica del contraste mental: por que visualizar no es suficiente",
        "slug": "contraste-mental-woop",
        "category_id": 3,  # regulacion-emocional
        "excerpt": (
            "Visualizar el exito no basta — la investigacion de Gabriele Oettingen demuestra que "
            "la tecnica del contraste mental (y el metodo WOOP) convierten los deseos en accion real."
        ),
        "content": """<h2>Por que «pensar en positivo» te esta saboteando</h2>
<p>Durante decadas, los libros de autoayuda vendieron la misma receta: visualiza tu objetivo con intensidad, siente que ya lo has conseguido, y el universo te lo dara. <strong>La ciencia dice exactamente lo contrario</strong>.</p>
<p>La psicologa alemana <strong>Gabriele Oettingen</strong>, catedratica en la Universidad de Nueva York y Hamburgo, lleva mas de 25 anos investigando como traducimos los deseos en logros. Sus estudios demuestran que la fantasia positiva pura no solo es inutil: <strong>reduce la energia y la probabilidad de alcanzar la meta</strong>.</p>
<p>En un experimento clasico, los estudiantes que fantaseaban durante mas tiempo con aprobar un examen sacaron peores notas y estudiaron menos horas que aquellos que alternaban entre la meta y los obstaculos.</p>

<h2>Que es el contraste mental</h2>
<p>El <strong>contraste mental</strong> (mental contrasting) es la base cientifica del metodo WOOP. Consiste en sostener dos imagenes en la mente al mismo tiempo:</p>
<ol>
<li>El <strong>futuro deseado</strong> (lo que quieres conseguir).</li>
<li>La <strong>realidad presente</strong> que lo obstaculiza (lo que esta en tu camino ahora mismo).</li>
</ol>
<p>Ese choque entre deseo y realidad es lo que activa el cerebro. Genera un compromiso real cuando el objetivo es alcanzable, y te libera para soltarlo cuando no lo es. En ambos casos, es util.</p>

<h3>El mecanismo neurologico</h3>
<p>Cuando solo fantaseas, el cerebro interpreta la visualizacion como si ya hubieras conseguido la meta. El sistema de recompensa libera dopamina, te sientes satisfecho y pierdes motivacion para actuar. Es la trampa: <strong>celebrar antes de empezar te desactiva</strong>.</p>
<p>El contraste mental rompe esa ilusion. Al poner la realidad frente al deseo, tu cerebro identifica una discrepancia que debe resolverse. Eso genera energia conductual, no pasividad.</p>

<h3>Estudios que lo respaldan</h3>
<p>Oettingen y su equipo replicaron el efecto en mas de 20 estudios con poblaciones muy distintas:</p>
<ul>
<li>Estudiantes universitarios mejoraron sus habitos de estudio.</li>
<li>Pacientes con dolor cronico aumentaron su actividad fisica.</li>
<li>Empresarios cerraron mas ventas.</li>
<li>Personas que querian dejar de fumar tuvieron tasas de exito significativamente mayores.</li>
</ul>

<h2>WOOP: el protocolo de 4 pasos</h2>
<p>WOOP es la version operativa del contraste mental. Acronimo en ingles de <strong>Wish, Outcome, Obstacle, Plan</strong>.</p>

<h3>W — Wish (Deseo)</h3>
<p>Un deseo importante, desafiante pero realista. No «ser feliz»: algo concreto que puedas completar en las proximas semanas o meses.</p>

<h3>O — Outcome (Resultado)</h3>
<p>El mejor resultado posible si consigues el deseo. Como te sentiras, que cambiara. Visualizalo con intensidad durante uno o dos minutos.</p>

<h3>O — Obstacle (Obstaculo)</h3>
<p>El obstaculo interno principal que te impide lograrlo. <strong>No el externo</strong>: no «mi jefe es toxico» sino «cuando me critica me bloqueo y dejo de hablar». El enemigo es tu patron de reaccion, no el mundo.</p>

<h3>P — Plan (Plan «si-entonces»)</h3>
<p>Una formula de implementacion concreta: «Si ocurre X, entonces hare Y». Ejemplo: «Si mi jefe me critica el informe, entonces respirare dos veces y le preguntare que cambio sugiere, en lugar de justificarme».</p>

<h2>Ejercicio: aplica WOOP a una meta real</h2>
<p>Coge un cuaderno y dedica 10 minutos a este ejercicio. No pienses en abstracto — escribelo.</p>
<ol>
<li><strong>Wish:</strong> elige un deseo concreto para las proximas 4 semanas. Una frase.</li>
<li><strong>Outcome:</strong> describe en 3 lineas como te sentiras si lo consigues. Cierra los ojos y visualiza durante 60 segundos.</li>
<li><strong>Obstacle:</strong> identifica el obstaculo interno mas probable. Pregunta: «que hare yo mismo para sabotearme?». Visualizalo durante 60 segundos.</li>
<li><strong>Plan:</strong> escribe tu formula si-entonces. Debe ser especifica, observable y activable en menos de 5 segundos.</li>
</ol>
<p>Releelo cada manana durante una semana. No vuelvas a escribirlo — simplemente activalo mentalmente. La eficacia del protocolo se mide en semanas, no en dias.</p>

<h2>Cuando el contraste mental te dice «sueltalo»</h2>
<p>Uno de los hallazgos mas interesantes de Oettingen es que WOOP tambien te ayuda a <strong>abandonar metas irrealistas</strong>. Si el obstaculo es objetivamente insalvable, el contraste mental reduce el compromiso en lugar de aumentarlo.</p>
<p>Eso no es un fallo — es una funcion. Te libera energia que estabas malgastando en un callejon sin salida para invertirla en metas alcanzables. Aprender a soltar es tan importante como aprender a perseguir.</p>

<h2>Para llevar</h2>
<p>Visualizar sin mas es un opiaceo mental. El contraste mental convierte la vision en motor. Si te cuesta avanzar en un objetivo, no es falta de voluntad: probablemente te falta conectar el deseo con el obstaculo real.</p>
<p>WOOP es una herramienta de 10 minutos que puede transformar una meta estancada en un plan accionable. No requiere talento, aplicacion especial ni motivacion — solo honestidad para mirar el obstaculo interno a la cara.</p>

<p><em>Referencias: Oettingen, G. (2014). <em>Rethinking Positive Thinking: Inside the New Science of Motivation</em>. Current. Oettingen, G., &amp; Gollwitzer, P. M. (2010). Strategies of setting and implementing goals: Mental contrasting and implementation intentions. En J. E. Maddux &amp; J. P. Tangney (Eds.), <em>Social Psychological Foundations of Clinical Psychology</em> (pp. 114-135). Guilford. Kappes, H. B., &amp; Oettingen, G. (2011). Positive fantasies about idealized futures sap energy. <em>Journal of Experimental Social Psychology</em>, 47(4), 719-729.</em></p>""",
    },
    {
        "title": "Apego evitativo: por que huyes de la intimidad aunque la deseas",
        "slug": "apego-evitativo-intimidad",
        "category_id": 4,  # relaciones-apego
        "excerpt": (
            "El apego evitativo no es falta de amor — es una estrategia aprendida para protegerte. "
            "Senales, origen y como empezar a transformarlo hacia un apego seguro."
        ),
        "content": """<h2>La paradoja del apego evitativo</h2>
<p>Quieres una relacion profunda. Cuando empieza una, te sientes vivo. Pero a las pocas semanas o meses, algo cambia: te sofoca, necesitas espacio, encuentras defectos en la otra persona, te sientes invadido. Te alejas. Y cuando te alejas, sientes paz — pero tambien una soledad que no sabes nombrar.</p>
<p>Esto no es frialdad, inmadurez ni «problemas de compromiso». Es un <strong>estilo de apego evitativo</strong>, y es mucho mas comun de lo que se cree: alrededor del <strong>25% de la poblacion adulta</strong> lo presenta.</p>

<h2>Que es el apego evitativo</h2>
<p>El apego es el sistema biologico que regula como nos conectamos con las figuras significativas. <strong>John Bowlby</strong> y <strong>Mary Ainsworth</strong> lo identificaron en los anos 70 estudiando bebes. Decadas despues, Shaver y Mikulincer lo trasladaron al mundo adulto.</p>
<p>El estilo evitativo tiene dos variantes: <strong>evitativo-desactivante</strong> (el clasico) y <strong>evitativo-temeroso</strong> (mezcla de evitacion y ansiedad). Aqui nos centramos en el primero.</p>

<h3>Senales principales</h3>
<ul>
<li>Valoras la independencia por encima de todo.</li>
<li>Te incomoda la dependencia emocional — tuya o de los demas.</li>
<li>Minimizas la importancia de las relaciones cuando te duelen.</li>
<li>Te desconectas emocionalmente en momentos de tension.</li>
<li>Prefieres relaciones a distancia, intermitentes o «complicadas».</li>
<li>Idealizas relaciones pasadas o imposibles mientras criticas la presente.</li>
<li>Te cuesta pedir ayuda, expresar necesidades o mostrar vulnerabilidad.</li>
<li>Tu lenguaje corporal se tensa ante el contacto prolongado.</li>
</ul>

<h2>De donde viene</h2>
<p>El apego evitativo no es genetico ni una opcion. Se forma en la primera infancia, cuando el cuidador principal respondio sistematicamente de una de estas formas ante tu malestar:</p>

<h3>1. Indisponibilidad emocional</h3>
<p>El cuidador atendia lo fisico (comida, ropa) pero no lo emocional. Cuando llorabas por miedo, aburrimiento o tristeza, la respuesta era distraccion, negacion o indiferencia. El nino aprende: <strong>mis emociones no importan, mejor no las muestres</strong>.</p>

<h3>2. Rechazo sutil</h3>
<p>Cuando mostrabas vulnerabilidad, el cuidador se incomodaba, se molestaba o te retiraba la atencion. El nino aprende: <strong>necesitar es peligroso, la conexion tiene un precio</strong>.</p>

<h3>3. Hiper-exigencia de autonomia</h3>
<p>«No seas llorica», «ya eres mayor», «no necesitas que te ayude». El nino se vuelve funcional antes de tiempo y desarrolla una identidad basada en no necesitar a nadie.</p>

<p>El resultado es una <strong>estrategia desactivante</strong>: el sistema de apego se suprime para evitar el dolor de buscar proximidad y no recibirla. A corto plazo, funciona. A largo plazo, bloquea la intimidad que todos los seres humanos necesitamos.</p>

<h2>Por que huyes cuando el vinculo se profundiza</h2>
<p>Todo va bien al principio: hay chispa, hay atraccion, hay conversaciones interesantes. Cuando el vinculo empieza a pedir mas — compromiso, convivencia, vulnerabilidad — <strong>se activa el sistema de apego que llevas desactivando toda la vida</strong>. Y duele.</p>
<p>Tu cerebro interpreta esa activacion como una amenaza: «si me acerco, me haran dano como entonces». La respuesta automatica es alejarte, encontrar defectos, enfriarte. No es una decision consciente — es un sistema de alarma antiguo que lleva decadas funcionando en segundo plano.</p>

<h2>4 pasos para trabajar el apego evitativo</h2>

<h3>1. Reconoce tu patron sin juzgarlo</h3>
<p>No eres frio ni defectuoso. Aprendiste a protegerte de una herida real. El primer paso es dejar de identificarte con el evitativo («soy asi») y empezar a observarlo («hago esto»).</p>

<h3>2. Nombra la activacion en el momento</h3>
<p>Cuando sientas el impulso de huir («necesito espacio», «me agobia», «mejor lo dejo»), para un segundo. Pregunta: «que emocion intento no sentir?». Normalmente es miedo al rechazo o al engullimiento.</p>

<h3>3. Practica la proximidad controlada</h3>
<p>No hace falta saltar de la evitacion a la fusion. Entrena micro-dosis de intimidad: compartir un pensamiento vulnerable, pedir un favor pequeno, aceptar un abrazo sin tensarte. Cada micro-experiencia le ensena a tu sistema nervioso que la conexion ya no es peligrosa.</p>

<h3>4. Busca relaciones con apego seguro</h3>
<p>Las personas con apego seguro son el «laboratorio» donde se sana. No te retan ni te agobian — te sostienen con calma cuando te desregulas. Si todas tus parejas han sido ansiosas o caoticas, probablemente buscabas la intensidad que confirma tu guion interno.</p>

<h2>Ejercicio: el mapa del impulso evitativo</h2>
<p>Durante dos semanas, anota en un cuaderno cada vez que sientas el impulso de alejarte:</p>
<ol>
<li>Fecha y contexto (con quien, que paso).</li>
<li>La sensacion fisica (tension en el pecho, ganas de irte, incomodidad).</li>
<li>El pensamiento automatico («esto no funciona», «me agobia»).</li>
<li>La emocion que hay debajo, si te atreves a mirar (miedo, verguenza, tristeza).</li>
<li>Que hiciste — y que podrias haber hecho distinto.</li>
</ol>
<p>Al cabo de 14 dias, tendras un mapa de tus disparadores y tus reacciones. No se trata de cambiar de golpe — se trata de <strong>ver lo que antes era invisible</strong>. La conciencia es el primer ladrillo del cambio.</p>

<h2>Para llevar</h2>
<p>El apego evitativo se puede transformar. No eres una persona defectuosa: eres una persona que aprendio a sobrevivir a un entorno que no podia sostenerte emocionalmente. Esa estrategia te salvo entonces — hoy ya no te sirve.</p>
<p>El apego seguro no es la ausencia de miedo, es la capacidad de acercarte al otro sintiendo miedo y quedarte. Es un musculo, no un rasgo fijo. Se entrena.</p>

<p><em>Referencias: Bowlby, J. (1969). <em>Attachment and Loss, Vol. 1: Attachment</em>. Basic Books. Mikulincer, M., &amp; Shaver, P. R. (2007). <em>Attachment in Adulthood: Structure, Dynamics, and Change</em>. Guilford Press. Levine, A., &amp; Heller, R. (2010). <em>Attached: The New Science of Adult Attachment</em>. Penguin. Wallin, D. J. (2007). <em>Attachment in Psychotherapy</em>. Guilford Press.</em></p>""",
    },
    {
        "title": "El efecto Dunning-Kruger: por que los ignorantes no saben que lo son",
        "slug": "efecto-dunning-kruger",
        "category_id": 5,  # autoconocimiento
        "excerpt": (
            "El efecto Dunning-Kruger explica por que los menos competentes se creen expertos y "
            "los expertos dudan de si mismos. Que dice la ciencia y como usarlo para conocerte mejor."
        ),
        "content": """<h2>«Cuanto menos sabes, mas crees saber»</h2>
<p>En 1999, <strong>David Dunning</strong> y <strong>Justin Kruger</strong>, psicologos de la Universidad de Cornell, publicaron un estudio que cambio la forma de entender la autoevaluacion humana. Su pregunta era simple: por que tanta gente con bajo rendimiento se considera a si misma competente?</p>
<p>La respuesta — hoy conocida como <strong>efecto Dunning-Kruger</strong> — es incomoda: <strong>la incompetencia oculta la incompetencia</strong>. Las mismas habilidades cognitivas que necesitas para hacer algo bien son las que necesitas para saber que lo estas haciendo mal. Si te faltan, te faltan para ambas cosas.</p>

<h2>El estudio original</h2>
<p>Dunning y Kruger pidieron a estudiantes que realizaran pruebas de gramatica, logica y humor. Despues les preguntaron que tan bien creian haberlo hecho, en percentil, comparado con sus companeros.</p>
<p>El resultado fue sorprendente:</p>
<ul>
<li>Los del <strong>cuartil inferior</strong> (peor 25%) estimaron estar en el percentil 62 — creyeron estar por encima de la media.</li>
<li>Los del <strong>cuartil superior</strong> (mejor 25%) estimaron estar en el percentil 72 — subestimaron su rendimiento.</li>
</ul>
<p>La distancia entre percepcion y realidad era inversa a la competencia: los peores sobreestimaban masivamente, los mejores eran mas humildes.</p>

<h2>Por que funciona asi</h2>

<h3>1. La meta-cognicion es una habilidad aparte</h3>
<p>Evaluar tu propio rendimiento requiere saber que seria un buen rendimiento. Si no tienes el criterio interno (porque te falta la competencia), no puedes detectar tus errores. Es una ceguera estructural, no mala fe.</p>

<h3>2. El experto sufre «maldicion del conocimiento»</h3>
<p>Quien domina algo lo considera obvio. Al juzgar a los demas, asume que tambien lo encuentran obvio. Eso le lleva a pensar que su rendimiento es solo promedio — porque subestima lo dificil que es su habilidad para el resto.</p>

<h3>3. La curva completa</h3>
<p>Aunque el meme popular muestra la famosa «curva» con un «pico de la estupidez» extremo, la forma real es mas matizada: existe una fuerte correlacion negativa entre conocimiento y sobreestimacion, pero no un pico grotesco. Lo que es innegable es el patron central: <strong>los peores se creen mejores; los mejores se creen peores</strong>.</p>

<h2>Implicaciones practicas</h2>

<h3>En el trabajo</h3>
<p>Los empleados peor preparados suelen ser los que mas hablan en reunion, proponen cambios con mas seguridad y critican mas a los demas. No porque sean arrogantes por naturaleza — porque no pueden ver lo que les falta. Mientras tanto, los mejor preparados dudan, matizan y piden opinion.</p>

<h3>En las redes sociales</h3>
<p>El debate publico esta dominado por personas con opiniones firmes sobre temas que no han estudiado. La firmeza con la que alguien defiende una idea suele ser <strong>inversamente proporcional</strong> a su conocimiento real del tema.</p>

<h3>En tu propia vida</h3>
<p>Lo mas incomodo del efecto Dunning-Kruger es que <strong>te afecta a ti tambien</strong>. Hay areas en las que te crees competente y no lo eres. El problema es que, por definicion, no puedes saber cuales. Esa es la trampa.</p>

<h2>El sindrome del impostor: la otra cara</h2>
<p>La gente competente que duda de si misma experimenta lo que se conoce como <strong>sindrome del impostor</strong>. No es humildad — es una distorsion que tambien paraliza. Mujeres, migrantes y personas de origen obrero lo padecen mas, porque ademas cargan con sesgos sociales que refuerzan esa duda.</p>
<p>Curiosamente, el antidoto es el mismo: calibrar tu competencia con <strong>datos externos</strong>, no con sensaciones internas.</p>

<h2>Ejercicio: calibrar tu percepcion</h2>
<p>Elige una habilidad que creas dominar razonablemente (escribir, conducir, negociar, programar, cocinar, etc.) y sigue este protocolo:</p>
<ol>
<li><strong>Autoevaluacion en ciegas:</strong> puntuate del 1 al 10 en esa habilidad. Anota el numero.</li>
<li><strong>Busca evaluacion externa:</strong> pide a 3 personas que te conozcan que te puntuen con honestidad. No a tu mejor amigo — a alguien que tenga criterio tecnico.</li>
<li><strong>Test objetivo:</strong> busca una prueba estandar o benchmark del area (examen oficial, ranking, portfolio comparado).</li>
<li><strong>Compara los tres datos.</strong> Si los tres puntos te dan una evaluacion mas baja que la tuya, estas en zona Dunning-Kruger. Si mas alta, en zona impostor.</li>
<li><strong>Ajusta tu narrativa interna</strong> y define un plan de mejora realista.</li>
</ol>

<h2>Tres habitos para protegerte del efecto</h2>
<ul>
<li><strong>Pregunta siempre «que me falta por saber?»</strong> antes de emitir un juicio firme.</li>
<li><strong>Rodate de gente mas competente que tu</strong> en las areas que te importan. Obliga a tu cerebro a recalibrar.</li>
<li><strong>Celebra la incomodidad de aprender.</strong> Sentir que sabes menos cuanto mas estudias es senal de progreso real, no de retroceso.</li>
</ul>

<h2>Para llevar</h2>
<p>La confianza excesiva no es carisma — es un sintoma. La duda moderada no es debilidad — es competencia. Si nunca dudas de ti mismo en un area, es una buena pista para sospechar de ti mismo en esa area.</p>
<p>El autoconocimiento empieza cuando aceptas que tu cerebro no es un observador neutro de si mismo. Necesita espejos externos, datos objetivos y humildad estructural para verse con claridad.</p>

<p><em>Referencias: Kruger, J., &amp; Dunning, D. (1999). Unskilled and unaware of it: How difficulties in recognizing one's own incompetence lead to inflated self-assessments. <em>Journal of Personality and Social Psychology</em>, 77(6), 1121-1134. Dunning, D. (2011). The Dunning-Kruger effect: On being ignorant of one's own ignorance. <em>Advances in Experimental Social Psychology</em>, 44, 247-296. Clance, P. R., &amp; Imes, S. A. (1978). The impostor phenomenon in high achieving women. <em>Psychotherapy: Theory, Research &amp; Practice</em>, 15(3), 241-247.</em></p>""",
    },
    {
        "title": "Decir no sin explicaciones: el arte del rechazo asertivo",
        "slug": "decir-no-sin-explicaciones",
        "category_id": 6,  # limites-asertividad
        "excerpt": (
            "Decir no no requiere justificarte. Tecnicas, scripts listos para usar y como gestionar "
            "la culpa y las objeciones habituales cuando pones un limite."
        ),
        "content": """<h2>Por que nos cuesta tanto decir «no»</h2>
<p>Decir no sin excusas es una de las habilidades mas dificiles para las personas complacientes — y una de las mas liberadoras. La mayoria de nosotros fuimos entrenados desde pequenos con el mensaje contrario: ser buena persona es decir si, ser egoista es decir no.</p>
<p>El resultado en la vida adulta es una agenda sobrecargada, relaciones desequilibradas y un resentimiento sordo que aparece cuando aceptamos por enesima vez algo que no queriamos hacer.</p>
<p><strong>La asertividad</strong> — concepto desarrollado por Andrew Salter, Joseph Wolpe y popularizado por Manuel Smith — es el antidoto: la capacidad de defender tus derechos personales sin agredir ni someterte.</p>

<h2>El derecho a no dar explicaciones</h2>
<p>En <em>When I Say No, I Feel Guilty</em> (1975), Manuel Smith enumero una serie de <strong>derechos asertivos basicos</strong>. Uno de ellos es, literalmente, el mas olvidado:</p>
<blockquote><p><em>«Tienes derecho a no dar razones ni excusas para justificar tu comportamiento».</em></p></blockquote>
<p>No necesitas justificar por que no quieres ir a esa cena, ayudar en ese proyecto o prestar ese dinero. Dar una razon es <strong>un regalo que haces</strong>, no una obligacion. Y cuando lo das por obligacion, invitas a la otra persona a debatirla.</p>

<h3>Por que las explicaciones te perjudican</h3>
<p>Cuando justificas un no con un motivo detallado, ocurre lo siguiente:</p>
<ul>
<li>Conviertes tu decision en <strong>algo negociable</strong> (el otro puede rebatir tu razon).</li>
<li>Dejas entrever que necesitas su aprobacion para tu decision.</li>
<li>Abres la puerta a que te ofrezca «soluciones» a tu supuesto problema.</li>
<li>Refuerzas la creencia interna de que tu decision por si misma no es suficiente.</li>
</ul>

<h2>4 tecnicas asertivas para decir no</h2>

<h3>1. Disco rayado</h3>
<p>Consiste en repetir tu posicion con serenidad, sin dejarte distraer. No ataques, no te justifiques, no contraataques. Simplemente mantente.</p>
<p><strong>Ejemplo:</strong></p>
<p>— «Oye, necesito que me cubras este fin de semana en el trabajo.»<br>
— «Esta vez no puedo, gracias por preguntar.»<br>
— «Pero si no tienes nada, vamos, hazme este favor.»<br>
— «Entiendo que te venga mal, pero esta vez no puedo.»<br>
— «De verdad te cuesta tanto? Eres un borde.»<br>
— «Lo entiendo. Esta vez no puedo.»</p>

<h3>2. Banco de niebla</h3>
<p>Reconoce lo que el otro dice sin entrar al trapo. Le das la razon en lo que puedas sin cambiar tu posicion. Desarma la agresion sin combate.</p>
<p><strong>Ejemplo:</strong></p>
<p>— «Siempre estas diciendo que no, eres un egoista.»<br>
— «Puede que tengas razon en que digo no a menudo. Igualmente, no voy a ir.»</p>

<h3>3. Aserto negativo</h3>
<p>Cuando te critican por decir no, no te defiendas. Acepta la critica sin disculparte repetidamente. Quitale el poder de la critica al reconocerla.</p>
<p><strong>Ejemplo:</strong></p>
<p>— «Eres un desagradecido por no venir a la boda.»<br>
— «Puede que te parezca desagradecido. No voy a ir.»</p>

<h3>4. Aserto positivo</h3>
<p>Cuando el no es dificil, puedes acompanarlo de algo positivo sobre la relacion, pero sin justificarte. Reconoces al otro sin ceder.</p>
<p><strong>Ejemplo:</strong></p>
<p>— «No puedo ayudarte con la mudanza este sabado. Espero que te vaya genial y nos vemos la semana que viene.»</p>

<h2>Scripts listos para usar</h2>

<h3>En el trabajo</h3>
<ul>
<li>«No puedo aceptar mas tareas esta semana. Si tiene prioridad, dime que quitamos de lo que ya tengo.»</li>
<li>«Esta peticion no entra en mis responsabilidades. Para eso te conviene hablar con [persona].»</li>
<li>«No voy a poder quedarme hoy. Me voy a las 17:00 como estaba previsto.»</li>
</ul>

<h3>Con la familia</h3>
<ul>
<li>«Este ano no voy a ir a la cena de Navidad. Lo he pensado y es lo que quiero.»</li>
<li>«Prefiero no hablar de eso ahora. Cambiamos de tema?»</li>
<li>«Aprecio que quieras ayudar, pero no necesito consejos sobre este tema.»</li>
</ul>

<h3>Con amigos o pareja</h3>
<ul>
<li>«Hoy no me apetece salir. Otro dia lo hacemos.»</li>
<li>«No es para mi. Gracias por invitarme.»</li>
<li>«No voy a prestar ese dinero. No es por ti, es una regla mia.»</li>
</ul>

<h2>Como gestionar la culpa despues</h2>
<p>Si llevas toda la vida diciendo si, las primeras veces que digas no sentiras culpa. Es normal — no es una senal de que hiciste algo mal. Es el sistema emocional ajustandose a un patron nuevo.</p>

<h3>3 pasos para transitar la culpa</h3>
<ol>
<li><strong>No la niegues:</strong> reconoce la sensacion fisica de la culpa (presion en el pecho, impulso de llamar para disculparte).</li>
<li><strong>Pregunta:</strong> «he hecho algo objetivamente mal o estoy sintiendo la incomodidad de un habito nuevo?». La diferencia es fundamental.</li>
<li><strong>No repares lo que no necesita reparacion:</strong> no llames para justificarte, no envies un mensaje extra «para suavizar». Deja reposar. La culpa pasa.</li>
</ol>

<h2>Ejercicio: el registro del «si» forzado</h2>
<p>Durante dos semanas, lleva un registro de cada vez que digas si a algo que realmente no querias hacer. Anota:</p>
<ol>
<li>Situacion y quien pidio.</li>
<li>Que dijiste realmente.</li>
<li>Que querias decir.</li>
<li>Coste emocional (cansancio, enfado, resentimiento).</li>
<li>Que habrias dicho con un no asertivo.</li>
</ol>
<p>Al final de las dos semanas, identifica dos o tres situaciones recurrentes donde te cuesta mas negarte. Esas son tus zonas de entrenamiento. Practica un script especifico para cada una.</p>

<h2>Objeciones habituales — y como gestionarlas</h2>
<ul>
<li><strong>«Pero solo te pido un favor pequeno...»</strong> → «Entiendo, pero esta vez no puedo.»</li>
<li><strong>«Te has vuelto raro, antes no decias que no.»</strong> → «Estoy aprendiendo a cuidarme mejor. Esta vez no.»</li>
<li><strong>«Me estas decepcionando.»</strong> → «Lamento que te sientas asi, pero mi respuesta sigue siendo no.»</li>
<li><strong>El silencio incomodo tras tu no.</strong> → No lo llenes. Sostenlo. Que la incomodidad no la absorbas tu.</li>
</ul>

<h2>Para llevar</h2>
<p>Decir no sin explicaciones no es ser frio ni grosero — es respetarte a ti y tambien al otro, porque eliminas el juego de justificar/rebatir. Un no claro es mas respetuoso que un si resentido.</p>
<p>Al principio costara. Con la practica, se convertira en tu opcion por defecto. Y descubriras algo incomodo y liberador a la vez: la mayoria de la gente lo acepta con normalidad. El drama estaba, sobre todo, en tu cabeza.</p>

<p><em>Referencias: Smith, M. J. (1975). <em>When I Say No, I Feel Guilty</em>. Dial Press. Alberti, R., &amp; Emmons, M. (2017). <em>Your Perfect Right: Assertiveness and Equality in Your Life and Relationships</em> (10th ed.). New Harbinger. Castanyer, O. (2014). <em>La asertividad: expresion de una sana autoestima</em>. Desclee de Brouwer. Bishop, S. (2006). <em>Develop Your Assertiveness</em>. Kogan Page.</em></p>""",
    },
]


def word_count(html: str) -> int:
    # crude but adequate: strip tags, split on whitespace
    import re
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return len(text.split())


def main() -> int:
    print("Verificando conexion con egoera.es...")
    try:
        cats = wp_request("GET", "/categories?per_page=20")
        print(f"  OK: {len(cats)} categorias encontradas.")
    except Exception as e:
        print(f"  ERROR: {e}")
        return 1

    published: list[dict] = []

    for art in ARTICLES:
        print(f"\nPublicando: {art['title']}")
        try:
            result = wp_post(
                title=art["title"],
                content=art["content"],
                category_id=art["category_id"],
                excerpt=art["excerpt"],
                slug=art["slug"],
            )
            published.append({
                "id": result["id"],
                "title": result["title"]["rendered"],
                "url": result["link"],
                "words": word_count(art["content"]),
                "category": art["category_id"],
            })
            print(f"  OK -> id={result['id']} url={result['link']}")
        except Exception as e:
            print(f"  ERROR: {e}")

    print("\nVerificando articulos publicados...")
    verified: list[dict] = []
    for p in published:
        try:
            fetched = wp_request("GET", f"/posts/{p['id']}")
            verified.append({
                "id": fetched["id"],
                "title": fetched["title"]["rendered"],
                "url": fetched["link"],
                "words": p["words"],
                "status": fetched["status"],
            })
        except Exception as e:
            print(f"  ERROR verificando {p['id']}: {e}")

    print("\n=== RESULTADO ===")
    print(json.dumps(verified, indent=2, ensure_ascii=False))
    return 0 if len(verified) == len(ARTICLES) else 2


if __name__ == "__main__":
    sys.exit(main())
