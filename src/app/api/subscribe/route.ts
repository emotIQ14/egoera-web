import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";

/**
 * Endpoint de suscripcion a newsletter.
 * 1) Si BREVO_API_KEY esta configurada, usa Brevo (lista configurada en config).
 * 2) Fallback: registra el email en fichero local (.data/subscribers.jsonl).
 */
export async function POST(req: NextRequest) {
  try {
    const { email, source, leadMagnet } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Email no valido" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const meta = {
      source: source ?? "newsletter",
      leadMagnet: leadMagnet ?? null,
      ts: new Date().toISOString(),
    };

    if (MONETIZATION_CONFIG.brevo.enabled) {
      try {
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "api-key": MONETIZATION_CONFIG.brevo.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            attributes: {
              SOURCE: meta.source,
              LEAD_MAGNET: meta.leadMagnet,
              FECHA: meta.ts,
            },
            listIds: [MONETIZATION_CONFIG.brevo.listId],
            updateEnabled: true,
          }),
        });

        if (res.ok || res.status === 204) {
          return NextResponse.json({
            success: true,
            message: "Suscripcion confirmada",
          });
        }

        const data = await res.json().catch(() => ({}));
        if (data.code === "duplicate_parameter") {
          return NextResponse.json({
            success: true,
            message: "Ya estabas suscrito. Todo listo.",
          });
        }

        console.error("[Newsletter] Brevo error:", data);
      } catch (err) {
        console.error("[Newsletter] Brevo request failed:", err);
      }
    }

    // Fallback local
    await storeLocally(normalizedEmail, meta);
    console.log(`[Newsletter] New subscriber: ${normalizedEmail} (source: ${meta.source})`);

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

async function storeLocally(email: string, meta: Record<string, unknown>) {
  if (process.env.VERCEL === "1") return;
  try {
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      join(dir, "subscribers.jsonl"),
      JSON.stringify({ email, ...meta }) + "\n"
    );
  } catch {
    // ignore
  }
}
