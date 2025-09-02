// src\pages\Admin.tsx
import React, { useState, useEffect } from 'react';
import { fetchAboutUs, updateAboutUs } from '../api/aboutUs';
import { fetchAllDresses, createDress, updateDress, deleteDress } from '../api/dresses';
import { fetchAllSlides, createSlide, updateSlide, deleteSlide } from '../api/slides';
import type { AboutUsContent } from '../types/aboutUs';
import type { Dress } from '../types/dress';
import type { Slide } from '../types/slide';

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
  const [authenticated, setAuthenticated] = useState(false);

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

  /**
   * Handle login by hashing the entered password and comparing it to the
   * stored hash. If they match, mark as authenticated and load data.
   */
  const handleLogin = async () => {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      if (hash === PASSWORD_HASH) {
        setAuthenticated(true);
      } else {
        alert('Incorrect password');
      }
    } finally {
      setPassword('');
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
   * Helpers for handling dresses edits.
   */
  const handleDressChange = (index: number, field: keyof Omit<Dress, 'id'>, value: any) => {
    setDresses((prev) => {
      const updated = [...prev];
      const d = { ...updated[index] };
      // Images is string | string[]; convert string to string[] when editing
      if (field === 'images') {
        // Accept comma-separated list or single string
        const arr =
          typeof value === 'string'
            ? value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : value;
        (d as any).images = arr;
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
      const payload = {
        name: newDress.name,
        description: newDress.description,
        price: Number(newDress.price),
        type: newDress.type,
        images: newDress.images ? [newDress.images] : [],
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
      </div>

      {/* About Us editor */}
      {section === 'about' && aboutEdit && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Edit About Us</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutEdit.title}
                onChange={(e) => handleAboutChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutEdit.subtitle}
                onChange={(e) => handleAboutChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutEdit.image}
                onChange={(e) => handleAboutChange('image', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Story paragraphs</label>
              {aboutEdit.story.map((para, i) => (
                <input
                  key={i}
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  value={para}
                  onChange={(e) => handleAboutStoryChange(i, e.target.value)}
                />
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={aboutEdit.contact.email}
                onChange={(e) =>
                  setAboutEdit((prev) =>
                    prev
                      ? {
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value },
                        }
                      : prev,
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutEdit.contact.phone}
                onChange={(e) =>
                  setAboutEdit((prev) =>
                    prev
                      ? {
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value },
                        }
                      : prev,
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutEdit.contact.address}
                onChange={(e) =>
                  setAboutEdit((prev) =>
                    prev
                      ? {
                          ...prev,
                          contact: { ...prev.contact, address: e.target.value },
                        }
                      : prev,
                  )
                }
              />
            </div>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              onClick={handleAboutSave}
            >
              Save About Us
            </button>
          </div>
        </div>
      )}

      {/* Dresses manager */}
      {section === 'dresses' && (
        <div className="space-y-6">
          {/* Add new dress form */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Add New Dress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Name"
                value={newDress.name}
                onChange={(e) => setNewDress({ ...newDress, name: e.target.value })}
              />
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Type"
                value={newDress.type}
                onChange={(e) => setNewDress({ ...newDress, type: e.target.value })}
              />
              <input
                type="number"
                className="p-2 border rounded"
                placeholder="Price"
                value={newDress.price}
                onChange={(e) => setNewDress({ ...newDress, price: Number(e.target.value) })}
              />
              <input
                type="number"
                className="p-2 border rounded"
                placeholder="Rating"
                value={newDress.rating}
                onChange={(e) => setNewDress({ ...newDress, rating: Number(e.target.value) })}
              />
              <input
                type="number"
                className="p-2 border rounded"
                placeholder="Reviews"
                value={newDress.reviews}
                onChange={(e) => setNewDress({ ...newDress, reviews: Number(e.target.value) })}
              />
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Image URL"
                value={newDress.images as string}
                onChange={(e) => setNewDress({ ...newDress, images: e.target.value })}
              />
              <textarea
                className="p-2 border rounded col-span-full"
                placeholder="Description"
                value={newDress.description}
                onChange={(e) => setNewDress({ ...newDress, description: e.target.value })}
              />
            </div>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleDressAdd}
            >
              Add Dress
            </button>
          </div>
          {/* Existing dresses */}
          {dresses.map((dress, idx) => (
            <div key={dress.id} className="bg-white p-6 rounded-xl shadow space-y-4">
              <h3 className="font-semibold text-lg">Edit Dress #{dress.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={dress.name}
                  onChange={(e) => handleDressChange(idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={dress.type}
                  onChange={(e) => handleDressChange(idx, 'type', e.target.value)}
                />
                <input
                  type="number"
                  className="p-2 border rounded"
                  value={dress.price}
                  onChange={(e) => handleDressChange(idx, 'price', Number(e.target.value))}
                />
                <input
                  type="number"
                  className="p-2 border rounded"
                  value={dress.rating}
                  onChange={(e) => handleDressChange(idx, 'rating', Number(e.target.value))}
                />
                <input
                  type="number"
                  className="p-2 border rounded"
                  value={dress.reviews}
                  onChange={(e) => handleDressChange(idx, 'reviews', Number(e.target.value))}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={
                    Array.isArray(dress.images) ? dress.images.join(', ') : (dress.images as string)
                  }
                  onChange={(e) => handleDressChange(idx, 'images', e.target.value)}
                />
                <textarea
                  className="p-2 border rounded col-span-full"
                  value={dress.description}
                  onChange={(e) => handleDressChange(idx, 'description', e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleDressSave(idx)}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDressDelete(dress.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slides manager */}
      {section === 'slides' && (
        <div className="space-y-6">
          {/* Add new slide form */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Add New Slide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Image URL"
                value={newSlide.image}
                onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
              />
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Title"
                value={newSlide.title}
                onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              />
              <input
                type="text"
                className="p-2 border rounded"
                placeholder="Subtitle"
                value={newSlide.subtitle}
                onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              />
            </div>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleSlideAdd}
            >
              Add Slide
            </button>
          </div>
          {/* Existing slides */}
          {slides.map((slide, idx) => (
            <div key={slide.id} className="bg-white p-6 rounded-xl shadow space-y-4">
              <h3 className="font-semibold text-lg">Edit Slide #{slide.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={slide.image}
                  onChange={(e) => handleSlideChange(idx, 'image', e.target.value)}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={slide.title}
                  onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={slide.subtitle}
                  onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleSlideSave(idx)}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleSlideDelete(slide.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
