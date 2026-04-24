"""
Publica 8 articulos generados a partir de los PDFs del curso de Psicologia Positiva.
Mantiene el estilo del blog egoera.es: espanol SIN tildes, HTML estructurado, referencias academicas.
"""
import urllib.request
import json
import ssl
import socket
import base64

# --- Patch DNS para egoera.es ---
original_getaddrinfo = socket.getaddrinfo


def patched(host, port, *a, **k):
    if host == "egoera.es":
        return original_getaddrinfo("217.160.0.3", port, *a, **k)
    return original_getaddrinfo(host, port, *a, **k)


socket.getaddrinfo = patched

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
auth = base64.b64encode(b"user13182230948955:aMbS E65G G6As zBSt dEEN x9dG").decode()


def wp_post(endpoint, data):
    url = f"https://egoera.es/wp-json/wp/v2/{endpoint}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Authorization", f"Basic {auth}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Host", "egoera.es")
    resp = urllib.request.urlopen(req, context=ctx)
    return json.loads(resp.read())


# =============================================================================
# ARTICULO 1: Perdonarse a uno mismo
# Categoria: regulacion-emocional (3)
# =============================================================================
ARTICULO_1 = {
    "title": "Perdonarse a uno mismo: el proceso psicologico menos practicado",
    "slug": "perdonarse-a-uno-mismo",
    "categories": [3],
    "status": "publish",
    "excerpt": (
        "Pedir perdon es dificil. Perdonarse a uno mismo lo es todavia mas. "
        "Exploramos el proceso estructurado de Worthington, Fisher y Exline para soltar "
        "la culpa cronica y la verguenza que se enquistan en el cuerpo."
    ),
    "content": """<h2>El perdon mas ignorado de la psicologia</h2>
<p>Cuando hablamos de perdon, la mente se va casi siempre a perdonar a otros. Perdonar al ex que traiciono, al padre que no supo, al amigo que fallo. Es un trabajo duro, pero al menos esta nombrado en la cultura. Hay libros, retiros, practicas.</p>
<p>Lo que apenas se nombra es el <strong>perdon a uno mismo</strong>. Y sin embargo, es probablemente la forma de perdon mas compleja y transformadora. Porque aqui no hay otro sobre el que proyectar la responsabilidad. Eres tu, mirandote al espejo, sosteniendo algo que hiciste y que te sigue doliendo.</p>
<blockquote>No podemos cambiar lo que hicimos. Pero podemos cambiar la relacion que tenemos con ello. Ese es el verdadero trabajo del perdon.</blockquote>

<h2>Por que cuesta tanto perdonarse</h2>
<p>Hay una creencia popular que confunde el perdon con la absolucion. Perdonarme significaria dejarlo pasar, como si no hubiera ocurrido, lo cual parece moralmente inaceptable cuando hicimos dano real. De ahi que muchas personas prefieran <em>cargar</em> con la culpa antes que perdonarse, como si la culpa fuese la unica prueba de que siguen siendo buenas personas.</p>
<p>Los investigadores Worthington (2013) y Fisher y Exline (2006) proponen una vision distinta. El perdon a uno mismo <strong>no es absolucion ni olvido</strong>. Es un proceso en el que la persona:</p>
<ul>
<li>Reconoce y acepta plenamente la responsabilidad de lo que hizo</li>
<li>Permite sentir el malestar emocional asociado sin evitarlo</li>
<li>Se compromete con valores personales y conductas reparadoras</li>
<li>Decide dejar de castigarse de forma cronica y desproporcionada</li>
</ul>
<p>Perdonarse no borra lo ocurrido. Reubica a la persona para que pueda seguir viviendo sin que la culpa se convierta en identidad.</p>

<h2>Senales de que te falta perdonarte</h2>
<p>A veces no identificamos que hay una ofensa hacia uno mismo pendiente. Estas son algunas de las senales mas habituales:</p>
<ul>
<li>Vuelves una y otra vez al mismo recuerdo y te reprochas lo que hiciste o no hiciste</li>
<li>Sientes verguenza corporal al pensar en esa etapa de tu vida</li>
<li>Te cuesta confiar en ti mismo para tomar decisiones importantes</li>
<li>Te saboteas cuando algo empieza a ir bien, como si no lo merecieras</li>
<li>Usas etiquetas duras contigo ("soy egoista", "soy toxico", "no valgo")</li>
</ul>
<p>Cuando el dolor se instala asi, no es etico ni util. Es simplemente una trampa emocional que impide el cambio real.</p>

<h2>Ejercicio 1: El mapa de la ofensa propia</h2>
<p>Este es el primer paso del protocolo de Worthington. Consiste en nombrar con claridad el acto que quieres perdonarte antes de cualquier otra cosa.</p>
<ol>
<li><strong>Describe lo que hiciste</strong> en 3 o 5 frases. Sin adornos ni justificaciones. Solo los hechos.</li>
<li><strong>Identifica que valor propio fue violado</strong>. ¿Honestidad? ¿Cuidado? ¿Lealtad? ¿Presencia? El dolor viene de haber traicionado algo que era importante para ti.</li>
<li><strong>Marca con una cruz las consecuencias</strong> psicologicas que todavia cargas:
<ul>
<li>Me siento culpable por lo que hice</li>
<li>Siento verguenza por esa parte de mi que lo hizo</li>
<li>Me cuesta confiar en los demas</li>
<li>Me cuesta confiar en mi</li>
<li>Creo que nunca voy a poder cambiar</li>
<li>Siento que he perdido mi sentido o proposito</li>
<li>Estoy en duelo porque he perdido algo importante</li>
</ul>
</li>
</ol>
<p>Escribir esto saca el episodio del bucle mental y lo coloca fuera, donde se puede trabajar. Mientras este dentro de la cabeza dando vueltas, no hay procesamiento posible.</p>

<h2>Ejercicio 2: Las tres fases de Fisher y Exline</h2>
<p>Fisher y Exline (2006) identificaron que el perdon a uno mismo se atasca en una autocritica destructiva. Para desbloquearla propusieron completar frases en tres fases sucesivas.</p>
<p><strong>Fase 1. Aceptar la responsabilidad (sin flagelarse):</strong></p>
<ul>
<li>En vez de lo que hice, desearia haber _______</li>
<li>En vez de lo que hice, desearia no haber _______</li>
<li>Me hubiera gustado _______</li>
<li>Si hubiera _______</li>
</ul>
<p><strong>Fase 2. Mostrar arrepentimiento:</strong></p>
<ul>
<li>Siento mucho que haya _______</li>
<li>Me siento culpable por _______</li>
<li>Para mostrar mi arrepentimiento, quiero pedir disculpas a _______</li>
<li>Saber que la otra persona acepta mis disculpas me hara sentir _______</li>
</ul>
<p><strong>Fase 3. Cultivar humildad y compasion propia:</strong></p>
<ul>
<li>Mi accion afecto a la otra persona haciendola sentir _______</li>
<li>La otra persona y su bienestar es importante para mi porque _______</li>
<li>Pienso que me perdonaria porque _______</li>
<li>Quiero perdonarme porque _______</li>
</ul>
<p>No se trata de rellenar rapido. Cada frase es un ejercicio. Algunas se quedaran en blanco los primeros dias. Esta bien. El proceso necesita tiempo.</p>

<h2>Reconectar con los valores violados</h2>
<p>Enright (2001) insiste en que el perdon autentico termina en una reafirmacion de valores. Haz un listado de los valores que quedaron en segundo plano cuando hiciste lo que hiciste. Luego describe una o dos conductas concretas con las que piensas reafirmar esos valores en el futuro.</p>
<p>Si fallaste a la honestidad, ¿como quieres ser honesto ahora? Si fallaste al cuidado, ¿a quien vas a cuidar y como? El perdon se ancla en la accion, no solo en el sentimiento.</p>

<h2>Que no es perdonarse</h2>
<p>Vale la pena nombrar lo que NO es el perdon a uno mismo, porque la confusion impide el proceso:</p>
<ul>
<li><strong>No es olvidar.</strong> La memoria del episodio puede permanecer, pero sin la carga.</li>
<li><strong>No es justificar.</strong> No convertimos lo que hicimos en algo aceptable.</li>
<li><strong>No es inmediato.</strong> Puede requerir semanas o meses de trabajo reiterado.</li>
<li><strong>No depende de que el otro nos perdone.</strong> Son procesos distintos.</li>
<li><strong>No es un acto unico.</strong> A veces hay que repetir el proceso varias veces.</li>
</ul>

<h2>El coste de no perdonarse</h2>
<p>La culpa cronica no es neutra. Tiene un precio fisiologico y relacional. Las personas que arrastran ofensas propias no resueltas tienden a somatizar mas, a tener relaciones en las que se posicionan como indignas de ser amadas, y a sabotear oportunidades que exigirian verse con ojos menos severos.</p>
<p>Perdonarse no es un lujo psicologico. Es, muchas veces, la condicion necesaria para que la vida pueda seguir.</p>

<h2>Referencias</h2>
<p><em>Worthington, E. L. (2013). Moving forward: Six steps to forgiving yourself and breaking free from the past. WaterBrook Press.</em></p>
<p><em>Fisher, M. L., y Exline, J. J. (2006). Self-forgiveness versus excusing: The roles of remorse, effort, and acceptance of responsibility. Self and Identity, 5(2), 127-146.</em></p>
<p><em>Enright, R. D. (2001). Forgiveness is a choice: A step-by-step process for resolving anger and restoring hope. American Psychological Association.</em></p>
""",
}

