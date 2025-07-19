// src\utils\generateMockDresses.ts

// src\utils\generateMockDresses.ts
import type { Dress } from "../types/dress";

export const generateMockDresses = (page: number, limit = 12): Dress[] => {
  const types = [
    "Indian Traditional",
    "Western Party",
    "Wedding Special",
    "Casual Chic",
    "Formal Wear",
  ];
  const names = [
    "Elegant Lehenga Set",
    "Designer Anarkali",
    "Silk Saree Combo",
    "Party Gown",
    "Wedding Ensemble",
    "Cocktail Dress",
    "Traditional Suit",
    "Contemporary Kurti",
    "Bridal Lehenga",
    "Evening Gown",
    "Festive Wear",
    "Designer Sharara",
  ];

  return Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    description: "Beautiful handcrafted dress perfect for special occasions.",
    price: Math.floor(Math.random() * 5_000) + 500,
    type: types[Math.floor(Math.random() * types.length)],
    image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1_000_000_000_000) + 1_500_000_000_000}?w=400&h=500&fit=crop&auto=format`,
    rating: Math.floor(Math.random() * 2) + 4,
    reviews: Math.floor(Math.random() * 100) + 10,
  }));
};
