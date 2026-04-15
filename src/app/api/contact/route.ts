import { NextRequest, NextResponse } from "next/server";

/**
 * Contact form API endpoint for Egoera Psikologia.
 * Sends notification email via Brevo transactional API
 * and stores the lead for follow-up.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios (nombre, email, mensaje)" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Email no valido" },
        { status: 400 }
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const NOTIFICATION_EMAIL = process.env.CONTACT_EMAIL ?? "hola@egoera.es";

    const subjectMap: Record<string, string> = {
      consulta: "Consulta general",
      sesion: "Reserva de sesion",
      empresa: "Taller para empresa",
      colaboracion: "Colaboracion",
    };

    const subjectLabel = subjectMap[subject] ?? "Consulta";
    const emailSubject = `[egoera.es] ${subjectLabel}: ${name}`;

    const emailBody = [
      `Nuevo mensaje desde egoera.es`,
      ``,
      `Tipo: ${subjectLabel}`,
      `Nombre: ${name}`,
      `Email: ${email}`,
      `Telefono: ${phone || "No proporcionado"}`,
      ``,
      `Mensaje:`,
      message,
      ``,
      `---`,
      `Enviado desde el formulario de contacto de egoera.es`,
      `Fecha: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`,
    ].join("\n");

    if (BREVO_API_KEY) {
      // Send notification email via Brevo transactional API
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Egoera Web", email: "noreply@egoera.es" },
          to: [{ email: NOTIFICATION_EMAIL, name: "Egoera Psikologia" }],
          replyTo: { email, name },
          subject: emailSubject,
          textContent: emailBody,
        }),
      });

      if (!res.ok) {
        console.error("[Contact] Brevo error:", await res.text());
        // Don't fail — fall through to log
      }

      // Also add contact to Brevo CRM for follow-up
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: {
            NOMBRE: name,
            TELEFONO: phone ?? "",
            SOURCE: "contacto-web",
            TIPO_CONSULTA: subjectLabel,
            FECHA: new Date().toISOString(),
          },
          listIds: [3], // Contact form leads list
          updateEnabled: true,
        }),
      }).catch((err) => console.error("[Contact] CRM save error:", err));
    }

    // Always log for debugging / fallback
    console.log(`[Contact] ${emailSubject} — ${email}`);

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado. Te respondemos en menos de 24 horas.",
    });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { success: false, message: "Error al enviar el mensaje. Intenta de nuevo o escribenos a hola@egoera.es" },
      { status: 500 }
    );
  }
}