# =============================================================================
# ARTICULO 2: Ceguera de valentia
# Categoria: autoconocimiento (5)
# =============================================================================
ARTICULO_2 = {
    "title": "Ceguera de valentia: por que no reconoces tu propio coraje",
    "slug": "ceguera-de-valentia",
    "categories": [5],
    "status": "publish",
    "excerpt": (
        "La mayoria de las personas creen que no son valientes. Se equivocan. "
        "El fenomeno de la ceguera de valentia explica por que tus mayores actos "
        "de coraje pasan desapercibidos incluso para ti mismo."
    ),
    "content": """<h2>La valentia que no se ve</h2>
<p>Si preguntas a alguien si es valiente, casi todas las respuestas caen en dos extremos. O se autoproclaman heroes con una seguridad sospechosa, o niegan cualquier rastro de valentia en su vida ("yo es que soy muy miedoso", "yo no he hecho nada especial").</p>
<p>La segunda respuesta es mucho mas frecuente, y tambien mas problematica. El investigador <strong>Robert Biswas-Diener</strong> la llamo <em>ceguera de valentia</em>: esa incapacidad sistematica para reconocer como valiente aquello que hiciste porque asumes que "era lo que tocaba" o "cualquiera lo habria hecho".</p>
<blockquote>La valentia no es la ausencia de miedo. Es hacer lo que importa a pesar del miedo. Y eso lo has hecho mas veces de las que recuerdas.</blockquote>

<h2>Por que minimizamos nuestro coraje</h2>
<p>Hay tres mecanismos que explican esta ceguera y que conviene conocer para desmontarlos uno por uno.</p>
<ul>
<li><strong>El sesgo del resultado.</strong> Cuando algo sale bien, interpretamos que no era tan dificil. Olvidamos que cuando lo empezamos, no teniamos ninguna garantia.</li>
<li><strong>La normalizacion retrospectiva.</strong> Una vez superada una situacion, parece menos amenazante de lo que fue. La memoria reescribe el miedo hacia abajo.</li>
<li><strong>La comparacion con extremos.</strong> Nos medimos contra bomberos, soldados, activistas. Frente a ellos parece que nuestra vida es insignificante. Pero la valentia tambien esta en las micro-decisiones cotidianas.</li>
</ul>

<h2>Los tipos de valentia que sueles ignorar</h2>
<p>Biswas-Diener distingue varias categorias de valentia, no solo la fisica. Reconocerlas amplia el catalogo de momentos en los que fuiste valiente:</p>
<ul>
<li><strong>Valentia social:</strong> decir una opinion impopular, hablar por alguien ausente, establecer un limite en un grupo.</li>
<li><strong>Valentia moral:</strong> denunciar algo injusto aunque te cueste, no mirar a otro lado en un trabajo toxico.</li>
<li><strong>Valentia intima:</strong> mostrar vulnerabilidad, pedir ayuda, abrir una conversacion emocional dificil.</li>
<li><strong>Valentia vital:</strong> dejar una carrera, terminar una relacion, mudarte de pais sin garantias.</li>
<li><strong>Valentia cotidiana:</strong> ir a la primera cita de terapia, volver a estudiar a los cuarenta, hacer una llamada que llevabas postergando meses.</li>
</ul>

<h2>Ejercicio 1: Mi linea de valentia</h2>
<p>Este ejercicio, adaptado de Biswas-Diener, es una forma directa de desmontar la ceguera de valentia. Necesitas media hora y un folio.</p>
<ol>
<li>Dibuja una linea horizontal. A la izquierda, tu nacimiento. A la derecha, el presente marcado con una estrella.</li>
<li>Marca en la linea los hitos que sentiste como un antes y un despues vital. No tienen que ser grandes eventos. Puede ser la vez que hablaste con un jefe, que pediste cita a alguien, que dejaste un club. Entre 6 y 12 marcas es ideal.</li>
<li>Debajo de cada marca, responde dos preguntas:
<ul>
<li>¿Que riesgo hubo en ese momento y como lo gestione?</li>
<li>¿Que miedo afronte para que ese hito ocurriera?</li>
</ul>
</li>
<li>Ponle nombre a la valentia que tuviste en cada uno. No uses palabras vagas como "fuerza". Usa palabras que te resuenen: "valentia para hablar claro", "valentia para dejar ir", "valentia para empezar sin saber".</li>
</ol>
<p>La primera vez que alguien hace este ejercicio suele aparecer una emocion mezclada. Sorpresa, porque nunca lo habia mirado asi. Ternura, porque reconoce al que fue. Y una sensacion nueva de fuerza, porque descubre que la valentia no es un recurso externo: ya la tiene.</p>

<h2>Ejercicio 2: El testigo externo</h2>
<p>A veces la ceguera de valentia es tan fuerte que necesitamos un espejo externo. Este ejercicio lo provee.</p>
<ol>
<li>Elige a dos o tres personas que te conozcan bien en distintas etapas de tu vida. Pueden ser un familiar, un amigo de la adolescencia y un compañero de trabajo.</li>
<li>Pideles que te respondan una pregunta unica y concreta: "¿En que momento de mi vida crees que fui mas valiente? ¿Que hiciste que yo quiza no haya reconocido como coraje?"</li>
<li>Manda la pregunta por escrito, para que puedan pensarla sin presion.</li>
<li>Recoge las respuestas y fijate en dos cosas: los momentos que nombran y las palabras exactas que usan para describirte.</li>
</ol>
<p>Es habitual que la gente nombre episodios que tu habias archivado como "nada del otro mundo". Esa discrepancia es oro puro. Te muestra donde habita tu ceguera.</p>

<h2>Por que importa nombrar la valentia propia</h2>
<p>Reconocer la propia valentia no es vanidad. Es un recurso psicologico. Las personas que saben identificar sus actos de coraje pasados afrontan con mas recursos los desafios presentes. Es lo que la investigacion llama <em>self-efficacy</em>, un concepto acuñado por Bandura.</p>
<p>Cuando te encuentras ante una decision dificil y dudas si puedes, el cerebro busca precedentes. Si tienes la biblioteca de actos valientes bien ordenada, encuentra respaldo. Si esta invisibilizada, te queda la sensacion de que es la primera vez y no sabes hacerlo.</p>
<p>Entrenar la mirada sobre uno mismo para detectar valentia es un trabajo silencioso pero decisivo. Hecho con constancia, cambia la narrativa interna de "soy alguien que tiene miedo" a "soy alguien que ha hecho cosas dificiles con miedo, una y otra vez".</p>

<h2>La valentia como musculo narrativo</h2>
<p>No se trata de inflar nuestra historia hasta convertirla en epopeya. Se trata de verla con precision. Ni minimizada ni exagerada. La valentia es precisa: implica riesgo real, miedo real, y decision real de avanzar.</p>
<p>Dejar la ceguera requiere practica. Escribir. Conversar. Mirar hacia atras con intencion. El premio es que, cuando llegue el proximo momento que exige coraje, no empezaras de cero.</p>

<h2>Referencias</h2>
<p><em>Biswas-Diener, R. (2012). The Courage Quotient: How Science Can Make You Braver. Jossey-Bass.</em></p>
<p><em>Peterson, C., y Seligman, M. E. P. (2004). Character Strengths and Virtues: A Handbook and Classification. Oxford University Press.</em></p>
<p><em>Bandura, A. (1997). Self-efficacy: The exercise of control. W. H. Freeman.</em></p>
""",
}

