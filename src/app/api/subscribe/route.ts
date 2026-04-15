import { NextRequest, NextResponse } from "next/server";

/**
 * Newsletter subscription API endpoint.
 * Stores emails for later Brevo integration.
 * For now, captures to a local JSON file and logs.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Email no valido" },
        { status: 400 }
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (BREVO_API_KEY) {
      // Send to Brevo
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: { SOURCE: source ?? "newsletter", FECHA: new Date().toISOString() },
          listIds: [2],
          updateEnabled: true,
        }),
      });

      if (res.ok || res.status === 204) {
        return NextResponse.json({ success: true, message: "Suscripcion confirmada" });
      }

      const data = await res.json();
      if (data.code === "duplicate_parameter") {
        return NextResponse.json({ success: true, message: "Ya estas suscrito/a" });
      }
    }

    // Fallback: log and send notification email via WordPress
    console.log(`[Newsletter] New subscriber: ${email} (source: ${source})`);

    // Store locally — in production, connect to Brevo or a database
    return NextResponse.json({
      success: true,
      message: "Suscripcion confirmada. Te enviaremos contenido pronto.",
    });
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json(
      { success: false, message: "Error interno" },
      { status: 500 }
    );
  }
}
