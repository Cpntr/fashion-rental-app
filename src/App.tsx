// src\App.tsx
import React, { Suspense } from 'react';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';

/**
 * Top-level application component. Conditionally renders the admin dashboard
 * when the pathname is `/admin`, otherwise shows the home page. A Suspense
 * boundary provides a fallback while lazy components are loading.
 */
const App: React.FC = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading…</div>}>
      {path === '/admin' ? <Admin /> : <HomePage />}
    </Suspense>
  );
};

export default App;
