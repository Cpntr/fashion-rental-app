// src/main.tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import './index.css';
import { registerSW } from "virtual:pwa-register";

registerSW(); // Register Service Worker for PWA

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
