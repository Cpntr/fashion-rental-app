// src\utils\loadDresses.ts
import type { Dress } from '../types/dress';
import { fetchAllDresses } from '../api/dresses';

/**
 * Fetch dresses from the backend and optionally paginate them.
 *
 * @param page   The page number (1-based) to return.
 * @param loadAll If true, return all dresses regardless of page.
 * @param limit  Items per page. Defaults to 20.
 */
export async function loadDresses(page = 1, loadAll = false, limit = 20): Promise<Dress[]> {
  const all = await fetchAllDresses();
  if (loadAll) {
    return all;
  }
  const start = (Math.max(1, page) - 1) * limit;
  return all.slice(start, start + limit);
}
