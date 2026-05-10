import type { Metadata } from "next";
import Link from "next/link";
import styles from "./manifiesto.module.css";

/* -------------------------------------------------------------------------
 * NOTA: el layout raiz de la app (src/app/layout.tsx) ya monta <DarkNav/>
 * y <DarkFooter/>. No volvemos a renderizarlos aqui para evitar duplicados.
 *
 * El brief mencionaba un futuro <EgoeraNav active="manifiesto" /> en
 * @/components/egoera/EgoeraNav que aun no existe en el repo (no esta
 * creado por el otro agente todavia). Cuando exista, el plan natural seria
 * eliminar <DarkNav/> de layout.tsx y mover EgoeraNav alli, sin tocar este
 * fichero. Mientras tanto la pagina vive bajo el header existente y el
 * .page tiene un padding-top de 96px para compensarlo.
 * ------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Manifiesto · Egoera",
  description:
    "El manifiesto editorial de Egoera: por qué escribimos despacio, sin listicles, sin atajos. Psicología en formato editorial por Ander Bilbao Castejón.",
  alternates: { canonical: "/manifiesto" },
  openGraph: {
    title: "Manifiesto · Egoera",
    description:
      "Por qué Egoera existe: leer despacio, dudar en serio y huir del clickbait. Una carta abierta de Ander Bilbao Castejón.",
    type: "article",
    url: "/manifiesto",
    locale: "es_ES",
    siteName: "Egoera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manifiesto · Egoera",
    description:
      "Por qué Egoera existe: leer despacio, dudar en serio y huir del clickbait.",
  },
};

export default function ManifiestoPage() {
  return (
    <article className={styles.page}>
      {/* ============================================================ MASTHEAD */}
      <section className={styles.mast}>
        <div className={styles.wrap}>
          <div className={styles.mastRow}>
            <span>manifiesto · n.º 01</span>
            <span>egoera · 2026</span>
            <span>texto · 4 min</span>
          </div>
          <h1 className={styles.mastTitle}>
            por qué <em>existe</em>
            <br />
            egoera
          </h1>
          <div className={styles.mastSub}>
            <p className={styles.lede}>
              No hace falta leerlo. Pero si te quedas, sabrás de qué va este
              sitio antes de invertir tiempo en él.
            </p>
            <div className={styles.meta}>
              <span>
                autor · <strong>ander bilbao castejón</strong>
              </span>
              <span>
                publicado · <strong>marzo 2026</strong>
              </span>
              <span>
                actualizado ·{" "}
                <strong>cada vez que cambio de opinión</strong>
              </span>
              <span>
                reproducible · <strong>cita la fuente</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== CARTA */}
      <section className={styles.letter}>
        <div className={styles.letterWrap}>
          <aside className={styles.letterMargin} aria-hidden="true">
            <div className={styles.pin}>
              <span className={styles.pinWho}>capítulo i</span>
              <span className={styles.pinWhat}>
                la contradicción que abrió la puerta
              </span>
            </div>
            <div className={styles.pin}>
              <span className={styles.pinWho}>capítulo ii</span>
              <span className={styles.pinWhat}>
                por qué leer despacio importa
              </span>
            </div>
            <div className={styles.pin}>
              <span className={styles.pinWho}>capítulo iii</span>
              <span className={styles.pinWhat}>
                lo que <em>no</em> es egoera
              </span>
            </div>
          </aside>

          <div className={styles.letterBody}>
            <article className={styles.chapter}>
              <span className={styles.chTag}>
                capítulo 01 — la contradicción
              </span>
              <h2 className={styles.chHeadline}>
                en consulta tengo el lujo del <em>tiempo</em>
              </h2>
              <p>
                Egoera nació de una contradicción que llevaba años
                incomodándome. En consulta, todo el mundo entiende que un
                proceso lleva su tiempo: que no se cura una ansiedad de doce
                años en una sesión, que un duelo no se acelera, que el cuerpo
                tarda lo que tarda. Y al salir a la calle, mi profesión se
                reduce a píldoras de tres minutos, listas de diez trucos y
                reels que te explican el apego en quince segundos.
              </p>
              <p>Algo no encajaba. Y como no encajaba, abrí esto.</p>

              <div className={styles.marginalia}>
                <span className={styles.marginaliaLabel}>nota al margen</span>
                No tengo nada en contra de los reels. Algunos están muy bien
                hechos. El problema no es el formato, es pensar que ese
                formato es <em>suficiente</em>.
              </div>

              <p>
                Egoera es lo contrario de un reel. Es un sitio para leer
                despacio. Para volver a la misma frase tres veces. Para cerrar
                la pestaña a media lectura porque te ha tocado algo y
                necesitas un rato. Está hecho para que tardes en consumirlo,
                no para que te enganches.
              </p>
            </article>

            <span className={styles.pull}>
              aquí no se mide nada en clicks. se mide en silencios.
            </span>

            <article className={styles.chapter}>
              <span className={styles.chTag}>
                capítulo 02 — la decisión
              </span>
              <h2 className={styles.chHeadline}>
                no hay <strong>10 trucos</strong> para nada
              </h2>
              <p>
                Cuando empecé a escribir Egoera me hice una promesa: nada de
                clickbait, nada de listas redondas, nada de pirámides
                invertidas que convierten un dolor en producto. La promesa se
                mantiene. Si lees una entrega y al final no tienes una
                respuesta clara, probablemente sea porque la pregunta tampoco
                la tenía.
              </p>
              <p>
                La psicología seria — la que de verdad sostiene procesos
                largos — vive en la duda. En el quizá. En el «depende de cómo
                lo mires». Eso es lo que intento traer aquí: no certezas
                envasadas, sino formas de mirar.
              </p>
              <p>
                A veces eso significa una entrada de quince minutos sobre una
                sola emoción. A veces, una carta corta que se queda contigo
                durante el lunes. A veces, simplemente, un texto que te hace
                decir «vale, no soy <em>sólo</em> yo el que se siente así».
              </p>
            </article>

            <article className={styles.chapter}>
              <span className={styles.chTag}>
                capítulo 03 — los límites
              </span>
              <h2 className={styles.chHeadline}>
                esto <em>no</em> es
              </h2>
              <p>
                Egoera no es terapia. Leer no cura. Por mucho que un texto te
                toque, no sustituye una relación terapéutica — esa que pasa
                entre dos personas, en una sala, durante meses. Si lo que
                sientes pesa de verdad, este sitio no es suficiente. Y yo
                prefiero decírtelo aquí, en la página de manifiesto, antes
                que después de que hayas leído cuarenta entradas creyendo que
                con eso bastaba.
              </p>
              <p>
                Egoera tampoco es marca personal. No vas a encontrar mi cara
                en cada esquina, ni un tono que vende, ni un embudo. Si
                quieres saber quién soy, hay una página dedicada — pero no es
                la entrada principal por una razón.
              </p>
              <p>
                Egoera no es gratis del todo, pero casi. Todo lo público —
                vlog, biblioteca, archivo, boletín — es accesible sin pagar
                nada y sin dar email obligatorio. Lo único que cuesta dinero
                es la consulta privada, porque ahí cambia el contrato: ya no
                eres lectora, eres paciente, y eso requiere un compromiso que
                sólo se sostiene con tarifa.
              </p>
            </article>

            <span className={styles.pull}>
              si no necesitas más, mejor. sigue leyendo y ya está.
            </span>

            <article className={styles.chapter}>
              <span className={styles.chTag}>
                capítulo 04 — la invitación
              </span>
              <h2 className={styles.chHeadline}>
                léelo a tu <em>ritmo</em>
              </h2>
              <p>
                No tengo ningún interés en que pases mucho tiempo aquí. Tengo
                interés en que, cuando estés, estés bien. Que algún texto te
                dé una idea, un nombre, una forma de mirar lo que llevas
                dentro. Y que el resto del tiempo lo pases viviendo, no
                leyendo sobre la vida.
              </p>
              <p>
                Si en algún momento esto se convierte en algo distinto a lo
                que prometí — si empiezo a vender productos, a hacer hilos
                virales, a poner anuncios — me lo recuerdas. Tienes mi email
                en la página de contacto.
              </p>
            </article>
          </div>

          <aside className={styles.letterMargin} aria-hidden="true">
            <div className={styles.pin}>
              <span className={styles.pinWho}>capítulo iv</span>
              <span className={styles.pinWhat}>
                la invitación, sin agenda
              </span>
            </div>
            <div className={styles.pin}>
              <span className={styles.pinWho}>firma</span>
              <span className={styles.pinWhat}>ander · marzo de 2026</span>
            </div>
          </aside>
        </div>
      </section>

      {/* ========================================================== PRINCIPIOS */}
      <section className={styles.principles}>
        <div className={styles.wrap}>
          <h2 className={styles.principlesHeadline}>
            cinco <em>principios</em> que no negocio
          </h2>

          <div className={styles.principlesGrid}>
            <div className={styles.principle}>
              <span className={styles.principleN}>01</span>
              <span className={styles.principleH}>despacio</span>
              <p>
                Lecturas largas. Tiempos de respuesta humanos. Procesos de
                meses, no de fines de semana.
              </p>
            </div>
            <div className={styles.principle}>
              <span className={styles.principleN}>02</span>
              <span className={styles.principleH}>
                en <em>duda</em>
              </span>
              <p>
                Las certezas se venden mejor. Yo prefiero las preguntas. Si
                no sé, lo digo.
              </p>
            </div>
            <div className={styles.principle}>
              <span className={styles.principleN}>03</span>
              <span className={styles.principleH}>
                sin <em>marca</em>
              </span>
              <p>
                Una persona, no una marca. Un nombre con un apellido y un
                colegio. No un personaje.
              </p>
            </div>
            <div className={styles.principle}>
              <span className={styles.principleN}>04</span>
              <span className={styles.principleH}>abierto</span>
              <p>
                Todo lo público, gratis y sin email obligatorio. La
                biblioteca es de quien la lee.
              </p>
            </div>
            <div className={styles.principle}>
              <span className={styles.principleN}>05</span>
              <span className={styles.principleH}>
                claro con el <em>dinero</em>
              </span>
              <p>
                Una tarifa única. Sin paquetes, sin permanencias, sin
                descuentos por compromiso largo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================================== FIRMA */}
      <section className={styles.sign}>
        <div className={styles.wrap}>
          <span className={styles.signEyebrow}>
            Firmado en Bilbao · domingo
          </span>
          <div className={styles.signName}>Ander.</div>
          <div className={styles.signCredentials}>
            psicólogo general sanitario · col. nº <strong>B-04122</strong> ·
            bilbao
          </div>
          <div className={styles.signActions}>
            <Link href="/" className={styles.btnPrimary}>
              Empezar por el vlog
            </Link>
            <Link href="/contacto" className={styles.btnOutline}>
              Reservar primera sesión
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD: articulo editorial */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Manifiesto · Egoera",
            description:
              "El manifiesto editorial de Egoera: por qué escribimos despacio, sin listicles, sin atajos.",
            author: {
              "@type": "Person",
              name: "Ander Bilbao Castejón",
              jobTitle: "Psicólogo general sanitario",
              identifier: "B-04122",
            },
            publisher: {
              "@type": "Organization",
              name: "Egoera",
              url: "https://egoera.es",
            },
            inLanguage: "es-ES",
            datePublished: "2026-03-01",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://egoera.es/manifiesto",
            },
          }),
        }}
      />
    </article>
  );
}
