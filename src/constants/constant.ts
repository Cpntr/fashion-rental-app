// src\constants\constant.ts

// Grid layout constants (tweak as needed)
export const columnWidth = 300;
export const rowHeight = 520;
export const gridPadding = 32;
export const gridWidth = typeof window !== 'undefined' ? window.innerWidth - gridPadding : 1200;
export const columnCount = Math.max(1, Math.floor(gridWidth / columnWidth));
export const gridHeight = 800;



export const slides = [
  {
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=600&fit=crop',
    title: 'Elegant Indian Wear',
    subtitle: 'Traditional meets contemporary',
  },
  {
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=600&fit=crop',
    title: 'Designer Western Dresses',
    subtitle: 'Style that speaks volumes',
  },
  {
    image: 'https://images.unsplash.com/photo-1566479179817-0d7e4c9a3a6e?w=1200&h=600&fit=crop',
    title: 'Wedding Collection',
    subtitle: 'Make your special day unforgettable',
  },
];
