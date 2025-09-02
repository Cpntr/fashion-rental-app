// src/constants/dressTypes.ts

export const DRESS_TYPES = [
  'Indian Traditional',
  'Western Party',
  'Wedding Special',
  'Casual Chic',
  'Formal Wear',
  'Festive Ethnic',
  'Indo-Western Fusion',
  'Office Wear',
  'Bridal Lehenga',
  'Cocktail Gown',
  'Kurti & Palazzo',
  'Saree Drapes',
  'Anarkali',
  'Evening Gown',
  'Designer Wear',
  'Boho Style',
  'Maxi Dress',
  'Sharara Set',
  'Reception Outfit',
  'Engagement Wear',
] as const;

export type DressType = (typeof DRESS_TYPES)[number];
