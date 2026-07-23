import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaStar, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Select, Badge, Avatar, Spinner, Pagination, Modal, EmptyState, StarRating } from '../../components/ui';
import * as reviewService from '../../services/reviewService';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ratingOptions = [
  { value: '', label: 'All Ratings' },
  { value: '5', label: '★★★★★ 5' },
  { value: '4', label: '★★★★☆ 4' },
  { value: '3', label: '★★★☆☆ 3' },
  { value: '2', label: '★★☆☆☆ 2' },
  { value: '1', label: '★☆☆☆☆ 1' },
];

const ITEMS_PER_PAGE = 10;

export default function ManageReviews() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewModal, setViewModal] = useState({ open: false, review: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: async () => {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted');
      setDeleteModal({ open: false, id: null });
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch = !search || [r.labourName, r.customerName, r.comment].some((f) => f?.toLowerCase().includes(search.toLowerCase()));
      const matchRating = !ratingFilter || r.rating === parseInt(ratingFilter);
      return matchSearch && matchRating;
    });
  }, [reviews, search, ratingFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatDate = (ts) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    return (
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar key={star} size={12} className={star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
        ))}
        <span className="ml-1 text-xs text-gray-500">{rating}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Manage Reviews</h1>

        <Card>
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search by labour, customer, or comment..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select name="rating" value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }} options={ratingOptions} className="w-full lg:w-40" />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : paginated.length === 0 ? (
            <EmptyState icon={FaStar} title="No reviews found" description="Reviews from customers will appear here" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pr-3 font-medium">Labour</th>
                    <th className="pb-3 pr-3 font-medium">Customer</th>
                    <th className="pb-3 pr-3 font-medium">Rating</th>
                    <th className="pb-3 pr-3 font-medium">Comment</th>
                    <th className="pb-3 pr-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((review) => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={review.labourName} size="sm" />
                          <span className="text-gray-900 dark:text-gray-100">{review.labourName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={review.customerName} size="sm" />
                          <span className="text-gray-900 dark:text-gray-100">{review.customerName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">{renderStars(review.rating || 0)}</td>
                      <td className="py-3 pr-3 max-w-[200px]">
                        <p className="text-gray-600 dark:text-gray-400 truncate">{review.comment || '-'}</p>
                      </td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{formatDate(review.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewModal({ open: true, review })} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"><FaEye size={14} /></button>
                          <button onClick={() => setDeleteModal({ open: true, id: review.id })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20"><FaTrash size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </Card>
      </motion.div>

      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, review: null })} title="Review Details" size="md">
        {viewModal.review && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewModal.review.customerName} size="lg" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{viewModal.review.customerName}</h3>
                <p className="text-sm text-gray-500">Reviewed {viewModal.review.labourName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {renderStars(viewModal.review.rating || 0)}
              <span className="text-sm text-gray-500">{formatDate(viewModal.review.createdAt)}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Comment:</span>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                {viewModal.review.comment || 'No comment'}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="danger" size="sm" icon={FaTrash} onClick={() => { setViewModal({ open: false, review: null }); setDeleteModal({ open: true, id: viewModal.review.id }); }}>
                Delete Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} title="Delete Review" size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteModal.id)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