# =============================================================================
# ARTICULO 3: Identidad integrada
# Categoria: autoconocimiento (5)
# =============================================================================
ARTICULO_3 = {
    "title": "Identidad integrada: reconstruirse despues de un cambio vital",
    "slug": "identidad-integrada",
    "categories": [5],
    "status": "publish",
    "excerpt": (
        "Cuando cambia algo grande en tu vida (una mudanza, un divorcio, un trabajo), "
        "tu identidad tambien se desordena. La identidad integrada es la herramienta "
        "de Debra Bryson y Carl Rogers para rehacerla sin perderte."
    ),
    "content": """<h2>Quien eres cuando cambia todo a la vez</h2>
<p>Hay momentos en la vida que rompen la coherencia interna. Te separaste despues de quince años. Te mudaste a otro pais. Dejaste una carrera que era tu identidad publica. Tuviste un hijo y ya no reconoces tus prioridades. Perdiste a alguien fundamental.</p>
<p>En esos momentos aparece una sensacion rara y poco nombrada: <strong>no se quien soy ahora</strong>. No es una crisis existencial abstracta, es una desorganizacion practica de los elementos que te definian. Los roles, las relaciones, las rutinas, los grupos. Todo eso formaba una estructura y ahora esa estructura esta en el aire.</p>
<blockquote>La identidad no es un bloque fijo. Es un ecosistema. Cuando cambia una especie, cambia el equilibrio del sistema entero.</blockquote>

<h2>La identidad portable de Bryson y Hoge</h2>
<p>Las investigadoras <strong>Debra Bryson y Charise Hoge</strong> desarrollaron el concepto de <em>identidad portable</em> trabajando con personas en transicion cultural. Expatriados, inmigrantes, personas que cambiaban radicalmente de vida. Descubrieron que la identidad estaba compuesta por elementos que se podian mover y elementos que no. Y que la tarea del cambio vital era decidir conscientemente cuales llevar contigo a la nueva etapa.</p>
<p>Carl Rogers, desde la psicologia humanista, lleva decadas insistiendo en algo similar. Para el, una persona plenamente funcional es aquella que <em>se convierte en quien realmente es</em>, integrando todas sus facetas en una totalidad congruente. No se trata de encontrar "el yo verdadero" como si fuera un objeto perdido, sino de un proceso de integracion permanente.</p>

<h2>Los cuatro tipos de elementos que definen quien eres</h2>
<p>Antes del ejercicio, conviene entender que hay al menos cuatro capas en tu identidad. Cada una se puede trabajar de forma distinta:</p>
<ul>
<li><strong>Relaciones significativas:</strong> familia, pareja, amigos intimos, mentores, colegas clave.</li>
<li><strong>Grupos y etiquetas:</strong> profesion, nacionalidad, aficion, comunidad religiosa, colectivo con el que te identificas.</li>
<li><strong>Actividades centrales:</strong> lo que haces con tanta frecuencia y pasion que se ha vuelto parte de ti.</li>
<li><strong>Rasgos personales:</strong> tus puntos fuertes, tus debilidades, tus valores, tus formas de ser.</li>
</ul>
<p>Cuando cambia una capa (pierdes un trabajo, dejas un grupo, abandonas una actividad), se altera la percepcion del conjunto. Por eso las mudanzas, los duelos y las transiciones son tan desorientadoras.</p>

<h2>Ejercicio 1: El circulo de identidad</h2>
<p>Este ejercicio, adaptado del trabajo de Bryson y Hoge, te permite mapear visualmente quien eres hoy.</p>
<ol>
<li>Dibuja un circulo grande en un folio. Dentro vas a colocar todo lo que te define.</li>
<li>Usa <strong>cuatro tipos de linea distintos</strong> para distinguir las cuatro capas (relaciones, grupos, actividades, rasgos). Por ejemplo: linea continua para relaciones, punteada para grupos, ondulada para actividades, gruesa para rasgos.</li>
<li>Escribe cada elemento dentro del circulo con la linea correspondiente alrededor.</li>
<li>Deja fuera del circulo aquello que ya no sientes tuyo o que esta en transicion.</li>
<li>Contempla el dibujo. Fijate en:
<ul>
<li>Que capa esta mas poblada y cual mas vacia</li>
<li>Que elementos han entrado recientemente y cuales estan saliendo</li>
<li>Donde hay espacio en blanco que podria llenarse</li>
</ul>
</li>
</ol>
<p>El ejercicio no requiere respuestas definitivas. Su valor esta en sacar fuera lo que estaba difuso. Una vez lo ves, puedes empezar a trabajar sobre ello.</p>

<h2>Ejercicio 2: Preguntas guia de identidad</h2>
<p>Si el dibujo se te resiste, usa estas preguntas como alternativa o complemento. Son las que Bryson y Hoge proponen en el trabajo terapeutico:</p>
<ul>
<li>¿Que relaciones son tan importantes que sin ellas no me reconoceria?</li>
<li>¿A que grupos pertenezco y con que etiqueta me identifico sin dudarlo?</li>
<li>¿Que hago con tanta frecuencia o pasion que se ha vuelto parte de mi?</li>
<li>¿Que actividades ocupan una parte importante de mi tiempo? (Esto no siempre coincide con lo anterior.)</li>
<li>¿Que puntos fuertes me describen como persona?</li>
<li>¿Que debilidades tambien forman parte de mi y aceptarlas es parte de ser yo?</li>
</ul>
<p>Responde con frases concretas. "Mi relacion con mi hermana menor, que es mi primera llamada cuando algo importante pasa" es mas util que "mi familia".</p>

<h2>La integridad segun Rogers</h2>
<p>Rogers usaba la palabra <em>integridad</em> no en sentido moral sino estructural: la cualidad de tener todas las partes integradas en un conjunto. Una persona integra, para el, es quien ha reconocido y aceptado que su persona esta compuesta por multiples facetas. Algunas le gustan mas, otras menos, de otras no es del todo consciente.</p>
<p>Cuando negamos una faceta (porque nos parece inaceptable, porque choca con la imagen que queremos dar), esa parte no desaparece. Queda soterrada, operando desde la sombra. La integracion consiste en hacerle sitio aunque no nos guste.</p>
<p>Por eso el ejercicio del circulo debe incluir tanto los puntos fuertes como las debilidades. Ambos son tu.</p>

<h2>Cuando usar estas herramientas</h2>
<p>No son ejercicios de aplicacion universal. Hay momentos en que son especialmente utiles:</p>
<ul>
<li>Despues de una ruptura amorosa larga, cuando la identidad de pareja se disuelve</li>
<li>Tras una jubilacion o cambio profesional radical</li>
<li>En procesos migratorios, sobre todo entre culturas muy distintas</li>
<li>Al convertirse en padre o madre (la llamada revolucion identitaria parental)</li>
<li>Despues de un duelo, cuando parte de quien eras estaba sostenida por la persona fallecida</li>
<li>En terapia, cuando el paciente dice que no se reconoce</li>
</ul>

<h2>Dejarse reconstruir sin forzar</h2>
<p>La identidad integrada no se construye en una tarde. Bryson y Hoge hablan de un proceso de entre seis meses y dos años tras un cambio vital grande. Lo importante no es cerrar el circulo rapido. Es dejarse ver lo que esta ocurriendo mientras ocurre.</p>
<p>En periodos de transicion, la sensacion de estar entre identidades es normal. No es un fallo personal ni un sintoma a combatir. Es el estado intermedio entre quien fuiste y quien estas siendo.</p>

<h2>Referencias</h2>
<p><em>Bryson, D., y Hoge, C. (2005). A Portable Identity: A Woman's Guide to Maintaining a Sense of Self While Moving Overseas. Transition Press International.</em></p>
<p><em>Rogers, C. (1961). On Becoming a Person: A Therapist's View of Psychotherapy. Houghton Mifflin.</em></p>
<p><em>Peterson, C., y Seligman, M. E. P. (2004). Character Strengths and Virtues: A Handbook and Classification. Oxford University Press.</em></p>
""",
}

