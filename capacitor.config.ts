import { CapacitorConfig } from "@capacitor/core";

const config: CapacitorConfig = {
  appId: "com.osama.ostazy",
  appName: "أستاذي",
  webDir: "dist",
  server: {
    androidScheme: "https",
    // تأكد أن الـ iosScheme يطابق ما وضعته في إعدادات Xcode (URL Types)
    iosScheme: "com.osama.ostazy",
    allowNavigation: [
      "ostazy.net",
      "*.supabase.co", // مهم جداً للسماح بالاتصال بـ Supabase Auth
    ],
  },
  // إعدادات الـ Google Auth الأساسية
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "561362297890-pdn7p0hscm8vo1o91na4l4rro3p4sq5g.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
    Assets: {
      inputs: {
        icon: "assets/icon.png", // تأكد من وجود الصورة هنا
        splash: "assets/icon.png", // تأكد من وجود صورة الـ Splash هنا
      },
    },
  },
};

export default config;
