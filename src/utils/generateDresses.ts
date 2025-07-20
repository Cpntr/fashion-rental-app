// src\utils\generateDresses.ts
import type { Dress } from '../types/dress';
import { DRESS_CATALOGUE } from '../mocks/dresses';
import { DRESS_TYPES } from '../constants/dressTypes';
import { getNextDressId } from './idGenerator';

const DEFAULT_PAGE_COUNT = 9;
const DEFAULT_LIMIT = Math.ceil(DRESS_CATALOGUE.length / DEFAULT_PAGE_COUNT);

export function generateMockDresses(page = 1, limit = DEFAULT_LIMIT): Dress[] {
  page = Math.max(1, page);
  limit = Math.max(1, limit);

  const start = (page - 1) * limit;
  const slice = DRESS_CATALOGUE.slice(start, start + limit);

  if (slice.length < limit) {
    const fallback: Dress[] = Array.from({ length: limit - slice.length }, () => {
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
      };
    });

    return [...slice, ...fallback];
  }

  return slice;
}
