// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Filter, X, Search } from 'lucide-react';
// import { fetchAllDresses } from './src/api/dresses';

import Header from '../components/Header/Header';
import ImageSlider from '../components/ImageSlider';
import DressCard from '../components/DressCard';
import FilterPanel from '../components/FilterPanel';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import ScrollToTopButton from '../components/ScrollToTopButton';
import Footer from '../components/Footer/Footer';
import type { Dress, Filters } from '../types/dress';
import { fetchAllDresses } from '../api/dresses';
const AboutUs = lazy(() => import('../components/AboutUs'));

const HomePage: React.FC = () => {
  /* Global state */
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [filteredDresses, setFilteredDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* UI state */
  const [showAbout, setShowAbout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const ITEMS_PER_PAGE = 12; // adjust as needed

  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    minPrice: 0,
    maxPrice: 10_000,
    rating: 0,
  });

  // Total dresses matching current filter
  const totalFilteredCount = useMemo(() => {
    return dresses.filter(
      (d) =>
        d.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.type === '' || d.type === filters.type) &&
        d.price >= filters.minPrice &&
        d.price <= filters.maxPrice &&
        d.rating >= filters.rating,
    ).length;
  }, [filters, dresses]);

  // Dresses to display (client-side pagination)
  const displayedDresses = useMemo(() => {
    return filteredDresses.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredDresses, currentPage, ITEMS_PER_PAGE]);

  /* Data loader */
  // Load dresses from the backend (replaces the old mock-based loader)
  const loadDresses = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchAllDresses();

      // Normalise the images field so it is always an array of strings.
      // We avoid using `any` to satisfy the no-explicit-any ESLint rule.
      const normalised: Dress[] = all.map((d) => {
        const imagesArray = Array.isArray(d.images) ? d.images : d.images ? [d.images] : [];
        return { ...d, images: imagesArray };
      });

      setDresses(normalised);
      setFilteredDresses(normalised);
      setHasMore(normalised.length > ITEMS_PER_PAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Initial load */
  useEffect(() => {
    loadDresses();
  }, [loadDresses]);

  /* Re-filter when filters change */
  useEffect(() => {
    setFilteredDresses(
      dresses.filter(
        (d) =>
          d.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.type === '' || d.type === filters.type) &&
          d.price >= filters.minPrice &&
          d.price <= filters.maxPrice &&
          d.rating >= filters.rating,
      ),
    );
  }, [filters, dresses]);

  /* Infinite scroll */
  const fetchNextPage = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    setHasMore(filteredDresses.length > next * ITEMS_PER_PAGE);
  };

  const lastDressElementRef = useInfiniteScroll(fetchNextPage, hasMore, loading);

  /* Handlers */
  const handleFilterChange = (name: keyof Filters, value: string | number) =>
    setFilters((prev) => ({ ...prev, [name]: value }));
  const handleFavorite = (id: number, fav: boolean) =>
    console.log(`Dress ${id} ${fav ? 'added to' : 'removed from'} favorites`);

  /* Render */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showAbout={showAbout}
        setShowAbout={setShowAbout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!showAbout ? (
          <>
            <div className="mb-8">
              <ImageSlider />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="hidden lg:block w-80 lg:sticky lg:top-32">
                <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
              </aside>

              <section className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Our Collection ({totalFilteredCount} dresses)
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-600"
                  >
                    <Filter size={18} />
                    Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedDresses.map((dress, i) => (
                    <div
                      key={dress.id}
                      ref={i === displayedDresses.length - 1 ? lastDressElementRef : undefined}
                    >
                      <DressCard dress={dress} onFavorite={handleFavorite} />
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="flex justify-center mt-8">
                    <div className="animate-spin h-12 w-12 border-b-2 border-pink-500 rounded-full" />
                  </div>
                )}

                {!hasMore && filteredDresses.length > 0 && (
                  <div className="flex flex-col items-center justify-center mt-12 py-10 animate-fade-in">
                    <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg">
                      <p className="text-lg font-semibold tracking-wide">
                        🎉 You’ve reached the end!
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">You've seen all available dresses.</p>
                  </div>
                )}

                {filteredDresses.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Search size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No dresses found</h3>
                    <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-12 w-12 border-b-2 border-pink-500 rounded-full" />
              </div>
            }
          >
            <AboutUs />
          </Suspense>
        )}
      </main>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} isMobile />
            </div>
          </div>
        </div>
      )}

      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default HomePage;
