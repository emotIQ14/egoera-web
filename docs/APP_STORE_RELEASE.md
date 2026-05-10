# Egoera Diario — Plan de lanzamiento App Store + Google Play

## Identidad

| Campo | Valor |
|---|---|
| App Name | Egoera Diario |
| Bundle ID | `es.egoera.diario` |
| Lenguaje primario | Español (ES) |
| Categoría primaria | Salud y forma física (Health & Fitness) |
| Categoría secundaria | Estilo de vida |
| Edad mínima | 12+ |
| Localizaciones | ES, EU, LATAM (mismo idioma) |
| Sitio | https://egoera.es |
| Email soporte | anderbilbaocastejon@gmail.com |

## Copy oficial

### App Store / Play subtítulo (30 / 80 chars)

> Diario emocional, despacio.

### Descripción larga (4000 chars)

```
Egoera Diario es un cuaderno emocional personal. Sin algoritmos, sin
notificaciones agresivas, sin métricas raras. Solo tú, lo que sientes y
el tiempo para nombrarlo.

— ocho sentimientos como mapa, no como caja:
ansiedad · tristeza · apego · autoestima · enfado · calma · soledad · culpa.

— check-ins suaves de menos de 3 minutos:
elige el sentimiento, ajusta intensidad, añade contexto si quieres,
escribe lo que te apetezca. Listo.

— historial sin presión:
filtra por sentimiento, ve tu archivo personal, vuelve a leer lo que
sentías hace dos meses para entender lo que sientes hoy.

— revisión semanal honesta:
qué ha pesado, qué se ha repetido, con qué intensidad. Sin gamificación
agresiva, sin streak shaming.

— hábitos que tú eliges:
meditar, hidratarte, caminar, leer, dormir. Súmalos al día sin que se
vuelvan tarea.

— privacidad radical:
todo se guarda en tu dispositivo. No hay servidor. No vendemos nada.
Exportas tu diario cuando quieras, en JSON, en un click.

Egoera Diario es la app del vlog Egoera (egoera.es), un proyecto sobre
psicología despacio escrito desde Bilbao por Ander Bilbao Castejón.

— hecho a mano, despacio.
```

### Keywords (App Store, 100 chars)

```
diario emocional,mood tracker,bienestar,psicología,ansiedad,autoconocimiento,journal,self-care
```

### Capturas de pantalla obligatorias

| Pantalla | iOS (1284×2778) | Android (1080×1920) |
|---|---|---|
| 1. Onboarding "How do you feel today?" con blob | ✅ | ✅ |
| 2. Dashboard con saludo + calendario | ✅ | ✅ |
| 3. Check-in con feeling picker | ✅ | ✅ |
| 4. Intensity slider | ✅ | ✅ |
| 5. Historial filtrado | ✅ | ✅ |
| 6. Revisión semanal con gráfico | ✅ | ✅ |

Captura las 6 con el simulador de Xcode (iPhone 15 Pro Max) y emulador de
Android Studio (Pixel 7 Pro). Guarda en `/marketing/screenshots/`.

### Iconos

- iOS app icon: 1024×1024 (sin transparencia), generar con `npx capacitor-assets generate`
- Android adaptive icon: 432×432 foreground + 432×432 background

## Checklist de release

### iOS · Apple Developer

- [ ] Cuenta Apple Developer activa (99 USD/año)
- [ ] Provisioning profile + certificado de firma
- [ ] App Store Connect → New App con bundle `es.egoera.diario`
- [ ] Privacy Policy URL: https://egoera.es/diario/privacidad
- [ ] Support URL: https://egoera.es/contacto
- [ ] Marketing URL: https://egoera.es
- [ ] Age rating: 12+ (sin contenido sensible más allá de salud mental)
- [ ] Privacy Manifest: declarar que NO se recogen datos del usuario
  (`NSPrivacyCollectedDataTypes` vacío)
- [ ] Build → Xcode Archive → Upload to App Store Connect
- [ ] Submit for Review

### Android · Google Play Console

- [ ] Cuenta Google Play Console (25 USD único)
- [ ] App created con package `es.egoera.diario`
- [ ] Privacy Policy URL: https://egoera.es/diario/privacidad
- [ ] Data safety: declarar "no se recogen datos"
- [ ] Content rating: PEGI 12 / IARC ESRB Teen
- [ ] Target API level: 34+ (Android 14)
- [ ] Build → `npx cap sync android` → Android Studio → Build →
  Generate Signed Bundle (.aab) → Upload
- [ ] Internal testing track primero, luego production

## Build commands

```bash
# Web build
npm run build
npm run start                # local prod

# PWA: ya configurado, deploy a Vercel = PWA viva
git push origin main         # auto-deploy en Vercel

# Capacitor (one-time setup)
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard
npm install @capacitor/local-notifications @capacitor/preferences
# Para export estático compatible con cap:
# Editar next.config.ts → output: "export" (en branch separada si rompe SSR)

npx cap init                 # ya hay capacitor.config.ts
npx cap add ios
npx cap add android
npx cap sync                 # cada vez que cambies código web

# iOS release
npx cap open ios             # → Xcode → Archive
# Android release
npx cap open android         # → Android Studio → Generate Signed Bundle
```

## Roadmap post-launch

- v1.1: voice memos (mic permission)
- v1.2: photo attachments (camera permission)
- v1.3: backup cifrado opcional (vía iCloud/Drive del usuario, no servidor propio)
- v1.4: widgets de iOS/Android para check-in rápido
- v2.0: integración con vlog Egoera (artículos relacionados al sentimiento del día)
