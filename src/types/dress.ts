// src\types\dress.ts
export interface Dress {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  images: string | string[];
  rating: number;
  reviews: number;
}

export interface Filters {
  search: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
}
