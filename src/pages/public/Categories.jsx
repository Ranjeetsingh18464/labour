import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  FaHammer, FaBolt, FaPaintRoller, FaTruck, FaUtensils,
  FaBroom, FaWrench, FaShieldAlt, FaUserGraduate, FaCut,
  FaCogs, FaLeaf, FaSearch, FaTimes,
} from 'react-icons/fa';
import { getCategories } from '../../services/categoryService';
import { Input, Skeleton, EmptyState, Badge } from '../../components/ui';

const fallbackIcons = {
  plumber: FaWrench,
  electrician: FaBolt,
  carpenter: FaHammer,
  painter: FaPaintRoller,
  mason: FaHammer,
  gardener: FaLeaf,
  cleaner: FaBroom,
  driver: FaTruck,
  cook: FaUtensils,
  security: FaShieldAlt,
  tutor: FaUserGraduate,
  tailor: FaCut,
  mechanic: FaCogs,
  housekeeping: FaBroom,
};

const defaultCategories = [
  { id: '1', name: 'Plumber', slug: 'plumber', count: 0, description: 'Pipe repairs, installations & maintenance' },
  { id: '2', name: 'Electrician', slug: 'electrician', count: 0, description: 'Wiring, fixtures & electrical repairs' },
  { id: '3', name: 'Carpenter', slug: 'carpenter', count: 0, description: 'Furniture, woodwork & fittings' },
  { id: '4', name: 'Painter', slug: 'painter', count: 0, description: 'Interior & exterior painting' },
  { id: '5', name: 'Mason', slug: 'mason', count: 0, description: 'Brickwork, plastering & construction' },
  { id: '6', name: 'Gardener', slug: 'gardener', count: 0, description: 'Lawn care, planting & landscaping' },
  { id: '7', name: 'House Cleaner', slug: 'cleaner', count: 0, description: 'Deep cleaning & housekeeping' },
  { id: '8', name: 'Driver', slug: 'driver', count: 0, description: 'Personal & commercial driving' },
  { id: '9', name: 'Cook', slug: 'cook', count: 0, description: 'Home cooking & meal preparation' },
  { id: '10', name: 'Security Guard', slug: 'security', count: 0, description: 'Property & personal security' },
  { id: '11', name: 'Tutor', slug: 'tutor', count: 0, description: 'Academic & skill-based tutoring' },
  { id: '12', name: 'Tailor', slug: 'tailor', count: 0, description: 'Alterations, stitching & designs' },
  { id: '13', name: 'Mechanic', slug: 'mechanic', count: 0, description: 'Vehicle & equipment repairs' },
  { id: '14', name: 'Housekeeping', slug: 'housekeeping', count: 0, description: 'Full-time & part-time housekeeping' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Categories() {
  const [search, setSearch] = useState('');

  const { data: apiCategories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : defaultCategories;

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q) ||
        cat.slug?.toLowerCase().includes(q)
    );
  }, [categories, search]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Browse Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-6"
          >
            Find the right professional for your needs from our wide range of service categories.
          </motion.p>

          <div className="max-w-md mx-auto relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} type="card" className="h-36" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FaSearch}
            title="No categories found"
            description={`No categories match "${search}". Try a different search term.`}
            action={search ? { label: 'Clear search', onClick: () => setSearch('') } : undefined}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filtered.map((cat) => {
              const Icon = fallbackIcons[cat.slug] || FaCogs;
              return (
                <motion.div key={cat.id || cat.slug} variants={itemVariants}>
                  <Link
                    to={`/search?category=${cat.slug || cat.name?.toLowerCase()}`}
                    className="block bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all group h-full"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 capitalize">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {cat.description}
                      </p>
                    )}
                    <Badge variant="info" size="sm">
                      {cat.count || 0} labours
                    </Badge>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
