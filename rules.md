# Reglas de seguridad — Nights Watch egoera-web

Restricciones obligatorias para la ejecución autónoma. Si alguna se viola,
**detén la sesión inmediatamente** y reporta a Telegram.

## ❌ PROHIBIDO

1. **No commitear nada directamente a `main`.** Cualquier cambio de código → rama `nights-watch/YYYY-MM-DD-<topic>` + PR.
2. **No publicar en WordPress.** No tocar `wp-admin`, no usar `wp_add_post`, no llamar a `wp_update_post`. WordPress es producción en vivo.
3. **No tocar el CinematicHero ni el V5ArticleShell** sin Ander presente — son los componentes de mayor visibilidad.
4. **No ejecutar `npm run start` ni `npm run dev`.** Esos son procesos del usuario, no del daemon.
5. **No modificar `.env`, `next.config.ts`, `tsconfig.json`** sin Ander.
6. **No tocar el sitemap ni el middleware** — son críticos SEO.
7. **No instalar paquetes** (`npm install <x>`) sin Ander.
8. **No borrar archivos** del repo. Sólo crear o editar.
9. **No tocar el bot de Telegram** (`@andermacbookbot` y el bot de Egoera) — son canales de aviso, no de ejecución.
10. **No tocar la app `egoera-diario`** (otro repo independiente).

## ✅ PERMITIDO (sin pedir permiso)

1. **Auditorías y reportes** en `~/scripts/*/reports/` y `~/scripts/*/logs/`.
2. **Lectura del repo** (cualquier archivo).
3. **Lectura de la producción** (curl GET, sin POST/PUT/DELETE).
4. **Lectura de WP-REST API** (`/wp-json/wp/v2/posts?per_page=N`).
5. **Generar archivos nuevos** en `~/scripts/*/` (reportes, logs, propuestas).
6. **Crear ramas git nuevas** + PRs (no merge).
7. **Ejecutar `npm run build`** (sólo build, no run).
8. **Ejecutar `npm run lint`** y `npm run typecheck` si existen.
9. **Notificar a Telegram** con resumen final.

## 🟡 REQUIERE CONFIRMACIÓN HUMANA

Si necesitas hacer algo de esta lista → abre un PR con la propuesta y avisa por Telegram, **NO ejecutes**:

1. Actualizar dependencias (`npm update`).
2. Tocar `package.json`.
3. Reescribir componentes existentes.
4. Cambiar el extractor de learnings (`extract-learnings.ts`) — afecta a todos los posts.
5. Cambiar el sitemap.
6. Tocar el middleware i18n.
7. Borrar ramas remotas o forzar pushes.

## 🚨 ALERTAS CRÍTICAS

Si detectas cualquiera de estos → alerta INMEDIATA a Telegram con `🚨`:

1. Producción HTTP != 200 dos checks seguidos.
2. Sitemap con < 100 URLs (debería ser 168).
3. Build falla con error de compilación.
4. WordPress backend no responde (`wp-json/wp/v2/posts` 5xx).
5. Hreflang < 600 declaraciones.
6. CinematicHero no rendera (sin `.ch-hero` en HTML inicial).
7. CuadernoCierre desaparece de > 30% de los posts.

## TIMEOUT

Sesión Nights Watch máxima: **3 horas**. Si te quedas sin tiempo:
1. Pausa la tarea actual.
2. Escribe el estado en el resumen.
3. Termina limpiamente.
4. Notifica.

## IDIOMA

Toda la comunicación (logs, reportes, Telegram) en **español impecable**. Sin
muletillas tipo "¡claro!", "¡por supuesto!", "espero que te sea útil".
