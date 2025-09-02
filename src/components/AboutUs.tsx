// src/components/AboutUs.tsx
import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { fetchAboutUs } from '../api/aboutUs';
import type { AboutUsContent } from '../types/aboutUs';

/**
 * Dynamic About Us component.
 *
 * Fetches the About Us content from the backend on mount and displays
 * it. Falls back to nothing while loading (could be improved with a
 * loading indicator). Normalizes story paragraphs and contact details.
 */
const AboutUs: React.FC = () => {
  const [about, setAbout] = useState<AboutUsContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAboutUs();
        setAbout(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Failed to load About Us content');
      }
    })();
  }, []);

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </section>
    );
  }

  if (!about) {
    // Show nothing or a simple placeholder while loading
    return null;
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* outer card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* header */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 tracking-tight py-10">
            {about.title}
          </h1>

          {/* main content */}
          <div className="grid lg:grid-cols-3 gap-8 px-8 pb-12">
            {/* ───────── Left column : portrait ───────── */}
            <div className="flex justify-center lg:justify-start">
              <img
                src={about.image}
                alt={about.title}
                className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-full ring-4 ring-pink-500/30 shadow-lg"
              />
            </div>

            {/* ───────── Middle column : story ───────── */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">{about.subtitle}</h2>
              {about.story.map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* contact card */}
          <div className="mx-8 mb-10 lg:mx-12">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

              <ul className="space-y-4 text-sm md:text-base">
                <li className="flex items-center">
                  <Mail size={20} className="mr-4 shrink-0" />
                  {about.contact.email}
                </li>

                <li className="flex items-center">
                  <Phone size={20} className="mr-4 shrink-0" />
                  {about.contact.phone}
                </li>

                <li className="flex items-center">
                  <MapPin size={20} className="mr-4 shrink-0" />
                  {about.contact.address}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
