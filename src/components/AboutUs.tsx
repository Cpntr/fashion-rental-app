// src/components/AboutUs.tsx
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const AboutUs: React.FC = () => (
  <section className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-6xl mx-auto px-4">
      {/* outer card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-pink-600 tracking-tight py-10">
          About Fashion Rental
        </h1>

        {/* main content */}
        <div className="grid lg:grid-cols-3 gap-8 px-8 pb-12">
          {/* ───────── Left column : portrait ───────── */}
          <div className="flex justify-center lg:justify-start">
            <img
              src="/profile-pic1.jpg"
              alt="Iti Vashistha"
              className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-full ring-4 ring-pink-500/30 shadow-lg"
            />
          </div>

          {/* ───────── Middle column : story ───────── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to Fashion Rental by Iti Vashistha
            </h2>

            <p className="text-gray-600 leading-relaxed">
              We are your premier destination for exquisite dress rentals in India. From
              traditional Indian wear to contemporary Western outfits, we offer a curated
              collection of stunning dresses for every occasion.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Founded with the vision of making fashion accessible <span className="whitespace-nowrap">and sustainable,</span>
              Fashion Rental brings you designer wear at affordable prices. Whether it’s a
              wedding, party, or special event, we have the perfect outfit for you.
            </p>
          </div>
        </div>

        {/* contact card */}
        <div className="mx-8 mb-10 lg:mx-12">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

            <ul className="space-y-4 text-sm md:text-base">
              <li className="flex items-center">
                <Mail size={20} className="mr-4 shrink-0" />
                contact@fashionrental.in
              </li>

              <li className="flex items-center">
                <Phone size={20} className="mr-4 shrink-0" />
                +91 98765 43210
              </li>

              <li className="flex items-center">
                <MapPin size={20} className="mr-4 shrink-0" />
                Fashion Street, Mumbai, Maharashtra 400001
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
