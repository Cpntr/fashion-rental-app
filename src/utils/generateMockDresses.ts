
import type { Dress } from "../types/dress";
import { DRESS_CATALOGUE } from "../mocks/dresses";

/**
 * Deterministic paging over the static 100‑item catalogue.
 * Falls back to the old random Unsplash URL if we ever run out of cached data.
 */
export function generateMockDresses(page = 1, limit = 12): Dress[] {
  const start = (page - 1) * limit;
  const slice = DRESS_CATALOGUE.slice(start, start + limit);

  // Fallback so infinite‑scroll never crashes if we go past 100 items
  if (slice.length < limit) {
    const fallback: Dress[] = Array.from({ length: limit - slice.length }, (_, i) => {
      const idx = start + slice.length + i + 1;
      return {
        id: idx,
        name: `Mystery Dress #${idx}`,
        description: "Beautiful handcrafted dress perfect for special occasions.",
        price: Math.floor(Math.random() * 5_000) + 500,
        type: ["Indian Traditional","Western Party","Wedding Special","Casual Chic","Formal Wear"][idx % 5],
        image: `https://source.unsplash.com/random/400x500?fashion,dress,${idx}`,
        rating: 4,
        reviews: 12,
      };
    });
    return [...slice, ...fallback];
  }

  return slice;
}