# =============================================================================
# ARTICULO 4: Mentalidad de crecimiento
# Categoria: psicologia-cotidiana (8)
# =============================================================================
ARTICULO_4 = {
    "title": "Mentalidad de crecimiento: el lenguaje que cambia tu cerebro",
    "slug": "mentalidad-de-crecimiento",
    "categories": [8],
    "status": "publish",
    "excerpt": (
        "Carol Dweck demostro que cambiar como te hablas a ti mismo reconfigura "
        "tu capacidad de aprender. La diferencia entre 'soy tonto' y 'todavia no lo entiendo' "
        "parece minima. No lo es."
    ),
    "content": """<h2>Una sola palabra que cambia todo</h2>
<p>Piensa en esta frase: "No se hacerlo". Ahora piensa en esta otra: "No se hacerlo <em>todavia</em>". La diferencia es una palabra. Pero si repites la primera durante años, y en cambio repites la segunda, terminas viviendo dos vidas distintas.</p>
<p>Esa intuicion es la que la psicologa <strong>Carol Dweck</strong> convirtio en ciencia hace mas de dos decadas. Su trabajo, condensado en el concepto de <em>mentalidad de crecimiento</em>, es uno de los marcos mas influyentes de la psicologia educativa y organizacional actual.</p>

<h2>Las dos mentalidades</h2>
<p>Dweck observo que las personas operan desde dos esquemas basicos sobre la inteligencia y las capacidades. Estos esquemas se activan de forma automatica ante un reto o un fallo.</p>
<ul>
<li><strong>Mentalidad fija.</strong> Las capacidades son algo que se tiene o no se tiene. Si fallas en algo, es porque no vales para eso. El esfuerzo es sospechoso: si tienes que esforzarte mucho, es que no eres bueno de verdad.</li>
<li><strong>Mentalidad de crecimiento.</strong> Las capacidades se desarrollan con practica, estrategia y tiempo. El fallo es informacion, no veredicto. El esfuerzo es el camino, no la señal de deficiencia.</li>
</ul>
<p>La mayoria de las personas oscilamos entre ambas segun el area. Puedes tener mentalidad de crecimiento con el trabajo y fija con el deporte, o al reves. Lo importante es detectar cuando activas cada una.</p>

<h2>El lenguaje delata la mentalidad</h2>
<p>Dweck insiste en un punto que muchas veces se ignora al aplicar su teoria: la mentalidad <strong>se manifiesta en el lenguaje</strong>, tanto el interno como el que dirigimos a otros. Cambiar el lenguaje no basta, pero sin cambiar el lenguaje es muy dificil cambiar la mentalidad.</p>

<blockquote>El cerebro escucha lo que te dices. Si le dices "soy torpe", responde protegiendose. Si le dices "estoy aprendiendo", responde abriendose.</blockquote>

<h3>Frases tipicas de mentalidad fija</h3>
<p>Estas frases son senales de alarma. Si las detectas en tu dialogo interno, estan bloqueando tu desarrollo:</p>
<ul>
<li>"Es que soy asi"</li>
<li>"Yo para esto no valgo"</li>
<li>"Siempre he sido malo en matematicas/deportes/relaciones"</li>
<li>"Los demas lo tienen mas facil"</li>
<li>"O te sale o no te sale"</li>
<li>"Si tuviera que esforzarme tanto es que no es lo mio"</li>
</ul>
<p>Fijate que comparten algo: son <em>sentencias cerradas</em>. No dejan espacio al cambio.</p>

<h3>Frases tipicas de mentalidad de crecimiento</h3>
<p>Estas son las que conviene instalar. Comparten una estructura abierta en el tiempo y en la posibilidad:</p>
<ul>
<li>"Todavia no lo he aprendido"</li>
<li>"Me esta costando porque es nuevo"</li>
<li>"¿Que estrategia distinta puedo probar?"</li>
<li>"Este fallo me dice donde tengo que poner foco"</li>
<li>"Me he esforzado mucho en esto y se nota"</li>
<li>"Esta persona llego antes que yo, ¿como lo hizo?"</li>
</ul>

<h2>Ejercicio 1: Auditoria de tus frases</h2>
<p>Este ejercicio esta diseñado para hacer visible lo que sueles decirte sin darte cuenta.</p>
<ol>
<li>Durante una semana, lleva una libreta pequeña. Cada vez que te pilles pensando o diciendo una frase evaluativa sobre ti mismo, anotala textual.</li>
<li>Al final de la semana, clasifica cada frase. ¿Es mentalidad fija? ¿Es mentalidad de crecimiento? ¿Es neutra?</li>
<li>Cuenta cuantas hay de cada tipo. No lo juzgues. Solo mira la proporcion.</li>
<li>Coge las cinco frases de mentalidad fija mas repetidas. Escribelas en una columna. En la columna de al lado, reescribelas en version crecimiento. No uses plantillas pegadas, busca la version que suene creible para ti.</li>
</ol>
<p>Ejemplo: "No se hablar en publico" se convierte en "Me cuesta hablar en publico, y estoy aprendiendo a hacerlo menos mal". La segunda version no te exige creer que eres buen orador, solo dejar la puerta abierta.</p>

<h2>Ejercicio 2: El feedback que das a otros</h2>
<p>La mentalidad de crecimiento se contagia. Cuando hablas a alguien cerca (un hijo, un empleado, una pareja) estas instalando o frenando su capacidad de aprender. Dweck mostro que elogiar el talento ("eres muy inteligente") reduce la resiliencia ante los fallos, mientras que elogiar el proceso ("te has esforzado mucho en esto") la aumenta.</p>
<p>El ejercicio consiste en observarte durante tres dias:</p>
<ol>
<li>Apunta cada elogio que dirijas a alguien cercano.</li>
<li>Marca si el elogio es al <em>atributo</em> ("eres buenisima"), al <em>proceso</em> ("has probado tres estrategias") o al <em>resultado</em> ("te ha quedado perfecto").</li>
<li>Busca reequilibrar hacia el proceso sin dejar de reconocer el resultado.</li>
</ol>
<p>No se trata de castigar los elogios al atributo, sino de variar el repertorio. "Eres listo y ademas has estudiado horas" es mejor que solo lo primero.</p>

<h2>Por que no basta con repetirse frases</h2>
<p>Hay una version pobre y mal entendida de la mentalidad de crecimiento que consiste en repetirse mantras positivos sin actuar. No sirve. Dweck insiste en que la mentalidad se construye en la <strong>interaccion entre el lenguaje y la conducta</strong>.</p>
<p>Si te dices "todavia estoy aprendiendo" pero no buscas estrategia nueva, no practicas, no pides ayuda, la frase se vacia. Se convierte en una excusa con lenguaje mejorado.</p>
<p>La mentalidad de crecimiento autentica tiene dos patas:</p>
<ul>
<li>Un lenguaje que deja abierta la posibilidad</li>
<li>Una conducta coherente: practica, revision de estrategias, apertura al fallo, busqueda de feedback</li>
</ul>

<h2>Cuando la mentalidad fija tiene sentido</h2>
<p>Matiz importante, muchas veces olvidado. No todo es cuestion de crecimiento infinito. Hay areas en las que aceptar limites propios es saludable. Medir 1,65 y querer ser jugador profesional de baloncesto en la NBA no es mentalidad de crecimiento, es negacion.</p>
<p>La mentalidad de crecimiento sana reconoce que se puede mejorar en casi todo lo que importa (relaciones, habilidades, oficios, gestion emocional), pero tambien acepta que algunos techos son estructurales. La clave es no confundirlos con los techos ficticios que nos ponemos sin evidencia.</p>

<h2>Referencias</h2>
<p><em>Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.</em></p>
<p><em>Dweck, C. S. (2017). Mindset: La actitud del exito. Sirio.</em></p>
<p><em>Yeager, D. S., y Dweck, C. S. (2012). Mindsets that promote resilience: When students believe that personal characteristics can be developed. Educational Psychologist, 47(4), 302-314.</em></p>
""",
}

