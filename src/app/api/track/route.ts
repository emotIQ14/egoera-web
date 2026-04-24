import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Registro sencillo de eventos de analitica en fichero.
 * En produccion (Vercel) el FS es efimero; usar como baseline hasta migrar a
 * un backend dedicado (Plausible, PostHog, Supabase).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.event) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const entry = {
      ...body,
      ip: req.headers.get("x-forwarded-for") ?? null,
      ua: req.headers.get("user-agent") ?? null,
      ts: body.ts ?? Date.now(),
    };

    // Solo en entornos con FS persistente (no Vercel)
    if (process.env.VERCEL !== "1") {
      try {
        const dir = join(process.cwd(), ".data");
        await mkdir(dir, { recursive: true });
        await appendFile(join(dir, "events.log"), JSON.stringify(entry) + "\n");
      } catch {
        // ignore write failures
      }
    }

    // Siempre en consola para inspeccion en logs del hosting
    console.log("[track]", JSON.stringify(entry));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
