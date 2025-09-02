//src\components\admin\AdminAbout.tsx

import React, { useState } from 'react';
import type { AboutUsContent } from '../../types/aboutUs';

interface Props {
  about: AboutUsContent;
  onFieldChange: (field: keyof AboutUsContent, value: any) => void;
  onStoryChange: (index: number, value: string) => void;
  onSave: () => void;
  setAbout: React.Dispatch<React.SetStateAction<AboutUsContent | null>>;
}

const AdminAbout: React.FC<Props> = ({ about, onFieldChange, onStoryChange, onSave, setAbout }) => {
  // Preview for uploaded image; initialise with existing image
  const [imagePreview, setImagePreview] = useState<string>(about.image);

  // Handle image file selection. Prevent extremely large files from being
  // processed to avoid server payload errors. Accept only the first file.
  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB limit
    if (file.size > MAX_SIZE_BYTES) {
      alert('Please choose an image smaller than 1MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      onFieldChange('image', result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Edit About Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
          />
        </div>
        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.subtitle}
            onChange={(e) => onFieldChange('subtitle', e.target.value)}
          />
        </div>
        {/* Image uploader */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          {imagePreview && (
            <div className="mt-2 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="preview"
                className="w-20 h-20 object-cover rounded shadow"
              />
              <span className="text-xs text-gray-600">Image preview</span>
            </div>
          )}
        </div>
        {/* Story paragraphs */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Story paragraphs</label>
          {about.story.map((para, i) => (
            <input
              key={i}
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={para}
              onChange={(e) => onStoryChange(i, e.target.value)}
            />
          ))}
        </div>
        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={about.contact.email}
            onChange={(e) =>
              setAbout((prev) =>
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
        {/* Contact Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.contact.phone}
            onChange={(e) =>
              setAbout((prev) =>
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
        {/* Contact Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.contact.address}
            onChange={(e) =>
              setAbout((prev) =>
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
      </div>
      <button
        className="mt-6 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        onClick={onSave}
      >
        Save About Us
      </button>
    </div>
  );
};

export default AdminAbout;