# =============================================================================
# ARTICULO 5: El comite de direccion interior
# Categoria: autoconocimiento (5)
# =============================================================================
ARTICULO_5 = {
    "title": "El comite de direccion interior: tomar decisiones con cabeza, corazon e intuicion",
    "slug": "comite-direccion-interior",
    "categories": [5],
    "status": "publish",
    "excerpt": (
        "La neurociencia confirma lo que sospechabamos: decidir con el analisis "
        "pelado lleva a decisiones peores. El modelo de los tres cerebros de Soosalu "
        "es una herramienta concreta para integrar razon, emocion e intuicion."
    ),
    "content": """<h2>El mito del decisor racional</h2>
<p>Durante decadas, la cultura popular ha premiado la idea del buen decisor como alguien racional, frio, analitico. Pesa los pros y los contras, evalua datos, deja fuera la emocion. Ese retrato, tan atractivo en peliculas y libros de negocio, <strong>no se corresponde con como funciona el cerebro humano</strong>.</p>
<p>Antonio Damasio lo demostro hace ya tres decadas en su trabajo con pacientes con lesiones en la corteza prefrontal ventromedial. Esas personas tenian intacta la capacidad de razonar logicamente, pero eran incapaces de tomar decisiones simples de la vida cotidiana. ¿La razon? No podian <strong>sentir</strong> las consecuencias emocionales de las opciones disponibles. Sin ese input emocional, el sistema se colapsaba.</p>
<blockquote>La razon sin emocion no decide. Se bloquea. La emocion sin razon tampoco decide. Arrolla. Solo la integracion de ambas, con un tercer input intuitivo, produce decisiones sabias.</blockquote>

<h2>El modelo tripartita de Soosalu</h2>
<p>Los investigadores <strong>Soosalu, Henwood y Deo (2019)</strong> recogieron dos lineas de trabajo (la de Damasio sobre la emocion y la de Tversky y Kahneman sobre la intuicion) y propusieron un modelo de decision integrado en tres sistemas:</p>
<ul>
<li><strong>Cabeza:</strong> analisis racional de informacion. Datos, argumentos, estructura. Responde a preguntas como "¿que es lo mas probable?" o "¿cual es la evidencia?".</li>
<li><strong>Corazon:</strong> respuestas emocionales. Lo que quiere, lo que le duele, lo que le entusiasma a la persona. Responde a "¿como me siento con cada opcion?".</li>
<li><strong>Tripas:</strong> conciencia interoceptiva e intuicion. Una forma de conocimiento corporal y tacito acumulado por la experiencia. Responde a "¿que me dice el cuerpo aqui?".</li>
</ul>
<p>Ninguno de los tres es suficiente por si solo. El desafio es aprender a consultarlos a los tres antes de decidir algo importante.</p>

<h2>Como se bloquean las decisiones</h2>
<p>Cuando una decision se atasca durante semanas o meses, casi siempre es porque uno o dos de los tres sistemas estan silenciados. Estos son los patrones mas comunes:</p>
<ul>
<li><strong>Analisis dominante, corazon silenciado.</strong> Haces listas de pros y contras infinitas pero no sientes nada por las opciones. La decision racionalmente mejor no te motiva.</li>
<li><strong>Emocion dominante, analisis silenciado.</strong> Te mueves a impulso de lo que te apetece hoy sin ver las consecuencias practicas.</li>
<li><strong>Intuicion silenciada.</strong> Lo mas frecuente en occidente. El cuerpo tiene informacion pero no sabes escucharla porque te enseñaron a desconfiar de ella.</li>
<li><strong>Conflicto entre dos.</strong> Cabeza y corazon dicen cosas opuestas y la decision se congela.</li>
</ul>

<h2>Ejercicio 1: El comite de direccion interior</h2>
<p>Este ejercicio, basado en Soosalu y adaptado por el IEPP, se puede hacer por escrito, como dialogo mental o (mas potente) con sillas. Vamos a describir la version con sillas porque es la que mas produce.</p>
<ol>
<li><strong>Paso 1. Define el tema.</strong> Concreta sobre que decision necesitas reflexionar. Hazlo en una sola frase clara. "¿Cambio de trabajo o no?" o "¿Termino esta relacion o sigo?".</li>
<li><strong>Paso 2. Imagina a tus tres consultores.</strong> Tu comite interior tiene tres miembros:
<ul>
<li>El consultor analitico-racional. Le encantan los datos y las cuestiones practicas.</li>
<li>El consultor emocional. Defiende lo que quiere tu corazon para sentirse bien.</li>
<li>El consultor intuitivo. Es sabio, autentico, independiente de la opinion ajena. Te conoce muy bien.</li>
</ul>
Dedica un minuto a imaginar como es cada uno. ¿Que aspecto tiene? ¿Que tono de voz? ¿Como se viste? Darles forma ayuda a separar sus voces.
</li>
<li><strong>Paso 3. Coloca tres sillas.</strong> Sientate primero en la del consultor analitico-racional. Desde ahi, habla en voz alta (o escribe) lo que opina sobre tu decision. No describes lo que opina, <em>eres el</em> hablando. Di todo lo que se le ocurriria decir a un analista puro.</li>
<li><strong>Paso 4. Pasa a la silla del consultor emocional.</strong> Repite el proceso. ¿Que siente tu corazon respecto a cada opcion? ¿Que emociones aparecen? ¿Que te apetece y que no?</li>
<li><strong>Paso 5. Pasa a la silla del consultor intuitivo.</strong> Esta silla requiere silencio primero. Respira. Deja que emerja una sensacion corporal. ¿Que parte del cuerpo se activa con cada opcion? ¿Donde hay tension? ¿Donde hay apertura?</li>
<li><strong>Paso 6. Deja reposar.</strong> Una vez recogidos los tres puntos de vista, no decidas inmediatamente. Deja la decision en reposo unas horas, idealmente hasta el dia siguiente. Pero no pases de 24 horas sin volver.</li>
<li><strong>Paso 7. Decide e integra.</strong> Vuelve con los tres inputs frescos. ¿Que quieres hacer ahora? ¿Que conclusion saca el conjunto?</li>
</ol>
<p>La primera vez que alguien hace este ejercicio suele notar que tenia una voz dominante y dos calladas. Saber cual de las tres tiende a silenciarse es una informacion preciosa. Es lo que necesitaras desarrollar en futuras decisiones.</p>

<h2>Ejercicio 2: Decision por fases segun Soosalu</h2>
<p>Para decisiones cotidianas menos estructuradas, Soosalu propone una secuencia corta de tres fases:</p>
<ol>
<li><strong>Fase racional.</strong> Dedica un tiempo delimitado (30 a 60 minutos, no mas) a analizar toda la informacion disponible. Haz un pros y contras real. Incluye datos.</li>
<li><strong>Fase de reposo.</strong> Aparta conscientemente la decision. Ocupa la mente con otra cosa. Duerme, pasea, haz ejercicio. La investigacion sugiere que el procesamiento inconsciente mejora las decisiones complejas.</li>
<li><strong>Fase intuitiva-emocional.</strong> Vuelve a la decision sin repasar de nuevo los argumentos. Pregunta: "¿Que siento al leer cada opcion ahora?". La decision final se toma desde esa sensacion integrada, no volviendo al analisis.</li>
</ol>
<p>Esta secuencia de tres fases es la que, segun Soosalu y colegas, produce decisiones de mayor calidad medida a meses vista.</p>

<h2>Cuando usar cada sistema</h2>
<p>No todas las decisiones requieren los tres sistemas activados al 100%. El arte es saber cual pesa mas en cada caso:</p>
<ul>
<li><strong>Decisiones tecnicas o de bajo impacto emocional:</strong> predomina la cabeza. Que software elegir, que presupuesto aprobar.</li>
<li><strong>Decisiones relacionales:</strong> predomina el corazon, con soporte del analisis. Con quien vivir, quien es amigo de verdad.</li>
<li><strong>Decisiones vitales de largo plazo:</strong> requieren los tres. Cambiar de carrera, tener hijos, mudarse de pais. Aqui no basta ninguno solo.</li>
<li><strong>Decisiones bajo presion de tiempo:</strong> predomina la intuicion. No hay margen para analisis largos.</li>
</ul>

<h2>Aprender a escuchar las tripas</h2>
<p>Para la mayoria, el sistema intuitivo es el mas atrofiado. No se trata de mistificarlo. Es simplemente el resultado de años de experiencia que se almacena en el cuerpo como sensaciones de apertura, cierre, calma o alerta.</p>
<p>Practica escucharlo con decisiones pequeñas. Cuando dudes entre dos restaurantes, en vez de analizar, cierra los ojos y nota donde se activa el cuerpo con cada opcion. Hazlo durante un tiempo sin consecuencias importantes. Asi recuperas el canal.</p>

<h2>Referencias</h2>
<p><em>Soosalu, G., Henwood, S., y Deo, A. (2019). Head, heart, and gut in decision making: Development of a multiple brain preference questionnaire. SAGE Open, 9(1).</em></p>
<p><em>Damasio, A. (1994). Descartes' Error: Emotion, Reason, and the Human Brain. Putnam.</em></p>
<p><em>Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.</em></p>
""",
}

