// src/constants/dressTypes.ts

export const DRESS_TYPES = [
  "Indian Traditional",
  "Western Party",
  "Wedding Special",
  "Casual Chic",
  "Formal Wear",
] as const;

export type DressType = typeof DRESS_TYPES[number];
