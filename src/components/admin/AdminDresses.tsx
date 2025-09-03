// src/components/admin/AdminDresses.tsx
// This component manages the dresses in the admin dashboard. It includes a
// search field to quickly find a dress, a form for adding new dresses and
// edit cards for existing dresses. It leverages the DRESS_TYPES list for
// the type dropdown and provides a simple star rating selector similar
// to the FilterPanel component. It also supports uploading multiple
// images with previews and removing individual images.

import React, { useState } from 'react';
// Import the list of dress types from the shared constants.  Keeping the list
// centralised makes it easy to update or extend in one place and reuse the
// same values across the filter panel and admin forms.
import { DRESS_TYPES } from '../../types/dressTypes';
import type { Dress } from '../../types/dress';

interface Props {
  dresses: Dress[];
  onChange: (index: number, field: keyof Omit<Dress, 'id'>, value: any) => void;
  onSave: (index: number) => void;
  onDelete: (id: number) => void;
  newDress: Omit<Dress, 'id'>;
  setNewDress: React.Dispatch<React.SetStateAction<Omit<Dress, 'id'>>>;
  onAdd: () => void;
}

const AdminDresses: React.FC<Props> = ({
  dresses,
  onChange,
  onSave,
  onDelete,
  newDress,
  setNewDress,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Convert a FileList into an array of data URLs.  This helper returns a
  // promise that resolves with an array of strings once all files have been
  // read.  It is used both when adding a new dress and when attaching
  // additional images to an existing dress.
  const fileListToDataUrls = (files: FileList) => {
    const readers: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        }),
      );
    });
    return Promise.all(readers);
  };

  // Handle file uploads for the new dress. Converts files into data URLs for
  // previewing and stores them in newDress.images.
  const handleNewImagesChange = (files: FileList | null) => {
    if (!files) return;
    fileListToDataUrls(files).then((images) => {
      // Replace any existing previews when uploading new files
      setNewDress((prev) => ({ ...prev, images: images as unknown as any }));
    });
  };

  // Remove an image from the new dress preview
  const removeNewImage = (idx: number) => {
    const imgs = Array.isArray((newDress as any).images)
      ? ([...(newDress as any).images] as string[])
      : [];
    imgs.splice(idx, 1);
    setNewDress((prev) => ({ ...prev, images: imgs as unknown as any }));
  };

  // Filter dresses by search term
  const filtered = dresses.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="bg-white p-4 rounded-xl shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Dresses</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add new dress form */}
      <div className="bg-white p-6 rounded-xl shadow ">
        <h2 className="text-xl font-bold mb-4">Add New Dress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Name"
            value={newDress.name}
            onChange={(e) => setNewDress({ ...newDress, name: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={newDress.type}
            onChange={(e) => setNewDress({ ...newDress, type: e.target.value })}
          >
            <option value="">Select Type</option>
            {DRESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Price"
            value={newDress.price}
            onChange={(e) => setNewDress({ ...newDress, price: Number(e.target.value) })}
          />
          {/* Rating selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => {
              const active = newDress.rating === n;
              const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium transition';
              const activeClasses = active
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNewDress({ ...newDress, rating: active ? 0 : n })}
                  className={`${baseClasses} ${activeClasses}`}
                >
                  {n}★
                </button>
              );
            })}
          </div>
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Reviews"
            value={newDress.reviews}
            onChange={(e) => setNewDress({ ...newDress, reviews: Number(e.target.value) })}
          />

          {/* ===== Button-style file input for NEW dress images ===== */}
          <div className="col-span-full">
            {/* Hidden input */}
            <input
              type="file"
              id="new-dress-images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleNewImagesChange(e.target.files)}
            />
            {/* Button-style trigger */}
            <label
              htmlFor="new-dress-images"
              className="inline-block bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600"
            >
              Choose Files
            </label>
            {/* Selected count / helper text */}
            {Array.isArray((newDress as any).images) && (newDress as any).images.length > 0 ? (
              <span className="ml-3 text-sm text-gray-600">
                {(newDress as any).images.length} file(s) selected
              </span>
            ) : (
              <span className="ml-3 text-sm text-gray-400">No files selected</span>
            )}
          </div>

          <textarea
            className="p-2 border rounded col-span-full"
            placeholder="Description"
            value={newDress.description}
            onChange={(e) => setNewDress({ ...newDress, description: e.target.value })}
          />
        </div>

        {/* Preview of new images */}
        {Array.isArray((newDress as any).images) && (newDress as any).images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {(newDress as any).images.map((img: string, i: number) => (
              <div key={i} className="relative w-24 h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`preview-${i}`}
                  className="object-cover w-full h-full rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label={`Remove image ${i + 1}`}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={onAdd}
        >
          Add Dress
        </button>
      </div>

      {/* Existing dresses */}
      {filtered.map((dress) => {
        const origIndex = dresses.findIndex((d) => d.id === dress.id);
        const imageCount = Array.isArray(dress.images) ? dress.images.length : dress.images ? 1 : 0;

        return (
          <div key={dress.id} className="bg-white p-6 rounded-xl shadow space-y-4 ">
            <h3 className="font-semibold text-lg">Edit Dress #{dress.id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                className="p-2 border rounded"
                value={dress.name}
                onChange={(e) => onChange(origIndex, 'name', e.target.value)}
              />
              <select
                className="p-2 border rounded"
                value={dress.type}
                onChange={(e) => onChange(origIndex, 'type', e.target.value)}
              >
                <option value="">Select Type</option>
                {DRESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="p-2 border rounded"
                value={dress.price}
                onChange={(e) => onChange(origIndex, 'price', Number(e.target.value))}
              />
              {/* Rating selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rating:</span>
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = dress.rating === n;
                  const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium transition';
                  const activeClasses = active
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onChange(origIndex, 'rating', active ? 0 : n)}
                      className={`${baseClasses} ${activeClasses}`}
                    >
                      {n}★
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                className="p-2 border rounded"
                value={dress.reviews}
                onChange={(e) => onChange(origIndex, 'reviews', Number(e.target.value))}
              />

              {/* ===== Button-style file input to ADD images to this existing dress ===== */}
              <div className="col-span-full">
                {/* Hidden input */}
                <input
                  type="file"
                  id={`dress-${dress.id}-images`}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    fileListToDataUrls(files).then((newImages) => {
                      // Append to existing images (normalize non-array to array)
                      const existing = Array.isArray(dress.images)
                        ? (dress.images as string[])
                        : dress.images
                        ? [dress.images as string]
                        : [];
                      const combined = [...existing, ...newImages];
                      onChange(origIndex, 'images', combined);
                    });
                  }}
                />
                {/* Button-style trigger */}
                <label
                  htmlFor={`dress-${dress.id}-images`}
                  className="inline-block bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600"
                >
                  Add Images
                </label>
                <span className="ml-3 text-sm text-gray-600">{imageCount} image(s)</span>
              </div>

              <textarea
                className="p-2 border rounded col-span-full"
                value={dress.description}
                onChange={(e) => onChange(origIndex, 'description', e.target.value)}
              />
            </div>

            {/* Preview images with remove option */}
            {dress.images && Array.isArray(dress.images) && dress.images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {dress.images.map((img: any, i: number) => (
                  <div key={i} className="relative w-24 h-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`preview-${i}`}
                      className="object-cover w-full h-full rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(dress.images as any[])];
                        arr.splice(i, 1);
                        onChange(origIndex, 'images', arr);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      aria-label={`Remove image ${i + 1}`}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => onSave(origIndex)}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => onDelete(dress.id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDresses;
