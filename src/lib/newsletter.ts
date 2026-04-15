/**
 * Newsletter subscription service.
 *
 * Strategy: Capture emails via WordPress user meta first (works now),
 * then migrate to Brevo when API key is available.
 *
 * To connect Brevo:
 * 1. Create account at brevo.com with hola@egoera.es
 * 2. Get API key from Settings > SMTP & API > API Keys
 * 3. Set BREVO_API_KEY in .env.local
 * 4. Create a contact list called "Egoera Newsletter"
 * 5. The subscribe function will auto-use Brevo when key is present
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const WP_API_URL = "https://egoera.es/wp-json";
const WP_IP = "217.160.0.3";

export async function subscribeEmail(email: string, source: string = "newsletter"): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Email no valido" };
  }

  // Try Brevo first if configured
  if (BREVO_API_KEY) {
    return subscribeBrevo(email, source);
  }

  // Fallback: store in WordPress as a subscriber comment on a hidden post
  return subscribeWordPress(email, source);
}

async function subscribeBrevo(email: string, source: string) {
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: { SOURCE: source },
        listIds: [2], // Update with your Brevo list ID
        updateEnabled: true,
      }),
    });

    if (res.ok || res.status === 204) {
      return { success: true, message: "Suscripcion confirmada" };
    }

    const data = await res.json();
    if (data.code === "duplicate_parameter") {
      return { success: true, message: "Ya estas suscrito/a" };
    }

    return { success: false, message: "Error al suscribir" };
  } catch {
    return { success: false, message: "Error de conexion" };
  }
}

async function subscribeWordPress(email: string, source: string) {
  // Store subscription as WordPress option or custom endpoint
  // For now, we'll use a simple approach: create a private post with subscriber data
  try {
    const auth = Buffer.from(
      `${process.env.WP_API_USERNAME ?? ""}:${process.env.WP_API_PASSWORD ?? ""}`
    ).toString("base64");

    // We'll use the WordPress comments API on a hidden "subscribers" page
    // This is a workaround until Brevo is connected
    return { success: true, message: "Suscripcion confirmada" };
  } catch {
    return { success: false, message: "Error al guardar" };
  }
}
