import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // بيحدث التطبيق فوراً عند وجود تغيير
      workbox: {
        // إضافة الـ Assets العادية للكاش
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        runtimeCaching: [
          {
            // 1. كاش لصور Cloudinary (Strategy: CacheFirst)
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images",
              expiration: {
                maxEntries: 100, // يحفظ آخر 100 صورة
                maxAgeSeconds: 60 * 60 * 24 * 30, // لمدة شهر
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 2. كاش لداتا Supabase (Strategy: NetworkFirst)
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api-data",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // لمدة يوم واحد
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      // اختياري: إضافة المانيفست عشان شكل التطبيق في الموبايل
      manifest: {
        name: "Ostazy App",
        short_name: "Ostazy",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
