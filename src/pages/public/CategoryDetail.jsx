import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  FaArrowLeft, FaHammer, FaSearch, FaUsers,
  FaStar, FaMapMarkerAlt, FaCheckCircle,
} from 'react-icons/fa';
import { getCategory } from '../../services/categoryService';
import { getLaboursByCategory } from '../../services/labourService';
import {
  Button, Card, Skeleton, EmptyState, Pagination, Badge,
} from '../../components/ui';
import { LabourCard } from '../../components/layout';

const PER_PAGE = 12;

const categoryIcons = {
  plumber: FaHammer,
  electrician: FaHammer,
  carpenter: FaHammer,
  painter: FaHammer,
  mason: FaHammer,
  gardener: FaHammer,
  cleaner: FaHammer,
  driver: FaHammer,
};

export default function CategoryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategory(slug),
    enabled: !!slug,
  });

  const { data: labours, isLoading: labourLoading, isError } = useQuery({
    queryKey: ['labours', 'category', slug],
    queryFn: () => getLaboursByCategory(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil((labours?.length || 0) / PER_PAGE));
  const paginatedLabours = (labours || []).slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const Icon = categoryIcons[slug] || FaHammer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-900 dark:to-blue-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft size={14} />
            Back
          </button>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icon className="text-white text-3xl" />
            </div>
            <div>
              {catLoading ? (
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
                  <div className="h-4 w-72 bg-white/10 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white capitalize">
                    {category?.name || slug}
                  </h1>
                  <p className="text-blue-100/80 mt-1">
                    {category?.description || `Find trusted ${slug} professionals near you`}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card padding="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <FaUsers className="text-blue-600 dark:text-blue-400" size={16} />
                Subcategories
              </h3>
              {catLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="space-y-1">
                  {(category?.subcategories || [
                    slug, `${slug}-repair`, `${slug}-installation`,
                  ]).map((sub) => (
                    <Link
                      key={sub}
                      to={`/search?category=${sub}`}
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors capitalize"
                    >
                      {sub.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                  to={`/search?category=${slug}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <FaSearch size={14} />
                  Search in {slug}
                </Link>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {labourLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} type="card" className="h-72" />
                ))}
              </div>
            ) : isError ? (
              <EmptyState
                icon={FaSearch}
                title="Failed to load labours"
                description="Something went wrong. Please try again."
              />
            ) : paginatedLabours.length === 0 ? (
              <EmptyState
                icon={FaUsers}
                title="No labours in this category"
                description="There are currently no labours listed in this category."
                action={{
                  label: 'Browse All Categories',
                  onClick: () => navigate('/categories'),
                  icon: FaSearch,
                }}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {labours.length} labour{labours.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
