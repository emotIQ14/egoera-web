"use client";

import Link from "next/link";

export default function PrivacidadDiarioPage() {
  return (
    <>
      <header className="diario-greet">
        <div className="diario-eyebrow">Privacidad</div>
        <h1 className="diario-h2">Tus <em>datos</em>,<br/>nada nuestro.</h1>
      </header>

      <div className="d-card">
        <p className="serif" style={{ fontSize: 15, lineHeight: 1.65 }}>
          Egoera Diario es un cuaderno privado. <strong style={{ fontStyle: "normal" }}>Todo</strong> lo que registras se guarda
          en tu dispositivo, en el almacenamiento local del navegador o de la app. No hay servidor.
          No tenemos copia de tus entradas.
        </p>
      </div>

      <div className="d-card">
        <div className="d-card-eyebrow">Lo que NO hacemos</div>
        <ul className="serif" style={{ fontSize: 14, lineHeight: 1.7, paddingLeft: 18, marginTop: 6 }}>
          <li>No pedimos email, teléfono ni cuenta para usar la app.</li>
          <li>No usamos analítica, ni tracking, ni cookies de terceros.</li>
          <li>No vendemos ni cedemos datos a nadie.</li>
          <li>No hay perfilado, ni publicidad, ni algoritmo de recomendación.</li>
        </ul>
      </div>

      <div className="d-card">
        <div className="d-card-eyebrow">Lo que SÍ haces tú</div>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.65, marginTop: 6 }}>
          Puedes <strong style={{ fontStyle: "normal" }}>exportar</strong> tu diario en JSON cuando quieras desde Ajustes,
          y borrarlo entero desinstalando la app o limpiando el almacenamiento del navegador.
        </p>
      </div>

      <div className="d-card invert">
        <div className="d-card-eyebrow">Más detalle</div>
        <h2 className="d-card-title">Política <em>completa</em>.</h2>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 6, marginBottom: 14 }}>
          La política completa, con marco RGPD/LOPDGDD y datos de contacto del responsable.
        </p>
        <a
          href="https://github.com/anderbilbaocastejon/egoera-web/blob/main/docs/PRIVACY.md"
          className="d-btn d-btn-blue"
          style={{ background: "var(--cream)", color: "var(--blue)" }}
          target="_blank" rel="noopener noreferrer"
        >
          Leer la política →
        </a>
      </div>

      <div className="d-card" style={{ textAlign: "center" }}>
        <Link href="/diario/ajustes" className="d-btn d-btn-outline">← Volver a Ajustes</Link>
      </div>
    </>
  );
}
