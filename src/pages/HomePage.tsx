// src/pages/HomePage.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { Filter, X, Search } from "lucide-react";
import {
  loadMockDresses
} from "../utils/loadDresses";

import Header from "../components/Header/Header";
import ImageSlider from "../components/ImageSlider";
import DressCard from "../components/DressCard";
import FilterPanel from "../components/FilterPanel";
import { generateMockDresses } from "../utils/generateDresses";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { DRESS_CATALOGUE } from "../mocks/dresses";
import ScrollToTopButton from "../components/ScrollToTopButton";
const AboutUs = lazy(() => import("../components/AboutUs"));

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
interface Dress {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  image: string;
  rating: number;
  reviews: number;
}

interface Filters {
  search: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */
const HomePage: React.FC = () => {
  /* ------------------------------ Global state --------------------------- */
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [filteredDresses, setFilteredDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ------------------------------ UI state ------------------------------- */
  const [showAbout, setShowAbout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const ITEMS_PER_PAGE = generateMockDresses(1).length;
  const TOTAL_ITEMS = DRESS_CATALOGUE.length;

  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "",
    minPrice: 0,
    maxPrice: 10_000,
    rating: 0,
  });

  const totalFilteredCount = useMemo(() => {
  return DRESS_CATALOGUE.filter(
    (d) =>
      d.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.type === "" || d.type === filters.type) &&
      d.price >= filters.minPrice &&
      d.price <= filters.maxPrice &&
      d.rating >= filters.rating
  ).length;
}, [filters]);


  /* ------------------------------ Data helpers --------------------------- */
const loadDresses = useCallback(
  (page = 1, reset = false, loadAll = false) => {
    setLoading(true);
    setTimeout(() => {
      const newDresses = loadMockDresses(page, loadAll);

      setDresses((prev) => {
        const combined = reset ? newDresses : [...prev, ...newDresses];

        // ✅ De-duplicate by ID
        const unique = Array.from(
          new Map(combined.map((d) => [d.id, d])).values()
        );

        return unique;
      });

      setFilteredDresses((prev) => {
        const combined = reset ? newDresses : [...prev, ...newDresses];

        const unique = Array.from(
          new Map(combined.map((d) => [d.id, d])).values()
        );

        return unique;
      });

     const totalLoaded = (page) * ITEMS_PER_PAGE;
     setHasMore(totalLoaded < TOTAL_ITEMS);

      setLoading(false);
    }, 800);
  },
  []
);




  /* ------------------------------ Effects -------------------------------- */
useEffect(() => {
  loadDresses(1, true, true); 
}, [filters.type]);


  useEffect(() => {
    setFilteredDresses(
      dresses.filter(
        (d) =>
          d.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.type === "" || d.type === filters.type) &&
          d.price >= filters.minPrice &&
          d.price <= filters.maxPrice &&
          d.rating >= filters.rating
      )
    );
  }, [filters, dresses]);

  /* ------------------------------ Infinite scroll ------------------------ */
  const fetchNextPage = () => {
    const next = currentPage + 1;
    loadDresses(next);
    setCurrentPage(next);
  };

  const lastDressElementRef = useInfiniteScroll(fetchNextPage, hasMore, loading);

  /* ------------------------------ Handlers ------------------------------- */
  const handleFilterChange = (name: keyof Filters, value: string | number) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const handleFavorite = (id: number, fav: boolean) =>
    console.log(`Dress ${id} ${fav ? "added to" : "removed from"} favorites`);

  /* ------------------------------ Render --------------------------------- */
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
                  {filteredDresses.map((dress, i) => (
                    <div
                      key={dress.id}
                      ref={i === filteredDresses.length - 1 ? lastDressElementRef : undefined}
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
                  <p className="text-center text-gray-600 mt-8 py-8">
                    You've seen all available dresses!
                  </p>
                )}

                {filteredDresses.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Search size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No dresses found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your filters to see more results.
                    </p>
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
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
      <ScrollToTopButton />

    </div>
  );
};

export default HomePage;
