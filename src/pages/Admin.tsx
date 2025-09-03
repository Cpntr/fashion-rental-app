// src\pages\Admin.tsx
import React, { useState, useEffect } from 'react';
import { fetchAboutUs, updateAboutUs } from '../api/aboutUs';
import { fetchAllDresses, createDress, updateDress, deleteDress } from '../api/dresses';
import { fetchAllSlides, createSlide, updateSlide, deleteSlide } from '../api/slides';
import type { AboutUsContent } from '../types/aboutUs';
import type { Dress } from '../types/dress';
import type { Slide } from '../types/slide';
// src/pages/Admin.tsx
import { login as doLogin, isAuthenticated, logout as doLogout } from '../utils/login';

// Pull the individual admin section components into the main admin page.  By
// delegating the rendering of the About Us, Dresses and Slides editors to
// their own components we keep this file focused on data fetching and
// high‑level state management.  The child components encapsulate the
// styling and form controls for their respective sections.
import AdminAbout from '../components/admin/AdminAbout';
import AdminDresses from '../components/admin/AdminDresses';
import AdminSlides from '../components/admin/AdminSlides';

/**
 * SHA-256 hash of the admin password "Cpsharma@123". We store only the hash
 * in code so that the plain text password never appears in the bundle. You
 * can generate your own hash using a similar approach in the browser.
 */
const PASSWORD_HASH = '935472f30343c0b5405018a84e434709bff07685825d82d842e3973aa2b4cc8a';

/**
 * Admin dashboard for managing About Us content, dresses and slides. The UI
 * displays a simple password prompt. Once authenticated, it loads data from
 * the backend and provides forms to edit and save changes. All API
 * interactions are handled through helper functions in the `src/api` folder.
 */
