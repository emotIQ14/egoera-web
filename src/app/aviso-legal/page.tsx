import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal de Egoera Psikologia. Informacion legal sobre el sitio web egoera.es y los servicios de psicologia.",
};

export default function AvisoLegalPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-8">
          Aviso Legal
        </h1>
        <p className="text-sm text-grey-text mb-8">Ultima actualizacion: abril 2026</p>

        <h2>1. Datos identificativos</h2>
        <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Informacion y de Comercio Electronico (LSSI-CE):</p>
        <ul>
          <li><strong>Titular:</strong> Egoera Psikologia</li>
          <li><strong>Domicilio:</strong> Bilbao, Bizkaia, Pais Vasco</li>
          <li><strong>Email:</strong> hola@egoera.es</li>
          <li><strong>Sitio web:</strong> https://egoera.es</li>
          <li><strong>Actividad:</strong> Servicios de psicologia y salud mental</li>
        </ul>

        <h2>2. Objeto</h2>
        <p>Este sitio web tiene como finalidad informar sobre los servicios de psicologia ofrecidos por Egoera Psikologia, asi como proporcionar contenido educativo sobre salud mental y bienestar emocional.</p>

        <h2>3. Condiciones de uso</h2>
        <p>El acceso a este sitio web es gratuito y no requiere registro previo, salvo para funcionalidades especificas como el diario emocional o la newsletter.</p>
        <p>El usuario se compromete a utilizar el sitio web de manera diligente, correcta y licita, absteniendose de:</p>
        <ul>
          <li>Utilizar los contenidos con fines comerciales sin autorizacion.</li>
          <li>Reproducir, copiar o distribuir los contenidos sin autorizacion previa.</li>
          <li>Realizar acciones que puedan danar la imagen de Egoera Psikologia.</li>
        </ul>

        <h2>4. Propiedad intelectual</h2>
        <p>Todos los contenidos del sitio web (textos, imagenes, diseno, logotipos, codigo fuente) son propiedad de Egoera Psikologia o de sus respectivos autores y estan protegidos por las leyes de propiedad intelectual.</p>
        <p>Se permite compartir los articulos del blog enlazando a la fuente original. Queda prohibida la reproduccion integra sin autorizacion.</p>

        <h2>5. Disclaimer sanitario</h2>
        <p><strong>Importante:</strong> Los contenidos publicados en este sitio web tienen caracter informativo y educativo. En ningun caso sustituyen el diagnostico, consejo o tratamiento profesional. Si necesitas ayuda profesional, te recomendamos solicitar una consulta con un psicologo colegiado.</p>
        <p>Egoera Psikologia no se responsabiliza del uso que los usuarios hagan de la informacion proporcionada en este sitio web.</p>

        <h2>6. Enlaces externos</h2>
        <p>Este sitio web puede contener enlaces a sitios web de terceros. Egoera Psikologia no se hace responsable del contenido ni de las politicas de privacidad de dichos sitios.</p>

        <h2>7. Legislacion aplicable</h2>
        <p>Este aviso legal se rige por la legislacion espanola vigente. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Bilbao (Bizkaia).</p>

        <h2>8. Contacto</h2>
        <p>Para cualquier consulta legal, escribenos a <strong>hola@egoera.es</strong>.</p>
      </div>
    </div>
  );
}
