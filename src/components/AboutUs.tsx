// src\components\AboutUs.tsx
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const AboutUs: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">About Fashion Rental</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to Fashion Rental by Iti Vashistha
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We are your premier destination for exquisite dress rentals in India…
            </p>
            <p className="text-gray-600 leading-relaxed">
              Founded with the vision of making fashion accessible and sustainable…
            </p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 rounded-xl text-white">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="mr-3" size={20} />
                <span>contact@fashionrental.in</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3" size={20} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-3" size={20} />
                <span>Fashion Street, Mumbai, Maharashtra 400001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs;
