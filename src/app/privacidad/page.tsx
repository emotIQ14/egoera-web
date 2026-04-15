import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Politica de privacidad de Egoera Psikologia. Informacion sobre el tratamiento de datos personales segun el RGPD.",
};

export default function PrivacidadPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-8">
          Politica de Privacidad
        </h1>
        <p className="text-sm text-grey-text mb-8">Ultima actualizacion: abril 2026</p>

        <h2>1. Responsable del tratamiento</h2>
        <ul>
          <li><strong>Titular:</strong> Egoera Psikologia</li>
          <li><strong>Email de contacto:</strong> hola@egoera.es</li>
          <li><strong>Sitio web:</strong> https://egoera.es</li>
        </ul>

        <h2>2. Datos que recopilamos</h2>
        <p>Recopilamos los siguientes datos personales unicamente cuando tu nos los proporcionas voluntariamente:</p>
        <ul>
          <li><strong>Formulario de contacto:</strong> nombre, email, telefono (opcional) y mensaje.</li>
          <li><strong>Newsletter:</strong> email.</li>
          <li><strong>Diario emocional:</strong> los datos del diario se almacenan localmente en tu navegador y no se envian a nuestros servidores.</li>
        </ul>

        <h2>3. Finalidad del tratamiento</h2>
        <ul>
          <li>Responder a tus consultas y solicitudes de informacion.</li>
          <li>Gestionar citas y sesiones de terapia.</li>
          <li>Enviar la newsletter si te has suscrito voluntariamente.</li>
          <li>Mejorar nuestros servicios y la experiencia de usuario en la web.</li>
        </ul>

        <h2>4. Base legal</h2>
        <ul>
          <li><strong>Consentimiento:</strong> al enviar un formulario o suscribirte a la newsletter.</li>
          <li><strong>Interes legitimo:</strong> para mejorar nuestros servicios.</li>
          <li><strong>Obligacion legal:</strong> para cumplir con la normativa sanitaria aplicable.</li>
        </ul>

        <h2>5. Conservacion de datos</h2>
        <p>Conservamos tus datos personales solo durante el tiempo necesario para cumplir la finalidad para la que fueron recogidos:</p>
        <ul>
          <li><strong>Datos de contacto:</strong> hasta que se resuelva la consulta o durante la relacion terapeutica.</li>
          <li><strong>Newsletter:</strong> hasta que solicites la baja.</li>
          <li><strong>Datos clinicos:</strong> segun la normativa sanitaria vigente (minimo 5 anos tras la ultima consulta).</li>
        </ul>

        <h2>6. Derechos del usuario</h2>
        <p>Tienes derecho a:</p>
        <ul>
          <li>Acceder a tus datos personales.</li>
          <li>Rectificar datos inexactos.</li>
          <li>Solicitar la supresion de tus datos.</li>
          <li>Oponerte al tratamiento.</li>
          <li>Solicitar la portabilidad de tus datos.</li>
          <li>Retirar el consentimiento en cualquier momento.</li>
        </ul>
        <p>Para ejercer estos derechos, escribenos a <strong>hola@egoera.es</strong>.</p>

        <h2>7. Seguridad</h2>
        <p>Aplicamos medidas tecnicas y organizativas para proteger tus datos personales frente a accesos no autorizados, alteracion, perdida o destruccion.</p>

        <h2>8. Transferencias internacionales</h2>
        <p>No realizamos transferencias de datos personales fuera del Espacio Economico Europeo.</p>

        <h2>9. Confidencialidad profesional</h2>
        <p>Como profesionales de la psicologia, estamos sujetos al secreto profesional regulado por el Codigo Deontologico del Colegio Oficial de Psicologos. Toda la informacion compartida en el contexto terapeutico es estrictamente confidencial.</p>

        <h2>10. Contacto</h2>
        <p>Si tienes alguna pregunta sobre esta politica de privacidad, contacta con nosotros en <strong>hola@egoera.es</strong>.</p>
      </div>
    </div>
  );
}
