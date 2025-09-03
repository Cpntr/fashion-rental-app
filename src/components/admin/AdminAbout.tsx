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
  // Local state for showing a preview of the uploaded image.  This is
  // independent of the stored `about.image` field so that the user can
  // see the selected picture immediately.
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file selection for the image.  Compress the image to keep
  // payload sizes reasonable and update both the preview and the About
  // content via onFieldChange.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Limit file size to around 1MB for server friendliness
    if (file.size > 1024 * 1024) {
      alert('Please choose a file smaller than 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(dataUrl);
          // Update the About image via the provided callback
          onFieldChange('image', dataUrl);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Edit About Us</h2>
      {/*
        We use a responsive grid to organise form fields.  On small
        screens the form stacks in one column.  On medium screens
        (≥768px) it uses two columns, and on large screens (≥1024px)
        three columns.  Fields that should span across all columns use
        `col-span-full` so they take up the full width of the grid.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
          />
        </div>
        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Subtitle</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.subtitle}
            onChange={(e) => onFieldChange('subtitle', e.target.value)}
          />
        </div>
        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={about.image}
            onChange={(e) => onFieldChange('image', e.target.value)}
          />
        </div>
        {/* Upload Image button and preview; spans full width */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <div>
            {/* Hidden input */}
            <input
              type="file"
              accept="image/*"
              id="about-upload"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Styled button that triggers file chooser */}
            <label
              htmlFor="about-upload"
              className="inline-block bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600"
            >
              Choose File
            </label>
            {/* Preview the uploaded image or current image field */}
            {imagePreview || about.image ? (
              <img
                src={(imagePreview ?? about.image) as string}
                alt="Preview"
                className="mt-2 h-32 object-contain rounded"
              />
            ) : null}
          </div>
        </div>
        {/* Story paragraphs; spans full width */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Story paragraphs</label>
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
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
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
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Address</label>
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
        {/* Save button; spans full width */}
        <div className="col-span-full">
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={onSave}
          >
            Save About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
