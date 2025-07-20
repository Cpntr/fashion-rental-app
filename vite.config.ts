// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    /* ───────────────────────── PWA ───────────────────────── */
VitePWA({
  registerType: "prompt",

  /* Make SW run while `vite dev` is running */
  devOptions: {
    enabled: true,
    navigateFallback: "/",
    suppressWarnings: true,   // ✅ suppress glob warnings
    type: "module"            // optional but resolves some module mode issues
  },

  includeAssets: [
    "favicon.svg",
    "favicon.ico",
    "robots.txt",
    "apple-touch-icon.png"
  ],

  manifest: {
    name: "Fashion Rental",
    short_name: "FashionRental",
    description: "Rent stunning outfits with style!",
    theme_color: "#ec4899",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ]
  },

  /* ✅ Add this workbox globDirectory override */
  workbox: {
    globDirectory: "dist", // 🔧 fixes the warning
    globPatterns: ["**/*.{js,wasm,css,html}"],

    navigateFallback: "/index.html",
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === "image",
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24 * 30
          }
        }
      }
    ]
  }
})

  ]
});
