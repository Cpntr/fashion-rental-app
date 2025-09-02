// src\pages\Admin.tsx
import React, { useState } from 'react';
import { fetchAboutUs, updateAboutUs } from '../api/aboutUs';
import { fetchAllDresses, createDress, updateDress, deleteDress } from '../api/dresses';
import { fetchAllSlides, createSlide, updateSlide, deleteSlide } from '../api/slides';
import type { AboutUsContent } from '../types/aboutUs';
import type { Dress } from '../types/dress';
import type { Slide } from '../types/slide';

// SHA-256 hash of "Cpsharma@123"
const PASSWORD_HASH = '935472f30343c0b5405018a84e434709bff07685825d82d842e3973aa2b4cc8a';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState<'about' | 'dresses' | 'slides'>('about');
  // state for about, dresses, slides...

  const handleLogin = async () => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hash === PASSWORD_HASH) {
      setAuthenticated(true);
      // fetch data here
    } else {
      alert('Incorrect password');
    }
    setPassword('');
  };

  if (!authenticated) {
    return (
      <div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      {/* Tab buttons */}
      <div>
        <button onClick={() => setSection('about')}>About Us</button>
        <button onClick={() => setSection('dresses')}>Dresses</button>
        <button onClick={() => setSection('slides')}>Slides</button>
      </div>

      {/* About Us form, Dresses list, Slides list */}
      {section === 'about' && /* render About Us editor */ }
      {section === 'dresses' && /* render dresses manager */ }
      {section === 'slides' && /* render slides manager */ }
    </div>
  );
};

export default Admin;
