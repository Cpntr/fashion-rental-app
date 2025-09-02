// src/utils/generateDresses.ts
import type { Dress } from '../types/dress';
import { DRESS_TYPES } from '../constants/dressTypes';
import { getNextDressId } from './idGenerator';

/**
 * Generate a page of mock dresses for development/testing.
 *
 * This function no longer depends on a static catalogue. It generates
 * completely synthetic dresses each time it is called. Use this only
 * when no real data is available from the backend.
 */
const DEFAULT_PAGE_COUNT = 9;
const DEFAULT_LIMIT = DEFAULT_PAGE_COUNT;

export function generateMockDresses(_page = 1, limit = DEFAULT_LIMIT): Dress[] {
  // Normalize the limit to ensure at least one item is generated.
  // The `_page` parameter is retained for backwards compatibility
  // but is intentionally unused to avoid a no-unused-vars warning.
  limit = Math.max(1, limit);

  // Generate `limit` items regardless of the page number.
  return Array.from({ length: limit }, () => {
    const id = getNextDressId();
    return {
      id,
      name: `Mystery Dress coming soon...`,
      description: 'Beautiful handcrafted dress perfect for special occasions.',
      price: 500 + Math.floor(Math.random() * 5000),
      type: DRESS_TYPES[id % DRESS_TYPES.length],
      images: [`https://source.unsplash.com/random/400x500?fashion,dress&sig=${id}`],
      rating: 3 + Math.floor(Math.random() * 3),
      reviews: 10 + Math.floor(Math.random() * 490),
    } as Dress;
  });
}
