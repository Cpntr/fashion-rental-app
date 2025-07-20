// src\components\FilterPanel.tsx
import React from "react";
import { Filter, Search } from "lucide-react";
import { DRESS_TYPES } from "../constants/dressTypes";
import type { Filters } from "../types/dress";


interface Props {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | number) => void;
  isMobile?: boolean;
}

const FilterPanel: React.FC<Props> = ({ filters, onFilterChange, isMobile = false }) => (
 <div
    className={`bg-white rounded-2xl shadow-lg p-6 ${
      isMobile ? "" : "lg:sticky lg:top-32"
    }`}
  >
    {/* title */}
    <div className="flex items-center gap-2 mb-6">
      <Filter className="text-pink-500" size={20} />
      <h3 className="text-lg font-bold text-gray-800">Filters</h3>
    </div>

    {/* form groups */}
    <div className="space-y-6">
      {/* ───── search ───── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Dresses
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search dresses…"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-pink-500 focus:border-transparent
                       outline-none text-sm"
          />
        </div>
      </div>

      {/* ───── type ───── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dress Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-pink-500 focus:border-transparent
                     outline-none text-sm"
        >
          <option value="">All Types</option>
                 {DRESS_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                       ))}
          </select>
      </div>

      {/* ───── price range ───── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range: ₹{filters.minPrice} – ₹{filters.maxPrice}
        </label>
        <input
          type="range"
          min={0}
          max={10000}
          value={filters.minPrice}
          onChange={(e) => onFilterChange("minPrice", +e.target.value)}
          className="w-full accent-pink-500 mt-1"
        />
        <input
          type="range"
          min={0}
          max={10000}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange("maxPrice", +e.target.value)}
          className="w-full accent-pink-500 mt-2"
        />
      </div>

      {/* ───── rating ───── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() =>
                onFilterChange("rating", filters.rating === n ? 0 : n)
              }
              className={`px-3 py-1 rounded-full text-sm font-medium transition
                ${
                  filters.rating === n
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {n}★
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FilterPanel;
