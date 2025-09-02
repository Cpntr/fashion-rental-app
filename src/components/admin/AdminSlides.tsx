// src/components for Admin slides section
// This component encapsulates the logic for managing slides in the
// admin dashboard. The parent page passes in the list of slides and
// callback handlers for creating, updating and deleting a slide. Each
// slide has an image URL, title and optional subtitle. The design is
// inspired by the home page cards for visual consistency.

import React, { useState } from 'react';
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
  return (
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
          onClick={onAdd}
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
              onChange={(e) => onChange(idx, 'image', e.target.value)}
            />
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
