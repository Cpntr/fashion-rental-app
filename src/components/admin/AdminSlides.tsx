// src\components\admin\AdminSlides.tsx

import React from 'react';
import type { Slide } from '../../types/slide';

interface Props {
  slides: Slide[];
  newSlide: Omit<Slide, 'id'>;
  setNewSlide: React.Dispatch<React.SetStateAction<Omit<Slide, 'id'>>>;
  onChange: (index: number, field: keyof Omit<Slide, 'id'>, value: any) => void;
  onSave: (index: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const AdminSlides: React.FC<Props> = ({
  slides,
  newSlide,
  setNewSlide,
  onChange,
  onSave,
  onDelete,
  onAdd,
}) => {
  // Convert single file to data URL
  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

  return (
    <div className="space-y-6">
      {/* Add new slide form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Add New Slide</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Image URL (can be URL or filled by file chooser) */}
          <div className="flex flex-col">
            <input
              type="text"
              className="p-2 border rounded"
              placeholder="Image URL"
              value={newSlide.image}
              onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
            />
            {/* Button-style file chooser (single) */}
            <div className="mt-2">
              <input
                type="file"
                id="new-slide-image"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const dataUrl = await fileToDataUrl(f);
                  setNewSlide((prev) => ({ ...prev, image: dataUrl }));
                }}
              />
              <label
                htmlFor="new-slide-image"
                className="inline-block bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600"
              >
                Choose File
              </label>
              <span className="ml-3 text-sm text-gray-500">(fills the Image URL field)</span>
            </div>

            {/* Preview */}
            {newSlide.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={newSlide.image}
                alt="slide-preview"
                className="mt-3 h-24 w-40 object-cover rounded"
              />
            ) : null}
          </div>

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
          onClick={onAdd}
        >
          Add Slide
        </button>
      </div>

      {/* Existing slides */}
      {slides.map((slide, idx) => (
        <div key={slide.id} className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="font-semibold text-lg">Edit Slide #{slide.id}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Image URL + chooser + preview */}
            <div className="flex flex-col">
              <input
                type="text"
                className="p-2 border rounded"
                value={slide.image}
                onChange={(e) => onChange(idx, 'image', e.target.value)}
              />

              <div className="mt-2">
                <input
                  type="file"
                  id={`slide-${slide.id}-image`}
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const dataUrl = await fileToDataUrl(f);
                    onChange(idx, 'image', dataUrl);
                  }}
                />
                <label
                  htmlFor={`slide-${slide.id}-image`}
                  className="inline-block bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">(fills the image field)</span>
              </div>

              {/* Preview */}
              {slide.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.image}
                  alt={`slide-${slide.id}-preview`}
                  className="mt-3 h-24 w-40 object-cover rounded"
                />
              ) : null}
            </div>

            <input
              type="text"
              className="p-2 border rounded"
              value={slide.title}
              onChange={(e) => onChange(idx, 'title', e.target.value)}
            />
            <input
              type="text"
              className="p-2 border rounded"
              value={slide.subtitle}
              onChange={(e) => onChange(idx, 'subtitle', e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => onSave(idx)}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => onDelete(slide.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSlides;