# =============================================================================
# ARTICULO 6: Crecimiento postraumatico
# Categoria: regulacion-emocional (3)
# =============================================================================
ARTICULO_6 = {
    "title": "Crecimiento postraumatico: lo que aprendes cuando todo se rompe",
    "slug": "crecimiento-postraumatico",
    "categories": [3],
    "status": "publish",
    "excerpt": (
        "No todo evento traumatico deja cicatrices. Algunos, con las condiciones adecuadas, "
        "producen crecimiento psicologico profundo. Tedeschi, Calhoun y Park describieron el "
        "fenomeno del crecimiento postraumatico con evidencia solida."
    ),
    "content": """<h2>Cuando el dolor reorganiza la vida</h2>
<p>Hay una frase popular peligrosa: "lo que no te mata te hace mas fuerte". Es peligrosa porque es falsa casi siempre y cruel cuando se dice en medio del sufrimiento. La mayoria de traumas no hacen mas fuerte. Hacen mas pequeño, mas asustado, mas cerrado.</p>
<p>Pero hay una parte real detras de esa frase mal enunciada. Los investigadores <strong>Richard Tedeschi y Lawrence Calhoun</strong> llevan desde los años 90 estudiando el fenomeno que llamaron <em>crecimiento postraumatico</em>. No es la alquimia automatica de convertir el dolor en oro. Es la observacion documentada de que, en determinadas condiciones y despues de mucho tiempo, algunas personas salen del trauma con cambios psicologicos positivos reales.</p>

<h2>Que es exactamente el crecimiento postraumatico</h2>
<p>No confundamos terminos. Tedeschi y Calhoun definen el crecimiento postraumatico como el <strong>cambio psicologico positivo experimentado como resultado de la lucha con circunstancias vitales altamente desafiantes</strong>. Hay tres matices clave en esa definicion:</p>
<ul>
<li>El cambio es <em>resultado de la lucha</em>, no de evitar el trauma. No crecen las personas que niegan, crecen las que atraviesan.</li>
<li>El cambio es <em>positivo</em>, pero no sustituye el dolor. Coexiste con el. Se puede crecer y seguir doliendo.</li>
<li>El cambio es <em>profundo</em>, no superficial. Afecta a la vision del mundo, las relaciones, las prioridades.</li>
</ul>
<blockquote>El crecimiento postraumatico no es un consuelo romantico. Es una observacion cientifica sobre lo que a veces, no siempre, sucede cuando una vida se rompe y vuelve a organizarse.</blockquote>

<h2>Los cinco dominios del crecimiento</h2>
<p>Tedeschi y Calhoun identificaron cinco areas donde aparece el crecimiento, medidas por el <em>Posttraumatic Growth Inventory</em>. No todas aparecen en todas las personas. Muchas solo aparecen tras varios años.</p>
<ol>
<li><strong>Apreciacion de la vida.</strong> No dar por sentado lo cotidiano. Lo que antes pasaba inadvertido se vuelve significativo.</li>
<li><strong>Relaciones mas profundas.</strong> Se descartan las superficiales, se cultivan las autenticas. Se aprende a pedir y recibir ayuda.</li>
<li><strong>Fuerza personal.</strong> "Si he podido con esto, puedo con mas". Una confianza basica en la propia capacidad de sobrevivir.</li>
<li><strong>Nuevas posibilidades.</strong> Caminos de vida que antes no se habian contemplado se abren como opciones.</li>
<li><strong>Cambio espiritual o existencial.</strong> Una reorganizacion del sentido, de lo que importa y lo que no.</li>
</ol>

<h2>Ejercicio 1: Inventario de aprendizajes postevento</h2>
<p>Este ejercicio, adaptado de Park, Cohen y Murch (1996), te permite explorar de forma estructurada que efectos positivos puede haber tenido un evento estresante pasado. <strong>Advertencia:</strong> no hagas el ejercicio si el evento sigue siendo reciente o todavia te desborda emocionalmente. Necesitas distancia.</p>
<ol>
<li>Piensa en un evento estresante de los ultimos años que ya esta cerrado o al menos procesado.</li>
<li>Del siguiente listado, marca solo los items que realmente resuenan contigo. No se trata de negar el impacto negativo, sino de abrir una mirada amplia:
<ul>
<li>Desarrolle nuevas relaciones con personas que me ayudaron</li>
<li>Aprendi que era mas fuerte de lo que pensaba</li>
<li>Me volvi mas tolerante con los demas</li>
<li>Me di cuenta de que tengo mucho que ofrecer a otras personas</li>
<li>Aprendi a respetar los sentimientos y creencias de los demas</li>
<li>Repense como quiero vivir mi vida</li>
<li>Mi vida ahora tiene mas sentido y satisfaccion</li>
<li>Aprendi mejores formas de expresar mis sentimientos</li>
<li>Aprendi a asumir mas responsabilidad por lo que hago</li>
<li>Aprendi a vivir el hoy, porque nunca se sabe lo que pasara mañana</li>
<li>Ya no doy por sentado la mayoria de las cosas</li>
<li>Me siento mas libre para tomar mis propias decisiones</li>
<li>Aprendi a apreciar la fuerza de otras personas que han tenido una vida dificil</li>
<li>Aprendi a pensar mas en las consecuencias de mis acciones</li>
<li>Aprendi a afrontar la vida con mas calma</li>
<li>Aprendi a ser yo mismo y no intentar ser lo que los demas quieren</li>
<li>Aprendi a resolver los problemas y no simplemente a rendirme</li>
<li>Cambie mis objetivos de vida para mejor</li>
<li>Aprendi a acercarme y ayudar a los demas</li>
<li>Aprendi a ser una persona mas segura</li>
<li>Aprendi a no dar por sentada mi salud fisica</li>
<li>Aprendi a comunicarme mas honestamente</li>
<li>Aprendi a lidiar mejor con la incertidumbre</li>
<li>Aprendi que esta bien pedir ayuda</li>
<li>Aprendi a defender mis derechos personales</li>
</ul>
</li>
<li>Escribe dos o tres frases sobre como te sentiste al completar el inventario. ¿Hubo items que te sorprendieron? ¿Alguno te emociono?</li>
</ol>
<p>El valor del ejercicio es ver con claridad que dentro del mismo evento doloroso se cocinaron aprendizajes que hoy son parte de ti. No justifica lo que paso. Lo complementa.</p>

<h2>Ejercicio 2: Carta desde el que soy hoy</h2>
<p>Este ejercicio se puede hacer solo cuando hay distancia emocional suficiente del evento. Te sirve para consolidar el crecimiento y reconocerlo conscientemente.</p>
<ol>
<li>Escribe una carta al tu-yo del momento en que ocurrio el evento traumatico. Dirigida al yo que estaba atravesando el episodio mas duro.</li>
<li>En la carta cuentale quien eres ahora. Que aprendiste. Que sabes que el no sabia. Que capacidades desarrollaste.</li>
<li>Se honesto tambien con lo que perdiste. No escondas el dolor. La carta no es para disfrazar, es para integrar.</li>
<li>Guarda la carta durante una semana. Reletela y ajustala. Fijate que emociones aparecen al leerla.</li>
</ol>
<p>El ejercicio funciona porque articula el arco completo: del que fuiste al que eres, reconociendo lo que ese puente costo.</p>

<h2>Condiciones que facilitan el crecimiento</h2>
<p>El crecimiento postraumatico no es automatico. La investigacion ha identificado factores que lo facilitan:</p>
<ul>
<li><strong>Apoyo social real.</strong> No es suficiente tener gente cerca. Necesitan ser personas capaces de escuchar sin invadir ni apresurar.</li>
<li><strong>Tiempo.</strong> El crecimiento suele aparecer a partir de seis meses o un año del evento, no antes.</li>
<li><strong>Capacidad de reflexion.</strong> Las personas que dan sentido deliberadamente al evento crecen mas que las que lo intentan olvidar.</li>
<li><strong>Flexibilidad cognitiva.</strong> Aceptar que el mundo antes del evento ya no existe y construir uno nuevo, en lugar de intentar recuperar el anterior.</li>
<li><strong>Apoyo profesional cuando hace falta.</strong> Ciertos traumas requieren psicoterapia especializada. No crecer solo es una opcion legitima.</li>
</ul>

<h2>Lo que NO es crecimiento postraumatico</h2>
<p>Para evitar malentendidos dañinos, vale la pena clarificar:</p>
<ul>
<li>No es justificar lo que paso.</li>
<li>No es estar agradecido al trauma.</li>
<li>No es un proceso rapido ni lineal.</li>
<li>No es obligatorio. Hay personas que no crecen despues de un trauma y eso no es un fracaso personal.</li>
<li>No sustituye a la intervencion terapeutica cuando el trastorno de estres postraumatico esta instalado.</li>
</ul>

<h2>Una palabra para quienes estan en medio del dolor</h2>
<p>Si estas leyendo esto desde el centro de un evento reciente, guarda el articulo y vuelve mas adelante. El concepto del crecimiento postraumatico no es para consolarse en caliente. Es para reconocer en frio, con tiempo y con distancia, lo que la vida te enseño cuando te partio.</p>

<h2>Referencias</h2>
<p><em>Tedeschi, R. G., y Calhoun, L. G. (1996). The Posttraumatic Growth Inventory: Measuring the positive legacy of trauma. Journal of Traumatic Stress, 9(3), 455-471.</em></p>
<p><em>Park, C. L., Cohen, L. H., y Murch, R. L. (1996). Assessment and prediction of stress-related growth. Journal of Personality, 64(1), 71-105.</em></p>
<p><em>Calhoun, L. G., y Tedeschi, R. G. (2006). Handbook of posttraumatic growth: Research and practice. Lawrence Erlbaum Associates.</em></p>
""",
}

