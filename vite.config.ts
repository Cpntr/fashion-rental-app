// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    /* ───────────────────────── PWA ───────────────────────── */
    VitePWA({
      registerType: 'prompt',

      // Make SW run while `vite dev` is running
      devOptions: {
        enabled: true,
        navigateFallback: '/', // ok for dev; for prod, Workbox handles SPA fallback below
        suppressWarnings: true,
        // If you hit typing complaints here, remove the next line or ensure you're on a recent vite-plugin-pwa
        // type: "module",
      },

      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],

      manifest: {
        name: 'Fashion Rental',
        short_name: 'FashionRental',
        description: 'Rent stunning outfits with style!',
        theme_color: '#ec4899',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
      },

      workbox: {
        // `globDirectory` is optional with vite-plugin-pwa; including it is still valid.
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,wasm,css,html}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],

  // ✅ must be top-level, not inside `plugins`
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
