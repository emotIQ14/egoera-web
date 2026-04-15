import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Cookies",
  description: "Politica de cookies de Egoera Psikologia. Informacion sobre las cookies que utilizamos en egoera.es.",
};

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-8">
          Politica de Cookies
        </h1>
        <p className="text-sm text-grey-text mb-8">Ultima actualizacion: abril 2026</p>

        <h2>Que son las cookies</h2>
        <p>Las cookies son pequenos archivos de texto que los sitios web almacenan en tu navegador. Se utilizan para recordar preferencias, analizar el trafico web y personalizar la experiencia del usuario.</p>

        <h2>Cookies que utilizamos</h2>

        <h3>Cookies tecnicas (necesarias)</h3>
        <p>Estas cookies son esenciales para el funcionamiento basico del sitio web. No requieren consentimiento.</p>
        <ul>
          <li><strong>Preferencias del diario emocional:</strong> almacenamiento local (localStorage) para guardar tus entradas del diario. Los datos permanecen unicamente en tu navegador.</li>
          <li><strong>Preferencia de tema:</strong> si seleccionas modo claro/oscuro.</li>
        </ul>

        <h3>Cookies analiticas (opcionales)</h3>
        <p>Actualmente <strong>no utilizamos cookies analiticas</strong> de terceros (no hay Google Analytics, Meta Pixel ni similar). Si en el futuro las implementamos, actualizaremos esta politica y solicitaremos tu consentimiento previo.</p>

        <h3>Cookies de terceros</h3>
        <p>Nuestro sitio puede incluir contenido embebido (como videos o calendarios de citas) que puede establecer sus propias cookies. No tenemos control sobre estas cookies de terceros.</p>

        <h2>Como gestionar las cookies</h2>
        <p>Puedes gestionar o eliminar las cookies en cualquier momento a traves de la configuracion de tu navegador:</p>
        <ul>
          <li><strong>Chrome:</strong> Configuracion &gt; Privacidad y seguridad &gt; Cookies</li>
          <li><strong>Firefox:</strong> Opciones &gt; Privacidad &gt; Cookies</li>
          <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Cookies</li>
          <li><strong>Edge:</strong> Configuracion &gt; Cookies y permisos del sitio</li>
        </ul>

        <h2>Contacto</h2>
        <p>Si tienes preguntas sobre nuestra politica de cookies, escribenos a <strong>hola@egoera.es</strong>.</p>
      </div>
    </div>
  );
}
