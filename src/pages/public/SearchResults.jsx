import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  FaSearch, FaThList, FaThLarge, FaTimes, FaSlidersH,
  FaMapMarkerAlt, FaStar, FaChevronDown,
} from 'react-icons/fa';
import { searchLabours } from '../../services/labourService';
import { LabourCard, SearchFilters } from '../../components/layout';
import {
  Button, Skeleton, EmptyState, Pagination, Input,
} from '../../components/ui';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experienced' },
];

function sortLabours(labours, sortBy) {
  const sorted = [...labours];
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'price-low':
      return sorted.sort((a, b) => (a.dailyCharges || 0) - (b.dailyCharges || 0));
    case 'price-high':
      return sorted.sort((a, b) => (b.dailyCharges || 0) - (a.dailyCharges || 0));
    case 'experience':
      return sorted.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    default:
      return sorted;
  }
}

function SkeletonGrid({ viewMode }) {
  const count = viewMode === 'list' ? 4 : 6;
  return (
    <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} type="card" className={viewMode === 'list' ? 'h-28' : 'h-72'} />
      ))}
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchParams.get('query') || '');

  const PER_PAGE = 12;

  const filters = useMemo(() => ({
    query: searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    sort: searchParams.get('sort') || 'rating',
    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
    availableToday: searchParams.get('availableToday') === 'true',
  }), [searchParams]);

  const { data: allLabours, isLoading, isError } = useQuery({
    queryKey: ['searchLabours', filters.query, filters.category, filters.city],
    queryFn: () => searchLabours(filters.query || ''),
    enabled: true,
  });

  const filteredLabours = useMemo(() => {
    if (!allLabours) return [];
    let results = [...allLabours];

    if (filters.category) {
      results = results.filter(l =>
        l.category?.toLowerCase() === filters.category.toLowerCase() ||
        l.skills?.some(s => s.toLowerCase() === filters.category.toLowerCase())
      );
    }
    if (filters.city) {
      results = results.filter(l =>
        l.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }
    if (filters.area) {
      results = results.filter(l =>
        l.area?.toLowerCase() === filters.area.toLowerCase()
      );
    }
    if (filters.verifiedOnly) {
      results = results.filter(l => l.verified);
    }
    if (filters.availableToday) {
      results = results.filter(l => l.available);
    }

    return sortLabours(results, filters.sort);
  }, [allLabours, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredLabours.length / PER_PAGE));
  const paginatedLabours = filteredLabours.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('query', localQuery);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search labours by name, skill, or location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" variant="primary">Search</Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <FaSlidersH size={14} />
              Filters
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? 'Searching...' : `${filteredLabours.length} result${filteredLabours.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none px-3 py-2 pr-8 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <FaThLarge size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <FaThList size={14} />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden w-full overflow-hidden mb-4"
              >
                <SearchFilters filters={filters} onFilterChange={(newFilters) => {
                  const params = new URLSearchParams();
                  Object.entries(newFilters).forEach(([k, v]) => {
                    if (v) params.set(k, v);
                  });
                  setSearchParams(params);
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden lg:block w-72 shrink-0">
            <SearchFilters filters={filters} onFilterChange={(newFilters) => {
              const params = new URLSearchParams();
              Object.entries(newFilters).forEach(([k, v]) => {
                if (v) params.set(k, v);
              });
              setSearchParams(params);
            }} />
          </div>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <SkeletonGrid viewMode={viewMode} />
            ) : isError ? (
              <EmptyState
                icon={FaSearch}
                title="Search failed"
                description="Something went wrong. Please try again."
              />
            ) : paginatedLabours.length === 0 ? (
              <EmptyState
                icon={FaSearch}
                title="No labours found"
                description={
                  hasActiveFilters
                    ? 'Try adjusting your filters or search terms.'
                    : 'No labours are currently listed. Check back soon.'
                }
                action={hasActiveFilters ? { label: 'Clear Filters', onClick: clearFilters } : undefined}
              />
            ) : (
              <>
                <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
                  {paginatedLabours.map((labour) => (
                    <Link key={labour.id} to={`/labour/${labour.id}`}>
                      <LabourCard labour={labour} />
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
