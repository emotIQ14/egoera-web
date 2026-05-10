"use client";

import { useDiaryStore, FEELINGS } from "@/lib/diary-store";

const FREQS = [1, 2, 3, 4] as const;
const FREQ_LABELS: Record<number, string> = {
  1: "Una entrada al día",
  2: "Mañana y noche",
  3: "Mañana, tarde, noche",
  4: "Cada pocas horas",
};

export default function AjustesPage() {
  const { hydrated, settings, entries, updateSettings } = useDiaryStore();

  if (!hydrated) return <p className="serif" style={{ padding: 30 }}>Cargando…</p>;

  const exportData = () => {
    const dump = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      entries,
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `egoera-diario-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="diario-greet">
        <div className="diario-eyebrow">Ajustes</div>
        <h1 className="diario-h2">
          Tu <em>diario</em>,<br/>tus reglas.
        </h1>
      </header>

      <div className="d-card">
        <div className="d-card-eyebrow">Tu nombre</div>
        <input
          type="text"
          value={settings.name}
          onChange={(e) => updateSettings({ name: e.target.value })}
          placeholder="¿Cómo te llamas?"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: "1.5px solid var(--blue)",
            padding: "10px 0",
            fontFamily: "var(--font-display), Caveat, cursive",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--blue)",
            outline: "none",
          }}
        />
      </div>

      <div className="d-card">
        <div className="d-card-eyebrow">Frecuencia de check-in</div>
        <h2 className="d-card-title">
          ¿Cada <em>cuánto</em>?
        </h2>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.5, margin: "4px 0 8px" }}>
          Más alta no es mejor. Es lo que tú aguantes sin que se vuelva tarea.
        </p>
        <div className="freq-grid">
          {FREQS.map((n) => (
            <button
              key={n}
              className={`freq-card ${settings.checkInsPerDay === n ? "selected" : ""}`}
              onClick={() => updateSettings({ checkInsPerDay: n })}
            >
              <div className="freq-card-num">{n}</div>
              <div className="freq-card-lbl">{n === 1 ? "vez al día" : "veces al día"}</div>
              <div className="serif" style={{ fontSize: 12, opacity: 0.8, marginTop: 6, lineHeight: 1.3 }}>
                {FREQ_LABELS[n]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="d-card">
        <div className="d-card-eyebrow">Notificaciones</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Recordatorios suaves</div>
            <div className="settings-row-meta">Solo si lo permites en el sistema</div>
          </div>
          <button
            className={`d-btn ${settings.notifications ? "d-btn-blue" : "d-btn-outline"}`}
            onClick={async () => {
              if (!settings.notifications && "Notification" in window) {
                const r = await Notification.requestPermission();
                updateSettings({ notifications: r === "granted" });
              } else {
                updateSettings({ notifications: false });
              }
            }}
            style={{ padding: "8px 18px" }}
          >
            {settings.notifications ? "Activadas" : "Activar"}
          </button>
        </div>
      </div>

      <div className="d-card">
        <div className="d-card-eyebrow">Privacidad · datos</div>
        <h2 className="d-card-title">
          Solo en tu <em>móvil</em>.
        </h2>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.55, margin: "4px 0 14px" }}>
          Egoera no envía nada a ningún servidor. Tus entradas viven en este dispositivo.
          Si quieres llevártelas o moverlas, puedes exportar el archivo.
        </p>
        <button className="d-btn d-btn-outline d-btn-block" onClick={exportData}>
          Exportar mi diario (JSON)
        </button>
      </div>

      <div className="d-card invert">
        <div className="d-card-eyebrow">Sentimientos del sistema</div>
        <h2 className="d-card-title">
          Tu <em>vocabulario</em>.
        </h2>
        <p className="serif" style={{ fontSize: 13, lineHeight: 1.55, margin: "4px 0 12px" }}>
          Estos son los 8 estados base. Cada uno enlaza con un archivo del vlog Egoera.
        </p>
        <div className="tag-grid">
          {FEELINGS.map((f) => (
            <span key={f.id} className="tag-chip" style={{ borderColor: "var(--cream)", color: "var(--cream)", background: "transparent" }}>
              {f.name}
            </span>
          ))}
        </div>
      </div>

      <div className="d-card" style={{ textAlign: "center" }}>
        <p className="diario-greet-meta">
          v1.0 · Egoera Diario · 2026
        </p>
        <p className="serif" style={{ fontSize: 13, marginTop: 6 }}>
          Hecho a mano por <a href="https://egoera.es" style={{ color: "var(--blue)" }}>Ander Bilbao</a>, en Bilbao.
        </p>
      </div>
    </>
  );
}
