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
      // show the install prompt the first time (you can keep "prompt")
      registerType: "prompt",

      /* Make SW run while `vite dev` is running */
      devOptions: {
        enabled: true,                // ← enables SW in dev
        navigateFallback: "/"         // dev fallback
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
        theme_color: "#ec4899",       // Tailwind pink‑500
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",   //  ← no leading “/”: resolves in public/
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

      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // cache all <img> requests (Unsplash etc.)
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
});
