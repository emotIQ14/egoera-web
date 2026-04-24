import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { amazonAffiliateUrl, MONETIZATION_CONFIG } from "@/lib/monetization-config";

/**
 * Registra clics de afiliado y redirige al destino final.
 * Uso: /api/affiliate-click?network=amazon&asin=XXXXXXXXXX&source=post-slug
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const network = url.searchParams.get("network") ?? "amazon";
  const asin = url.searchParams.get("asin") ?? "";
  const source = url.searchParams.get("source") ?? "unknown";
  const destination = url.searchParams.get("url");

  let target = "https://www.amazon.es/";

  if (network === "amazon" && asin) {
    target = amazonAffiliateUrl(asin);
  } else if (network === "audible") {
    target = MONETIZATION_CONFIG.audible.baseUrl;
  } else if (network === "booking") {
    target = destination ?? MONETIZATION_CONFIG.booking.baseUrl;
  } else if (destination) {
    target = destination;
  }

  const entry = {
    event: "affiliate_click",
    network,
    asin,
    source,
    target,
    ts: Date.now(),
    ip: req.headers.get("x-forwarded-for") ?? null,
    ua: req.headers.get("user-agent") ?? null,
  };

  if (process.env.VERCEL !== "1") {
    try {
      const dir = join(process.cwd(), ".data");
      await mkdir(dir, { recursive: true });
      await appendFile(join(dir, "affiliate-clicks.log"), JSON.stringify(entry) + "\n");
    } catch {
      // ignore
    }
  }

  console.log("[affiliate-click]", JSON.stringify(entry));

  return NextResponse.redirect(target, 302);
}
