# Fashion Rental — React + Vite + Tailwind PWA

> **Live demo:** *(add URL once deployed)*

Fashion Rental is a modern, fully‑responsive web application that lets users browse and rent stunning Indian & Western outfits.  It is built with the latest React 19 tooling, typed end‑to‑end with TypeScript, styled with Tailwind CSS v4, and ships as an **installable Progressive Web App (PWA)**.

---

## ✨ Features

| Category             | Highlights                                                                            |
| -------------------- | ------------------------------------------------------------------------------------- |
| **UI / UX**          | Hero image slider, infinite‑scroll dress grid, sticky filter sidebar, dark‑mode ready |
| **Mock catalogue**   | 100 curated dresses with real Unsplash thumbnails + deterministic paging for dev/demo |
| **State‑management** | Local component state, custom hooks (`useInfiniteScroll`, `useInstallPrompt`)         |
| **Performance**      | Vite 7 lightning‑fast dev server & HMR, lazy‑loaded "About Us" route, code‑splitting  |
| **PWA**              | `vite-plugin-pwa` — offline cache, install banner, Workbox runtime‑caching for images |
| **Tooling**          | TypeScript 5, ESLint 9, Prettier style hints, strict import aliases (`@/…`)           |

---

## 🏗️ Tech Stack

- **React 19** (+ hooks & lazy)
- **Vite 7** build tool
- **Tailwind CSS 4** with `@tailwindcss/vite` plugin
- **TypeScript 5.8**
- **vite‑plugin‑pwa 1.x** + `workbox-window`
- **Lucide‑React** icon set
- **ESLint v9** (+ `eslint-plugin-react-hooks`, `@typescript-eslint`)

Full dependency list lives in [`package.json`](./package.json).

---

## 📂 Project Structure (excerpt)

```text
├── public/
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── profile-pic.png
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.tsx
│   │   ├── DressCard.tsx
│   │   ├── FilterPanel.tsx
│   │   └── ImageSlider.tsx
│   ├── hooks/
│   │   ├── useInfiniteScroll.ts
│   │   └── useInstallPrompt.ts
│   ├── mocks/
│   │   └── dresses.ts          # 100‑item static catalogue
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── utils/
│   │   └── generateMockDresses.ts
│   ├── styles/
│   │   └── index.css           # Tailwind directives
│   ├── App.tsx
│   └── main.tsx
└── vite.config.ts              # Vite + Tailwind + PWA plugins
```

---

## 🚀 Getting Started

```bash
# 1. Clone
$ git clone https://github.com/your‑org/fashion‑rental.git
$ cd fashion‑rental

# 2. Install dependencies (PNPM/Yarn/npm – pick one)
$ npm install

# 3. Start dev server with HMR
$ npm run dev

# 4. Open http://localhost:5173 and start building!
```

### Available Scripts

| Command           | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot‑reload                         |
| `npm run build`   | Type‑check & generate a production build in `dist/`           |
| `npm run preview` | Locally preview the production build                          |
| `npm run lint`    | ESLint all `src/` code                                        |
| `npm run tw:init` | (One‑off) Generate `tailwind.config.js` & `postcss.config.js` |

---

## 📱 PWA Details

- **Install prompt** appears on supported browsers; users can “Add to Home Screen”.  In desktop browsers an “Install App” button is visible on the header when `beforeinstallprompt` triggers.
- **Offline support** – initial shell + previously viewed images cached via Workbox.  Feel free to tweak the `runtimeCaching` array in `vite.config.ts`.
- **Manifest** – defined inside `vite.config.ts` with theme‑colour `#ec4899` to match Tailwind `pink‑500`.

---

## 🤖 Mock Data API

`src/mocks/dresses.ts` holds a deterministic, reusable catalogue.  The helper `generateMockDresses(page, limit)` slices this array so that existing infinite‑scroll logic is untouched.  When more than 100 items are requested it gracefully falls back to random Unsplash placeholders.

---

## 🛠️ Todo / Ideas

-

---

## 📄 License

MIT © 2025 *Chandra Prakash Sharma (cpsharma.ntr@gmail.com)*

