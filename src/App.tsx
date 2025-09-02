// src\App.tsx
import React, { Suspense } from "react";
import HomePage from "./pages/HomePage";

const App: React.FC = () => (
  <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading…</div>}>
    <HomePage />
  </Suspense>
);

export default App;
