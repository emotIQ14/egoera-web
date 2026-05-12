import type { Metadata } from "next";
import { ArticleV6 } from "@/components/article/ArticleV6";
import { prepareArticleHtml } from "@/components/article/article-v6-transform";

/**
 * /blog/preview-v6
 * ----------------------------------------------------------------------
 * Página de muestra estática que renderiza un artículo de ejemplo con
 * todos los bloques de <ArticleV6>: hero, TOC sticky, body Fraunces
 * con drop-cap, callouts (note/quote/exercise), pull-quote, sello de
 * pasos numerados (01/02/03), y cierre "si te ha llegado".
 *
 * El contenido es editorial inventado para validar la estética sin
 * tocar todavía el flujo real /blog/[slug]. Texto en castellano, voz
 * Egoera (anti-imperativo, anti-listicle, narrativa).
 * ----------------------------------------------------------------------
 */

export const metadata: Metadata = {
  title: "Preview · ArticleV6",
  description:
    "Vista previa del componente ArticleV6, sucesor editorial de la plantilla V5 del cuaderno de Egoera.",
  robots: { index: false, follow: false },
};

const SAMPLE_HTML = `
<p>Hay una voz que no se calla. La oíste primero en la cocina de tu casa, cuando tenías nueve años y se te cayó el vaso, y desde entonces no se ha ido. La llamamos <em>crítico interno</em> porque hace lo que hacen los críticos: mide, compara, sentencia. La diferencia es que vive dentro, no firma, y a veces nos confunde su voz con la nuestra.</p>

<p>Este cuaderno no va a callarla. Va a invitarla a sentarse en otra silla. Que siga ahí, sí, pero que no presida la mesa. Para eso, cuatro pasos: <em>reconocer, separar, contestar, integrar</em>. No son una receta. Son un orden, una cadencia, un modo de mirar.</p>

<h2>01 · Reconocer la voz cuando aparece</h2>

<p>La primera vez que alguien te dice «esa frase no es tuya, es de tu padre», cuesta verla. Cuesta porque suena tan natural como tu propia respiración. Lleva décadas dictándote: lo que está bien, lo que está mal, lo que <em>deberías</em> estar haciendo en lugar de leer esto.</p>

<aside class="callout-note">
<p>Una señal fiable: cuando aparece el «debería», casi siempre habla el crítico. Cuando aparece el «me gustaría», habla otra parte de ti, más antigua y menos ruidosa.</p>
</aside>

<p>Reconocer no es vigilar. No vamos a montar una <em>policía interna</em> al lado de la otra policía interna: eso sería duplicar el problema. Reconocer es solo notar. «Ah, mira, ahí está». Como quien ve pasar un autobús conocido. Saber que existe, saber su ruta, saber a qué hora suele aparecer.</p>

<aside class="callout-quote">
<p>El crítico tiene siempre razón sobre los hechos y casi nunca sobre lo que esos hechos significan.</p>
<cite>cuaderno · página dos</cite>
</aside>

<h2>02 · Separar su voz de la tuya</h2>

<p>La trampa más eficaz del crítico es presentarse como tú. Habla en primera persona del singular: «soy un desastre», «no valgo para esto», «todo el mundo lo hace mejor que yo». Y suena íntimo, suena propio, suena verdad.</p>

<p>Sepáralo. Ponle nombre. Algunos pacientes le ponen el nombre de un familiar, otros le llaman simplemente «el juez». No importa cuál: importa que tenga uno distinto del tuyo, para que cuando aparezca, puedas decir «ah, hola, otra vez por aquí» en lugar de tomarte cada frase como tuya.</p>

<aside class="pullquote">
<p>No tienes que pelearte con el crítico. <em>Solo</em> tienes que dejar de confundirlo contigo.</p>
</aside>

<p>Cuando lo nombras, ocurre algo curioso. Sus argumentos siguen sonando, pero pierden gravedad. Antes pesaban como si los firmara un tribunal. Ahora pesan como una opinión más, una entre las muchas que pasan por tu cabeza un martes a las tres de la tarde.</p>

<h2>03 · Contestarle sin caer en su juego</h2>

<p>Aquí está la tentación: discutir. Demostrarle, con datos, que se equivoca. «No soy un desastre, mira mis logros». «Sí valgo para esto, tengo pruebas». El problema es que el crítico no juega ese partido: cada vez que entras a defenderte, le estás concediendo que tenía derecho a juzgarte.</p>

<aside class="callout-exercise">
<h4>Cinco frases que no son discutir</h4>
<p>Cuando aparezca, prueba con una de estas. No las escribas en un papel: dícelas, por dentro, despacio. <em>«Gracias por avisar».</em> <em>«Esto ya lo hemos hablado».</em> <em>«No vamos por ahí hoy».</em> <em>«Puede que tengas razón, y aun así sigo».</em> <em>«Estoy escuchando otra parte».</em></p>
<p>El objetivo no es ganarle. Es no entrar. Cinco días seguidos con una sola de estas frases y vas a notar el cambio.</p>
</aside>

<p>Lo que estás haciendo cuando contestas así es retirar el escenario. El crítico necesita público para funcionar. Si no se lo das, baja el volumen por sí solo. No desaparece, pero deja de presidir.</p>

<blockquote>
<p>Una vida no se mejora venciendo al crítico. Se mejora <em>dejando de creérselo</em> tanto.</p>
<cite>nota al margen</cite>
</blockquote>

<h2>04 · Integrarlo en una vida más grande</h2>

<p>Al final, el crítico interno no es un enemigo. Es una parte tuya que aprendió, hace muchos años, que la única manera de protegerte era anticipar el daño. Le pidieron que vigilara, y lleva décadas vigilando. Pedirle que se calle del todo sería pedirle que abandone su puesto.</p>

<p>Lo que sí se puede hacer es <em>recolocarlo</em>. Que siga ahí, pero como una voz más, no como la única. Que vigile lo importante (no firmar contratos sin leerlos, no decir «sí» a algo que te va a quemar), pero que se calle en lo cotidiano: cómo te peinas, cuántas calorías tiene tu desayuno, si te has reído demasiado fuerte en aquella cena.</p>

<p>Esa es la integración: una voz entre muchas, no la dueña del foro. Y cuando ocurre — porque ocurre — vas a notar que la cabeza se vacía un poco. No del todo, nunca del todo, pero sí lo suficiente como para que quepa, dentro, una respiración entera.</p>

<aside class="callout-note">
<p>Si llevas semanas en este trabajo y te das cuenta de que la voz no afloja, es señal de que merece la pena hablarlo con alguien. No por urgencia clínica: por compañía. Hay procesos que se hacen mejor con dos sillas.</p>
</aside>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto tarda en notarse el cambio?</h3>
<p>Días, no meses. Lo que tarda meses es que el cambio se sostenga. Las primeras semanas vas a tener recaídas claras: la voz vuelve con fuerza, te crees sus frases otra vez. Es parte del proceso.</p>

<h3>¿Hay que escribirlo todo en un diario?</h3>
<p>No necesariamente. Algunas personas lo notan más si lo escriben; otras, si lo hablan en voz baja consigo mismas mientras caminan. Lo importante es darle un lugar distinto del tuyo, sea cual sea el formato.</p>
`;