# =============================================================================
# ARTICULO 7: Diario de gratitud (variantes avanzadas)
# Categoria: psicologia-cotidiana (8)
# =============================================================================
ARTICULO_7 = {
    "title": "Diario de gratitud: lo que hacen mal el 90% de las personas que lo intentan",
    "slug": "diario-de-gratitud-variantes",
    "categories": [8],
    "status": "publish",
    "excerpt": (
        "El diario de gratitud es el ejercicio mas estudiado de la psicologia positiva. "
        "Tambien el mas mal practicado. Emmons, Seligman y Lyubomirsky tienen protocolos "
        "concretos que explican por que a muchos no les funciona."
    ),
    "content": """<h2>El ejercicio que todos conocen y casi nadie domina</h2>
<p>Preguntale a cualquier persona si ha oido hablar del diario de gratitud. Te dira que si. Preguntale si lo ha probado. Te dira que si o que lo intento unos dias. Preguntale si le funciono. Ahi es donde aparecen las dudas.</p>
<p>El diario de gratitud es probablemente el <strong>ejercicio mas investigado de la psicologia positiva</strong>. Los metaanalisis son robustos: incrementa el bienestar subjetivo, reduce sintomas depresivos, mejora la calidad del sueño. Y sin embargo, la mayoria de las personas que lo prueban lo abandonan.</p>
<p>La razon no es que el ejercicio no sirva. Es que se hace mal.</p>

<h2>Las tres variantes que respaldan los estudios</h2>
<p>No existe un unico diario de gratitud. Hay al menos tres formulas bien investigadas, cada una con un objetivo diferente. Elegir la que te corresponde es la primera decision.</p>

<h3>La variante de Emmons y McCullough (2003)</h3>
<p>La formulacion clasica. "Apunta cinco cosas por las que te sientes agradecido". Es amplia y abierta. Permite recoger desde aspectos grandes (tu salud) hasta minimos (el cafe de la mañana). Su fuerza es que no te exige esfuerzo intelectual, solo atencion. Su debilidad es que se vuelve repetitiva si no pones cuidado.</p>

<h3>La variante de Seligman (2011): tres cosas buenas</h3>
<p>Seligman afino la tecnica. En lugar de cinco elementos, pide tres. Y añade una pregunta clave: <strong>¿por que salio bien?</strong> Esa segunda parte obliga a analizar causalidad, no solo a enumerar. Es la variante que mayor efecto sostiene a largo plazo, segun los estudios de Seligman, Steen, Park y Peterson (2005). Las personas que la practicaron mantuvieron mejoras de felicidad medibles hasta seis meses despues.</p>

<h3>La variante de Lyubomirsky (2008)</h3>
<p>Lyubomirsky investigo la frecuencia optima. Descubrio que hacer el ejercicio diariamente lo <strong>desgasta</strong>. La atencion se vuelve mecanica y el efecto desaparece. Propuso hacerlo <strong>una o dos veces por semana</strong>, especialmente los jueves y domingos. Y ampliar el foco: "piensa en la semana y apunta cinco cosas por las que te sientes agradecido".</p>

<blockquote>Hacer el diario todos los dias durante años no es perseverancia. Es una forma segura de matarlo.</blockquote>

<h2>Los cinco errores mas comunes</h2>
<p>Cuando alguien se queja de que el diario no le funciona, casi siempre es por uno de estos motivos:</p>
<ul>
<li><strong>Frecuencia excesiva.</strong> Diario, todos los dias, durante meses. El cerebro automatiza la respuesta.</li>
<li><strong>Superficialidad.</strong> "Estoy agradecido por mi familia" repetido 40 veces. Sin especificar nada concreto.</li>
<li><strong>Ausencia de causalidad.</strong> Enumerar sin preguntar por que. El insight aparece al analizar el por que.</li>
<li><strong>Mecanizacion.</strong> Lo haces por obligacion antes de dormir en dos minutos. Sin presencia.</li>
<li><strong>Ignorar las emociones.</strong> Solo apuntar los hechos sin conectar con como te hicieron sentir.</li>
</ul>

<h2>Ejercicio 1: Diario de gratitud con diferenciacion emocional</h2>
<p>Esta variante, propuesta por el IEPP a partir del trabajo de Fredrickson, corrige el problema de la superficialidad. No solo registra el motivo de gratitud, sino tambien las emociones agradables asociadas. Amplia el vocabulario emocional.</p>
<p>Protocolo para una entrada:</p>
<ol>
<li>Describe con detalle concreto un momento apreciado. No "mi pareja", sino "cuando mi pareja me trajo un cafe a la cama sin que yo se lo pidiera".</li>
<li>Pregunta: ¿<strong>por que</strong> salio bien ese momento? ¿Que condiciones lo hicieron posible?</li>
<li>Identifica las emociones que sentiste, <em>mas alla de la gratitud</em>. Por ejemplo: conexion, alivio, compañerismo, ternura, orgullo, admiracion.</li>
<li>Describe en una frase el impacto que tuvo en el resto del dia.</li>
</ol>
<p>Ejemplo desarrollado:</p>
<blockquote>Hoy Maria me trajo cafe a la cama sin pedirlo. Salio bien porque ultimamente ha visto que me cuesta arrancar las mañanas. Ademas de gratitud senti conexion, alivio y ternura. Me dio energia para arrancar el dia con mas animo.</blockquote>

<h2>Ejercicio 2: Eleccion consciente de motivacion</h2>
<p>Este ejercicio, inspirado en Lyubomirsky, resuelve el problema del diario que se mecaniza. Antes de empezar a practicar, eliges conscientemente cual de estas motivaciones <strong>te resuena mas</strong> a ti. La motivacion explicita sostiene la practica.</p>
<p>Lee cada frase y marca las que sientas verdaderas hoy:</p>
<ul>
<li>Practicar la gratitud me ayudara a darme cuenta de todo lo bueno que hay en mi vida</li>
<li>Me dara perspectiva: me sacara de las espirales de pensamientos negativos sobredimensionados</li>
<li>Creara un espacio para apreciar y revivir los momentos positivos sin darlos por sentado</li>
<li>Me ayudara a ser mas justo, apreciando que hay muchas cosas que funcionan en mi vida a pesar de lo que no me gusta</li>
<li>Me recordara los buenos momentos del dia con una sonrisa</li>
<li>Afinara mi percepcion y me entrenara a detectar cosas positivas que suelen pasar desapercibidas</li>
<li>Me permitira crear un repositorio de recuerdos bonitos al que puedo volver</li>
<li>Es una actitud positiva ante la vida que me apetece cultivar</li>
<li>Me hara sentir bien en el momento mismo de practicarla</li>
<li>Es una fortaleza que valoro y quiero usar de forma estrategica en mi vida</li>
</ul>
<p>Las motivaciones que hayas marcado son las que debes <strong>escribir al principio de tu cuaderno</strong>. Cuando la practica se debilite, vuelve a esa pagina. Releerlo reconecta con el porque.</p>

<h2>Cuando y cuanto</h2>
<p>Resumiendo lo que dice la evidencia:</p>
<ul>
<li>Al inicio, durante dos semanas: <strong>diario</strong>, para crear el habito de atencion.</li>
<li>Despues: <strong>dos veces por semana</strong>, idealmente jueves y domingo.</li>
<li>Cada entrada: <strong>5 a 10 minutos</strong> de atencion real. No mas, no menos.</li>
<li>Si lo haces de pareja, familia o equipo: hacerlo en voz alta una vez a la semana potencia el efecto (Seligman lo estudio en familias).</li>
<li>Con niños: en la cena o al acostarlos, hablar de los tres momentos favoritos del dia. Funciona a partir de tres años.</li>
</ul>

<h2>El diario como deteccion de cambios internos</h2>
<p>Una utilidad menos obvia del diario es que sirve como instrumento de medicion. Cuando una persona empieza a sentirse mal anímicamente, lo primero que suele cambiar es el tipo de entradas: se vuelven mas genericas, mas superficiales, aparece dificultad para completar cinco items, aparecen quejas disfrazadas.</p>
<p>Mirar tu propio diario hacia atras te da datos sobre periodos emocionales que de otra forma pasarian inadvertidos. Es un espejo discreto pero honesto.</p>

<h2>Una advertencia final</h2>
<p>La gratitud no es una herramienta para negar los problemas. Si usas el diario para no mirar un trabajo que te mata, una relacion que te apaga o un cuerpo que te avisa, no estas practicando gratitud. Estas usando una tecnica de distraccion. La gratitud funciona porque complementa la mirada critica, no porque la sustituya.</p>

<h2>Referencias</h2>
<p><em>Emmons, R. A., y McCullough, M. E. (2003). Counting blessings versus burdens: An experimental investigation of gratitude and subjective well-being in daily life. Journal of Personality and Social Psychology, 84(2), 377-389.</em></p>
<p><em>Seligman, M. E. P., Steen, T. A., Park, N., y Peterson, C. (2005). Positive psychology progress: Empirical validation of interventions. American Psychologist, 60(5), 410-421.</em></p>
<p><em>Lyubomirsky, S. (2008). The How of Happiness: A Scientific Approach to Getting the Life You Want. Penguin Press.</em></p>
""",
}

