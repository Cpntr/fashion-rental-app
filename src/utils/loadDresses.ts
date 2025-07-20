import { generateMockDresses } from "./generateDresses";
import { DRESS_CATALOGUE } from "../mocks/dresses";

export const ITEMS_PER_PAGE = generateMockDresses(1).length;
export const TOTAL_ITEMS = DRESS_CATALOGUE.length;
export const MAX_PAGES = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

/**
 * Loads mock dresses based on page and flag to load all pages.
 * @param page - The page to load (default 1)
 * @param loadAll - Whether to load all pages at once
 * @returns An array of mock Dress objects
 */
export function loadMockDresses(page = 1, loadAll = false) {
  if (loadAll) {
    return Array.from({ length: MAX_PAGES }).flatMap((_, i) =>
      generateMockDresses(i + 1)
    );
  }

  return generateMockDresses(page);
}