export default function PreviewV6Page() {
  const { html, toc } = prepareArticleHtml(SAMPLE_HTML);

  return (
    <ArticleV6
      kicker="Egoera · Crítico interno"
      title="El crítico interno · cuatro pasos para bajarle la *voz*"
      subtitle="No se trata de callarlo, ni de pelearse con él. Se trata de reconocerlo, separarlo, contestarle sin entrar al juego y, al final, dejar de creérselo tanto."
      author="Ander Bilbao Castejón"
      date="11 mayo 2026"
      readTime="9 min"
      category="Autoconocimiento"
      categorySlug="autoconocimiento"
      slug="preview-v6"
      editionLabel="n.º 042"
      toc={toc}
      bodyHtml={html}
      steps={{
        title: "Cuatro movimientos · una *cadencia*",
        intro:
          "Los pasos de arriba, en forma de mapa. Para volver cuando la voz aparezca esta semana.",
        items: [
          {
            title: "Reconocer la voz cuando aparece",
            body: "Notar el «debería», nombrar el patrón, no entrar a discutir todavía. Solo darse cuenta de que está ahí.",
          },
          {
            title: "Separar su voz de la tuya",
            body: "Ponerle un nombre distinto del tuyo. Pasar de «soy un desastre» a «el juez dice que soy un desastre». La distancia cambia el peso.",
          },
          {
            title: "Contestarle sin caer en su juego",
            body: "Cinco frases que no son discutir. Retirar el escenario. El crítico necesita público; si no se lo das, baja el volumen solo.",
          },
          {
            title: "Integrarlo en una vida más grande",
            body: "No echarlo: recolocarlo. Una voz entre muchas, no la dueña del foro. Vigila lo importante, se calla en lo cotidiano.",
          },
        ],
      }}
      nextSuggestion={{
        href: "/blog/comunicacion-no-violenta-4-pasos",
        category: "Relaciones",
        title: "Comunicación no violenta · cuatro *pasos*",
        subtitle:
          "El mismo gesto, hacia afuera: observar, sentir, necesitar, pedir.",
      }}
    />
  );
}