# =============================================================================
# ARTICULO 8: Paradoja de la eleccion
# Categoria: desmitificacion (7)
# =============================================================================
ARTICULO_8 = {
    "title": "La paradoja de la eleccion: por que tener mas opciones te hace mas infeliz",
    "slug": "paradoja-de-la-eleccion",
    "categories": [7],
    "status": "publish",
    "excerpt": (
        "Barry Schwartz demostro que multiplicar las opciones no multiplica el bienestar: lo reduce. "
        "Y Nardone añadio que buscar la decision perfecta genera duda patologica. "
        "Estrategias concretas para decidir mejor con menos sufrimiento."
    ),
    "content": """<h2>El siglo de la libertad que aprieta</h2>
<p>La narrativa occidental del ultimo medio siglo ha sido clara: mas opciones es mejor. Mas marcas de yogur, mas apps de citas, mas carreras posibles, mas destinos de vacaciones, mas formas de vivir. Tener donde elegir es, segun el sentido comun, la condicion basica de la libertad.</p>
<p>El psicologo <strong>Barry Schwartz</strong> puso ese sentido comun bajo sospecha. En su libro <em>The Paradox of Choice</em> (2004), recopilo decadas de investigacion en economia y psicologia para mostrar que, <strong>a partir de cierto punto, añadir opciones reduce el bienestar</strong>. No es una cuestion de gustos. Es un efecto medible.</p>
<blockquote>No es que no quieras tener opciones. Es que tener demasiadas te hace peor decidir, te hace menos feliz con lo que elijes y te hace dudar mas tiempo.</blockquote>

<h2>Los cuatro efectos documentados</h2>
<p>Schwartz y su equipo identificaron cuatro consecuencias del exceso de opciones:</p>
<ul>
<li><strong>Paralisis.</strong> Cuanto mas largo es el menu, mas probable es que no decidas nada. En el supermercado, las estanterias con treinta mermeladas venden menos que las que tienen seis.</li>
<li><strong>Disminucion de la satisfaccion.</strong> Tras decidir, la sombra de las opciones descartadas crece. "¿Y si hubiera elegido la otra?" pesa mas cuanto mas se dejo atras.</li>
<li><strong>Aumento de las expectativas.</strong> Con tantas opciones, esperas la decision perfecta. Esa expectativa casi nunca se cumple.</li>
<li><strong>Autoculpa.</strong> Si habia tantas opciones disponibles y no elegi la mejor, es culpa mia. La falta de resultados se atribuye a incompetencia personal, no a las condiciones.</li>
</ul>

<h2>Los dos perfiles: maximizadores y satisficers</h2>
<p>La contribucion mas util de Schwartz es la distincion entre dos perfiles de decisor:</p>
<ul>
<li><strong>Maximizadores.</strong> Quieren la mejor opcion posible. Comparan, analizan, investigan. No se conforman con "suficiente" si hay posibilidad de algo superior. Parecen rigurosos.</li>
<li><strong>Satisficers.</strong> Buscan lo suficientemente bueno. Tienen criterios claros y, una vez una opcion los cumple, eligen. No siguen buscando si ya tienen algo que funciona.</li>
</ul>
<p>La investigacion de Schwartz y colegas (2002) arroja un resultado contraintuitivo: los <strong>maximizadores son sistematicamente menos felices con sus decisiones</strong>. Mas arrepentimiento, mas comparacion social, mas sintomas depresivos. Aunque objetivamente sus decisiones suelen ser mejores (consiguen sueldos mas altos, mejores descuentos), subjetivamente sufren mas.</p>
<p>El satisficer no es vago ni conformista. Es alguien que ha entendido que <strong>la calidad de una decision tambien incluye el coste psicologico de tomarla</strong>.</p>

<h2>La duda patologica de Nardone</h2>
<p>Paralelamente a Schwartz, el terapeuta italiano <strong>Giorgio Nardone</strong> describio desde la clinica el fenomeno de la <em>duda patologica</em>. Es el estado en el que una persona no puede dejar de preguntarse "¿y si...?" sobre una decision pasada o futura. Cada pregunta parece legitima. El problema es que las preguntas no se acaban.</p>
<p>La dinamica es circular: dudo, me hago una pregunta, me la contesto, aparece otra pregunta, me la contesto, aparece otra. Y asi durante horas, dias, meses. Nardone señala que contestar la pregunta no resuelve la duda. La alimenta.</p>
<p>Su propuesta terapeutica es <strong>interrumpir el ciclo bloqueando la respuesta</strong>. Si no respondes la pregunta, la pregunta pierde fuerza. Parece contraintuitivo pero es efectivo.</p>

<h2>Ejercicio 1: La regla del "suficientemente bueno"</h2>
<p>Este ejercicio te entrena a decidir como un satisficer para decisiones cotidianas de bajo y medio impacto.</p>
<ol>
<li>Eligue una categoria de decision donde sueles perder tiempo: restaurantes, compra online, series, rutas de viaje.</li>
<li>Antes de empezar a elegir, define <strong>tres criterios explicitos</strong> que la opcion debe cumplir. Ni mas ni menos. Escribelos.</li>
<li>Empieza a revisar opciones. La primera que cumpla los tres criterios, la tomas. <strong>No sigues mirando para ver si hay algo mejor.</strong></li>
<li>Despues de decidir, no releas otras opciones. No compares. No entres a foros.</li>
<li>Durante dos semanas, lleva este metodo en al menos una decision diaria pequeña.</li>
</ol>
<p>Al principio se siente extraño. Despues liberador. La mente deja de estar rumiando mientras comes, duermes o trabajas.</p>

<h2>Ejercicio 2: Bloqueo de la pregunta recursiva</h2>
<p>Este es el ejercicio inspirado en Nardone para salir de la rumiacion tras una decision importante ya tomada.</p>
<ol>
<li>Identifica la pregunta que te esta torturando. Ejemplo: "¿Hice bien en aceptar este trabajo?".</li>
<li>Reconoce que cada vez que te la contestas, <strong>volvera a aparecer bajo otra forma</strong>. "¿Y si hubiera esperado?", "¿Y si el otro trabajo era mejor?", "¿Y si me arrepiento dentro de un año?".</li>
<li>La regla: <strong>no contestes</strong>. Cuando aparezca la pregunta, nombrala mentalmente ("otra vez la pregunta") y no la respondas. No argumentes. No justifiques. No te defiendas ante ti mismo.</li>
<li>Redirige la atencion a una accion concreta del dia. No a otra pregunta, a una accion.</li>
<li>Al principio la pregunta volvera muchas veces. Con la practica, pierde fuerza en uno o dos semanas.</li>
</ol>
<p>Nardone llama a este proceso <em>bloquear la respuesta para inhibir la pregunta</em>. La idea es que el cerebro produce preguntas cuando detecta que le contestamos. Si dejamos de contestar, deja de producir.</p>

<h2>Cuando si importa maximizar</h2>
<p>No todas las decisiones se benefician del satisficing. Hay casos en los que maximizar es apropiado:</p>
<ul>
<li>Decisiones irreversibles de alto impacto (comprar una vivienda, una intervencion medica seria)</li>
<li>Decisiones profesionales cruciales con pocos puntos de entrada</li>
<li>Elecciones que afectan a personas a tu cargo</li>
</ul>
<p>En el resto de decisiones cotidianas (desde la marca de cafe hasta el restaurante de la cena), satisficing es casi siempre la estrategia superior. No porque sea mas rapida, sino porque <strong>el coste mental de maximizar excede los beneficios objetivos</strong>.</p>

<h2>Reducir el menu propio</h2>
<p>Schwartz propone una estrategia estructural: <strong>reducir conscientemente el numero de opciones que consideras</strong>. En la practica esto significa:</p>
<ul>
<li>No comparar mas de tres alternativas para la misma decision</li>
<li>Dejar de leer comparativas, foros y reseñas cuando tienes una opcion que te encaja</li>
<li>Desuscribirte de newsletters que te inundan de posibilidades (ofertas, viajes, tecnologia)</li>
<li>Limitar el tiempo dedicado a cada tipo de decision de antemano</li>
</ul>
<p>Tener menos opciones disponibles no te empobrece. Te ahorra energia mental para gastarla en cosas que importan mas.</p>

<h2>El coste oculto de la libertad infinita</h2>
<p>La promesa cultural de nuestro tiempo es que puedes ser quien quieras, vivir donde quieras, trabajar en lo que quieras, amar a quien quieras. Es una promesa hermosa pero parcialmente mentirosa. Lo que oculta es que gestionar tantas posibilidades tiene un coste psicologico real.</p>
<p>Ser consciente de ese coste no es pesimismo. Es realismo. La libertad autentica, segun Schwartz, no consiste en tener infinitas opciones sino en <strong>saber cerrar la puerta a muchas para poder habitar bien la que eliges</strong>.</p>

<h2>Referencias</h2>
<p><em>Schwartz, B. (2004). The Paradox of Choice: Why More Is Less. Harper Perennial.</em></p>
<p><em>Schwartz, B., Ward, A., Monterosso, J., Lyubomirsky, S., White, K., y Lehman, D. R. (2002). Maximizing versus satisficing: Happiness is a matter of choice. Journal of Personality and Social Psychology, 83(5), 1178-1197.</em></p>
<p><em>Nardone, G., y Watzlawick, P. (1993). The Art of Change: Strategic Therapy and Hypnotherapy Without Trance. Jossey-Bass.</em></p>
""",
}


ARTICULOS = [
    ARTICULO_1,
    ARTICULO_2,
    ARTICULO_3,
    ARTICULO_4,
    ARTICULO_5,
    ARTICULO_6,
    ARTICULO_7,
    ARTICULO_8,
]


def contar_palabras(html):
    # Recuento aproximado de palabras sobre el texto HTML (ignorando las etiquetas)
    import re

    texto = re.sub(r"<[^>]+>", " ", html)
    return len([w for w in texto.split() if w.strip()])


def main():
    resultados = []
    for i, art in enumerate(ARTICULOS, start=1):
        palabras = contar_palabras(art["content"])
        print(
            f"\n[{i}/{len(ARTICULOS)}] Publicando: {art['title']}  ({palabras} palabras)"
        )
        try:
            result = wp_post("posts", art)
            resultados.append(
                {
                    "id": result["id"],
                    "title": art["title"],
                    "slug": art["slug"],
                    "url": result.get("link", ""),
                    "categories": art["categories"],
                    "palabras": palabras,
                }
            )
            print(f"OK: {result['id']} - {result.get('link', '')}")
        except Exception as e:
            print(f"ERROR: {e}")
            resultados.append(
                {
                    "id": None,
                    "title": art["title"],
                    "slug": art["slug"],
                    "error": str(e),
                    "categories": art["categories"],
                    "palabras": palabras,
                }
            )

    print("\n" + "=" * 70)
    print("RESUMEN DE PUBLICACIONES")
    print("=" * 70)
    for r in resultados:
        if r.get("id"):
            print(
                f"  [{r['id']:3}] cat={r['categories']} pal={r['palabras']:4}  {r['url']}"
            )
        else:
            print(f"  [ERR]  cat={r['categories']} pal={r['palabras']:4}  {r['title']}")
            print(f"         error: {r.get('error')}")


if __name__ == "__main__":
    main()
