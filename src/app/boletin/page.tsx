import type { Metadata } from "next";
import Link from "next/link";
import styles from "./boletin.module.css";

/* ------------------------------------------------------------------
 * /boletin — La carta del domingo
 *
 * NOTA DE INTEGRACIÓN:
 * - El layout raíz envuelve cada ruta con <DarkNav /> + <DarkFooter />
 *   (excepto /diario). Esta página inlina su propio nav/footer cream
 *   porque el componente compartido <EgoeraNav /> aún no existe (lo
 *   está creando otro agente). Cuando exista en
 *   `@/components/egoera/EgoeraNav` y `@/components/egoera/EgoeraFooter`,
 *   sustituir el JSX inline por:
 *     import { EgoeraNav } from "@/components/egoera/EgoeraNav";
 *     import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
 *     <EgoeraNav active="boletin" />  ...  <EgoeraFooter />
 *   y, por separado, el layout raíz deberá saltar <DarkNav /> para
 *   las rutas con tema cream (boletin, manifiesto, etc.).
 * ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "El Boletín · Egoera",
  description:
    "Una carta cada domingo sobre tristeza, ansiedad, apego, autoconocimiento. Sin titulares. Sin atajos. Por Ander Bilbao Castejón.",
  openGraph: {
    title: "El Boletín · Egoera",
    description:
      "Una carta cada domingo sobre tristeza, ansiedad, apego, autoconocimiento. Sin titulares. Sin atajos. Por Ander Bilbao Castejón.",
    type: "website",
  },
};

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Vlog" },
  { href: "/sobre-nosotros", label: "Sobre Ander" },
  { href: "/boletin", label: "Boletín" },
  { href: "/contacto", label: "Contacto" },
];

const ARCHIVE: {
  num: string;
  title: React.ReactNode;
  date: string;
  read: string;
}[] = [
  {
    num: "17",
    title: (
      <>
        la <em>egoera</em> de un domingo cualquiera
      </>
    ),
    date: "9 nov 2026",
    read: "11 min",
  },
  {
    num: "16",
    title: (
      <>
        la <em>rabia</em> que no sabemos colocar
      </>
    ),
    date: "2 nov 2026",
    read: "9 min",
  },
  {
    num: "15",
    title: (
      <>
        no es ansiedad, es <em>desbordamiento</em>
      </>
    ),
    date: "26 oct 2026",
    read: "13 min",
  },
  {
    num: "14",
    title: (
      <>
        vínculos que se sostienen <em>sin presencia</em>
      </>
    ),
    date: "19 oct 2026",
    read: "7 min",
  },
  {
    num: "13",
    title: (
      <>
        la <em>infancia</em> que aún nos elige la pareja
      </>
    ),
    date: "12 oct 2026",
    read: "14 min",
  },
  {
    num: "12",
    title: (
      <>
        el <em>duelo</em> que nadie te validó
      </>
    ),
    date: "5 oct 2026",
    read: "9 min",
  },
];

const ANATOMY: {
  n: string;
  title: React.ReactNode;
  body: string;
}[] = [
  {
    n: "01",
    title: (
      <>
        <em>asunto</em> en minúsculas
      </>
    ),
    body: "Sin emojis, sin preguntas-anzuelo, sin «no abras este email». Igual que el titular de cada entrega del vlog. Si te interesa el tema, abres. Si no, no pasa nada.",
  },
  {
    n: "02",
    title: (
      <>
        siempre <em>tuteándote</em>
      </>
    ),
    body: "Una sola persona escribe a una sola persona. No «queridos lectores», no «esperamos que». Yo, a ti. En el idioma que elijas — castellano o euskara, como en consulta.",
  },
  {
    n: "03",
    title: (
      <>
        una <em>idea</em> por carta
      </>
    ),
    body: "No es un resumen de la semana. Es un único pensamiento, desarrollado entre 600 y 900 palabras. Diez minutos máximo. Si necesito más, lo guardo para una entrega del vlog.",
  },
  {
    n: "04",
    title: (
      <>
        sin <em>llamada a la acción</em>
      </>
    ),
    body: "No vas a encontrar «agenda tu sesión» al final. Si después de leer me quieres escribir, sabes dónde estoy. Si no, ya nos vemos el próximo domingo.",
  },
];

const FAQ: {
  q: React.ReactNode;
  a: React.ReactNode;
}[] = [
  {
    q: (
      <>
        ¿es lo mismo que <em>el vlog</em>?
      </>
    ),
    a: "No. El vlog es la pieza larga, pensada para leer en pantalla. La carta es más corta y más íntima — un único pensamiento, 600–900 palabras, sin imágenes. La idea no es competir, sino acompañar.",
  },
  {
    q: (
      <>
        ¿con qué <em>frecuencia</em>?
      </>
    ),
    a: (
      <>
        Una sola carta a la semana. Domingo, 11:00, hora peninsular. Nunca hay
        extras, nunca hay <em>«un email más»</em>. Si una semana no escribo
        (vacaciones, salud, lo que sea), no envío otra cosa.
      </>
    ),
  },
  {
    q: (
      <>
        ¿quién está <em>detrás</em>?
      </>
    ),
    a: "Ander Bilbao Castejón. Yo personalmente. No hay equipo, no hay copywriters, no hay agencia. Cada carta la escribo el sábado por la tarde y la programo para el domingo.",
  },
  {
    q: (
      <>
        ¿puedo <em>responderte</em>?
      </>
    ),
    a: "Sí. Cualquier respuesta a la carta llega a mi email personal. Las leo todas. Contesto cuando puedo — a veces tarda — pero no se pierde ninguna.",
  },
  {
    q: (
      <>
        ¿y si <em>me canso</em>?
      </>
    ),
    a: "Te das de baja en un clic. No vas a recibir un email de «¿estás seguro?» ni una encuesta de salida. Saludas al de la puerta y te marchas tranquilo.",
  },
];

export default function BoletinPage() {
  return (
    <div className={styles.page}>
      {/* ===== NAV (fallback inline — sustituir por <EgoeraNav active="boletin" />) ===== */}
      <nav className={styles.nav} aria-label="Principal">
        <Link href="/" className={styles.navBadge}>
          <svg
            className={styles.navStar}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
          </svg>
          egoera <em>· psicología</em>
        </Link>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={l.href === "/boletin" ? styles.active : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/contacto" className={styles.navCta}>
          Reservar consulta
        </Link>
      </nav>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>
                la carta del domingo · n.º 17
              </span>
              <h1 className={styles.heroH1}>
                una <em>carta</em>,
                <br />
                cada domingo
              </h1>
              <p className={styles.lede}>
                El boletín de Egoera no es una newsletter. Es una carta corta —
                diez minutos de lectura — que te llega por email los domingos a
                las once.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>1.420</span>
                  <span className={styles.statLabel}>lectores</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>96 %</span>
                  <span className={styles.statLabel}>apertura</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>0 €</span>
                  <span className={styles.statLabel}>siempre</span>
                </div>
              </div>
            </div>

            <div className={styles.envelopeWrap} aria-hidden="true">
              <div className={styles.envelope}>
                <div className={styles.stamp}>
                  <span className={styles.starMark}>✦</span>
                  <span className={styles.price}>eur · 11:00</span>
                </div>
                <div className={styles.postmark}>
                  bilbao
                  <br />·<br />
                  domingo
                </div>
                <div className={styles.addr}>
                  para
                  <br />
                  <strong>quien lee despacio</strong>
                  <br />
                  en algún lugar
                  <br />
                  de la semana
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FORMULARIO DE SUSCRIPCIÓN ===== */}
      <section className={styles.formSection}>
        <div className={styles.wrap}>
          <div className={styles.formGrid}>
            <div>
              <h2 className={styles.formH2}>
                una <em>dirección</em>
                <br />
                basta
              </h2>
              <p className={styles.formSideText}>
                Sólo necesito tu email y tu nombre. Nada más. No hay
                segmentación, ni preferencias, ni «déjame saber tu nivel». Todos
                recibimos la misma carta, todos al mismo tiempo.
              </p>
              <ul className={styles.promise}>
                <li>cero afiliados, cero patrocinios</li>
                <li>cancelas en un clic, sin preguntas</li>
                <li>tu email no se vende ni se cede</li>
                <li>archivo público, también desde la web</li>
              </ul>
            </div>

            {/*
              Form action apunta al endpoint existente /api/subscribe,
              que ya integra Brevo + fallback local.
              TODO: si se decide mover a Buffer/Mailchimp/otra plataforma,
                    cambiar action y los nombres de los campos.
            */}
            <form
              className={styles.formCard}
              method="POST"
              action="/api/subscribe"
            >
              <h3 className={styles.formCardH3}>
                recibir <em>la carta</em>
              </h3>
              <p className={styles.formCardSmall}>
                empieza con la próxima · domingo 16 nov 2026 · 11:00
              </p>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="nombre">tu nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="cómo quieres que te salude"
                    autoComplete="given-name"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="lengua">en qué idioma</label>
                  <select id="lengua" name="lengua" defaultValue="castellano">
                    <option value="castellano">castellano</option>
                    <option value="euskara">euskara</option>
                    <option value="ambos">las dos versiones</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">tu email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="hola@dominio.com"
                  autoComplete="email"
                />
              </div>

              {/* Marca el origen para el endpoint de subscribe */}
              <input type="hidden" name="source" value="boletin-domingo" />

              <div className={styles.submitRow}>
                <p className={styles.legal}>
                  al suscribirte aceptas la política de privacidad. egoera no
                  usa trackers ni píxeles.
                </p>
                <button className={styles.submitBtn} type="submit">
                  enviar la carta <span className={styles.arrow}>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===== ANATOMÍA DE LA CARTA ===== */}
      <section className={styles.anatomy}>
        <div className={styles.wrap}>
          <h2 className={styles.sectionH2}>
            cómo <em>está hecha</em>
            <br />
            una carta
          </h2>

          <div className={styles.anatomyGrid}>
            <div className={styles.mail} aria-hidden="true">
              <div className={styles.mailHead}>
                <div className={styles.mailDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.mailFrom}>de · ander@egoera.es</span>
              </div>
              <div className={styles.mailMeta}>
                <div className={styles.mailMetaRow}>
                  <span>asunto</span>
                </div>
                <div className={styles.mailSubject}>
                  la <em>egoera</em> de un domingo cualquiera
                </div>
                <div
                  className={styles.mailMetaRow}
                  style={{ marginTop: 14 }}
                >
                  <span>para · ti</span>
                  <span>—</span>
                  <span>9 nov 2026 · 11:00</span>
                  <span>—</span>
                  <span>
                    nº <strong>17</strong>
                  </span>
                </div>
              </div>
              <div className={styles.mailBody}>
                <p className={styles.mailGreet}>Hola, ¿qué tal este domingo?</p>
                <p>
                  Hoy quería escribirte sobre los días en los que{" "}
                  <em>no estás bien</em>, pero tampoco mal. Esos en los que no
                  pasa nada y, sin embargo, algo no encaja. Llevo años
                  llamándolos <em>egoera</em>: el estado que no es estado.
                </p>
                <div
                  className={styles.mailPlaceholder}
                  style={{ width: "92%" }}
                />
                <div
                  className={styles.mailPlaceholder}
                  style={{ width: "88%" }}
                />
                <div
                  className={styles.mailPlaceholder}
                  style={{ width: "95%" }}
                />
                <div
                  className={styles.mailPlaceholder}
                  style={{ width: "76%" }}
                />
                <p style={{ marginTop: 14 }}>
                  A veces la mejor noticia que te puedes dar es que{" "}
                  <em>esto también es algo</em>. No tienes que estar bien ni
                  mal. Puedes simplemente <em>estar</em>.
                </p>
                <p className={styles.mailSignoff}>
                  Hasta el domingo que viene,
                  <br />
                  Ander.
                </p>
              </div>
            </div>

            <div className={styles.annot}>
              {ANATOMY.map((item) => (
                <div key={item.n} className={styles.annotItem}>
                  <span className={styles.annotNumber}>{item.n}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARCHIVO DE CARTAS ===== */}
      <section className={styles.archive}>
        <div className={styles.wrap}>
          <h2 className={styles.archiveH2}>
            cartas <em>anteriores</em>
          </h2>
          <p className={styles.archiveSub}>
            archivo público · ordenado de más nueva a más antigua · todas
            legibles sin suscribirse
          </p>

          {/* TODO: cuando exista la fuente real (Notion/MDX), sustituir ARCHIVE por datos reales */}
          <div className={styles.letterGrid}>
            {ARCHIVE.map((c) => (
              <Link key={c.num} href="#" className={styles.letterCard}>
                <span className={styles.lcNum}>{c.num}</span>
                <span className={styles.lcH}>{c.title}</span>
                <div className={styles.lcMeta}>
                  <span>{c.date}</span>
                  <strong>{c.read}</strong>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.archiveCtaWrap}>
            <Link href="/blog" className={styles.egBtn}>
              Ver el cuaderno completo <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={styles.faq}>
        <div className={styles.wrap}>
          <h2 className={styles.faqH2}>
            preguntas <em>razonables</em>
          </h2>
          <div className={styles.qa}>
            {FAQ.map((row, i) => (
              <div key={i} className={styles.qaRow}>
                <div className={styles.qaQ}>{row.q}</div>
                <div className={styles.qaA}>{row.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER (fallback inline — sustituir por <EgoeraFooter />) ===== */}
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.navBadge}>
                <svg
                  className={styles.navStar}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
                </svg>
                egoera
              </div>
              <p className={styles.footerTag}>
                un sitio para <em>sentir despacio</em>
              </p>
            </div>
            <div className={styles.footerCol}>
              <h5>Vlog</h5>
              <Link href="/blog">Última entrada</Link>
              <Link href="/blog">Cuaderno completo</Link>
            </div>
            <div className={styles.footerCol}>
              <h5>Egoera</h5>
              <Link href="/sobre-nosotros">Sobre Ander</Link>
              <Link href="/contacto">Consulta</Link>
              <Link href="/boletin">Boletín</Link>
            </div>
            <div className={styles.footerCol}>
              <h5>Legal</h5>
              <Link href="/aviso-legal">Aviso legal</Link>
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 · egoera · ander bilbao castejón</span>
            <span>diseñado en Bilbao · publicado los domingos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