const Admin: React.FC = () => {
  // Authentication state
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());

  // Which section is currently being edited: about, dresses or slides
  const [section, setSection] = useState<'about' | 'dresses' | 'slides'>('about');

  // Data loaded from the backend
  const [aboutData, setAboutData] = useState<AboutUsContent | null>(null);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);

  // Local editing state for About Us
  const [aboutEdit, setAboutEdit] = useState<AboutUsContent | null>(null);
  // Local editing state for a new dress and new slide
  const [newDress, setNewDress] = useState<Omit<Dress, 'id'>>({
    name: '',
    description: '',
    price: 0,
    type: '',
    images: '',
    rating: 0,
    reviews: 0,
  });
  const [newSlide, setNewSlide] = useState<Omit<Slide, 'id'>>({
    image: '',
    title: '',
    subtitle: '',
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  /**
   * Handle login by hashing the entered password and comparing it to the
   * stored hash. If they match, mark as authenticated and load data.
   */
  const handleLogin = async () => {
    const ok = await doLogin(password);
    setPassword('');
    if (ok) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  /**
   * Load all data from the backend after authentication. This runs once
   * when authenticated changes to true.
   */
  useEffect(() => {
    if (!authenticated) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [aboutRes, dressesRes, slidesRes] = await Promise.all([
          fetchAboutUs(),
          fetchAllDresses(),
          fetchAllSlides(),
        ]);
        setAboutData(aboutRes);
        setAboutEdit({ ...aboutRes });
        setDresses(dressesRes);
        setSlides(slidesRes);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [authenticated]);

  /**
   * Update local state when editing About Us fields.
   */
  const handleAboutChange = (field: keyof AboutUsContent, value: any) => {
    setAboutEdit((prev) => {
      if (!prev) return prev;
      const updated: AboutUsContent = { ...prev, [field]: value };
      return updated;
    });
  };

  const handleAboutStoryChange = (index: number, value: string) => {
    setAboutEdit((prev) => {
      if (!prev) return prev;
      const newStory = [...prev.story];
      newStory[index] = value;
      return { ...prev, story: newStory };
    });
  };

  const handleAboutSave = async () => {
    if (!aboutEdit) return;
    setLoading(true);
    try {
      const saved = await updateAboutUs(aboutEdit);
      setAboutData(saved);
      setAboutEdit({ ...saved });
      alert('About Us updated successfully');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to update About Us');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout by clearing authentication and sensitive states
   */
  const handleLogout = () => {
    doLogout(); 
    setAuthenticated(false);
    setPassword('');
    setAboutData(null);
    setAboutEdit(null);
    setDresses([]);
    setSlides([]);
    setSection('about');
  };

  /**
   * Helpers for handling dresses edits.
   */
  const handleDressChange = (index: number, field: keyof Omit<Dress, 'id'>, value: any) => {
    setDresses((prev) => {
      const updated = [...prev];
      const d = { ...updated[index] };
      // The images field can be a comma‑separated string from a text box or an array
      // of strings representing data URLs.  We normalise everything to an
      // array of strings for consistency.  The AdminDresses component handles
      // converting FileList instances into data URLs before invoking this
      // callback, so here we only need to deal with strings and arrays.
      if (field === 'images') {
        let images: string[];
        if (typeof value === 'string') {
          images = value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (Array.isArray(value)) {
          images = value as string[];
        } else {
          // fall back: unknown type, attempt to cast
          images = (value as any) || [];
        }
        (d as any).images = images;
      } else if (field === 'price' || field === 'rating' || field === 'reviews') {
        (d as any)[field] = Number(value);
      } else {
        (d as any)[field] = value;
      }
      updated[index] = d;
      return updated;
    });
  };

  const handleDressSave = async (index: number) => {
    const dress = dresses[index];
    setLoading(true);
    try {
      const saved = await updateDress(dress.id, {
        name: dress.name,
        description: dress.description,
        price: dress.price,
        type: dress.type,
        images: Array.isArray(dress.images) ? dress.images : dress.images ? [dress.images] : [],
        rating: dress.rating,
        reviews: dress.reviews,
      });
      setDresses((prev) => {
        const updated = [...prev];
        updated[index] = saved;
        return updated;
      });
      alert('Dress updated');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to update dress');
    } finally {
      setLoading(false);
    }
  };

  const handleDressDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dress?')) return;
    setLoading(true);
    try {
      await deleteDress(id);
      setDresses((prev) => prev.filter((d) => d.id !== id));
      alert('Dress deleted');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to delete dress');
    } finally {
      setLoading(false);
    }
  };

  const handleDressAdd = async () => {
    // Validate new dress fields
    if (!newDress.name.trim() || !newDress.description.trim() || !newDress.type.trim()) {
      alert('Name, description and type are required');
      return;
    }
    setLoading(true);
    try {
      const imagesPayload = Array.isArray(newDress.images)
        ? (newDress.images as any[])
        : newDress.images
        ? [newDress.images as any]
        : [];
      const payload = {
        name: newDress.name,
        description: newDress.description,
        price: Number(newDress.price),
        type: newDress.type,
        images: imagesPayload,
        rating: Number(newDress.rating),
        reviews: Number(newDress.reviews),
      };
      const created = await createDress(payload as any);
      setDresses((prev) => [...prev, created]);
      setNewDress({
        name: '',
        description: '',
        price: 0,
        type: '',
        images: '',
        rating: 0,
        reviews: 0,
      });
      alert('Dress added');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to add dress');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helpers for handling slide edits.
   */
  const handleSlideChange = (index: number, field: keyof Omit<Slide, 'id'>, value: any) => {
    setSlides((prev) => {
      const updated = [...prev];
      const s = { ...updated[index], [field]: value };
      updated[index] = s;
      return updated;
    });
  };

  const handleSlideSave = async (index: number) => {
    const slide = slides[index];
    setLoading(true);
    try {
      const saved = await updateSlide(slide.id, {
        image: slide.image,
        title: slide.title,
        subtitle: slide.subtitle,
      });
      setSlides((prev) => {
        const updated = [...prev];
        updated[index] = saved;
        return updated;
      });
      alert('Slide updated');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to update slide');
    } finally {
      setLoading(false);
    }
  };

  const handleSlideDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    setLoading(true);
    try {
      await deleteSlide(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      alert('Slide deleted');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to delete slide');
    } finally {
      setLoading(false);
    }
  };

  const handleSlideAdd = async () => {
    if (!newSlide.image.trim() || !newSlide.title.trim()) {
      alert('Image URL and title are required');
      return;
    }
    setLoading(true);
    try {
      const created = await createSlide({
        image: newSlide.image,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
      });
      setSlides((prev) => [...prev, created]);
      setNewSlide({ image: '', title: '', subtitle: '' });
      alert('Slide added');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to add slide');
    } finally {
      setLoading(false);
    }
  };

  // Render login form if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            className="w-full p-3 border rounded-lg mb-4"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  // Display error if any
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Top navigation buttons to switch between sections */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            section === 'about' ? 'bg-pink-500 text-white' : 'bg-white'
          }`}
          onClick={() => setSection('about')}
        >
          About Us
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            section === 'dresses' ? 'bg-pink-500 text-white' : 'bg-white'
          }`}
          onClick={() => setSection('dresses')}
        >
          Dresses
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            section === 'slides' ? 'bg-pink-500 text-white' : 'bg-white'
          }`}
          onClick={() => setSection('slides')}
        >
          Slides
        </button>

        <button
          className="ml-auto px-4 py-2 rounded-lg shadow bg-red-500 text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Render the appropriate section using the extracted components */}
      {section === 'about' && aboutEdit && (
        <AdminAbout
          about={aboutEdit}
          onFieldChange={handleAboutChange}
          onStoryChange={handleAboutStoryChange}
          onSave={handleAboutSave}
          setAbout={setAboutEdit}
        />
      )}

      {section === 'dresses' && (
        <AdminDresses
          dresses={dresses}
          onChange={handleDressChange}
          onSave={handleDressSave}
          onDelete={handleDressDelete}
          newDress={newDress}
          setNewDress={setNewDress}
          onAdd={handleDressAdd}
        />
      )}

      {section === 'slides' && (
        <AdminSlides
          slides={slides}
          newSlide={newSlide}
          setNewSlide={setNewSlide}
          onChange={handleSlideChange}
          onSave={handleSlideSave}
          onDelete={handleSlideDelete}
          onAdd={handleSlideAdd}
        />
      )}
    </div>
  );
};

export default Admin;
