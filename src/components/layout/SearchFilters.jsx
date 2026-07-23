import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSortAmountDown, FaChevronDown, FaTimes } from 'react-icons/fa';
import { HiAdjustments } from 'react-icons/hi';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mason', label: 'Mason' },
  { value: 'gardener', label: 'Gardener' },
  { value: 'cleaner', label: 'House Cleaner' },
  { value: 'driver', label: 'Driver' },
];

const cities = [
  { value: '', label: 'All Cities' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'gurugram', label: 'Gurugram' },
  { value: 'noida', label: 'Noida' },
];

const areas = [
  { value: '', label: 'All Areas' },
  { value: 'sector-14', label: 'Sector 14' },
  { value: 'sector-15', label: 'Sector 15' },
  { value: 'dlf-phase-1', label: 'DLF Phase 1' },
  { value: 'mg-road', label: 'MG Road' },
];

const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'experience', label: 'Experience' },
];

export default function SearchFilters({ filters = {}, onFilterChange }) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const selectClass =
    'appearance-none w-full px-3 py-2.5 pr-8 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer';

  const toggleClass =
    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
      <div className="hidden lg:flex items-center gap-3 p-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-fit">
          <HiAdjustments className="text-lg" />
          Filters
        </div>

        <div className="relative min-w-[160px]">
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className={selectClass}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>

        <div className="relative min-w-[150px]">
          <select
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className={selectClass}
          >
            {cities.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>

        <div className="relative min-w-[150px]">
          <select
            value={filters.area || ''}
            onChange={(e) => handleChange('area', e.target.value)}
            className={selectClass}
          >
            {areas.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>

        <div className="relative min-w-[160px]">
          <select
            value={filters.sort || 'rating'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className={selectClass}
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>

        <div className="flex items-center gap-4 ml-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <button
              type="button"
              onClick={() => handleChange('verifiedOnly', !filters.verifiedOnly)}
              className={`${toggleClass} ${filters.verifiedOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.verifiedOnly ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
            </button>
            Verified only
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <button
              type="button"
              onClick={() => handleChange('availableToday', !filters.availableToday)}
              className={`${toggleClass} ${filters.availableToday ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.availableToday ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
            </button>
            Available today
          </label>
        </div>
      </div>

      <div className="lg:hidden p-3">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FaFilter className="text-sm" />
            Filters & Sort
          </span>
          <FaChevronDown className={`text-xs transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                <div className="relative">
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={selectClass}
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={filters.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={selectClass}
                  >
                    {cities.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={filters.area || ''}
                    onChange={(e) => handleChange('area', e.target.value)}
                    className={selectClass}
                  >
                    {areas.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={filters.sort || 'rating'}
                    onChange={(e) => handleChange('sort', e.target.value)}
                    className={selectClass}
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => handleChange('verifiedOnly', !filters.verifiedOnly)}
                    className={`${toggleClass} ${filters.verifiedOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.verifiedOnly ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                  </button>
                  Verified only
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => handleChange('availableToday', !filters.availableToday)}
                    className={`${toggleClass} ${filters.availableToday ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.availableToday ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                  </button>
                  Available today
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
