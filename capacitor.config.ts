// @ts-expect-error - @capacitor/cli is installed only when wrapping the app for native builds
import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Egoera Diario — Capacitor configuration for native iOS + Android shells.
 *
 * Setup (one-time, requires Xcode + Android Studio):
 *   npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
 *   npx cap init "Egoera Diario" "es.egoera.diario" --web-dir out
 *   npm run build && npx next export -o out  # or use a static export config
 *   npx cap add ios && npx cap add android
 *   npx cap sync
 *   npx cap open ios       # opens Xcode
 *   npx cap open android   # opens Android Studio
 *
 * Build & release:
 *   - iOS: open in Xcode → Product → Archive → upload to App Store Connect
 *   - Android: open in Android Studio → Build → Generate Signed Bundle (.aab) → upload to Play Console
 *
 * Or use the live-server pattern (server.url) to point to the deployed Vercel URL
 * during development for hot-reload. Disable for production builds.
 */
const config: CapacitorConfig = {
  appId: "es.egoera.diario",
  appName: "Egoera Diario",
  webDir: "out",
  bundledWebRuntime: false,
  backgroundColor: "#f1ead8",
  ios: {
    contentInset: "automatic",
    backgroundColor: "#f1ead8",
    preferredContentMode: "mobile",
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  android: {
    backgroundColor: "#f1ead8",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#f1ead8",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      spinnerColor: "#1d2bdb",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#f1ead8",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      style: "LIGHT",
      resizeOnFullScreen: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#1d2bdb",
      sound: "beep.wav",
    },
  },
};

export default config;
