import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaEye, FaCalendarCheck, FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Select, Badge, Avatar, Spinner, Pagination, Modal, EmptyState } from '../../components/ui';
import * as bookingService from '../../services/bookingService';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusVariant = {
  pending: 'warning',
  accepted: 'info',
  completed: 'success',
  cancelled: 'danger',
};

const ITEMS_PER_PAGE = 10;

export default function ManageBookings() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewModal, setViewModal] = useState({ open: false, booking: null });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated');
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch = !search || [b.id, b.labourName, b.customerName, b.labourId, b.customerId].some((f) => f?.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = !statusFilter || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatDate = (ts) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (ts) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Manage Bookings</h1>

        <Card>
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search by ID, labour, or customer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select name="status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} options={statusOptions} className="w-full lg:w-40" />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : paginated.length === 0 ? (
            <EmptyState icon={FaCalendarCheck} title="No bookings found" description="Bookings will appear here when customers make reservations" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pr-3 font-medium">Booking ID</th>
                    <th className="pb-3 pr-3 font-medium">Labour</th>
                    <th className="pb-3 pr-3 font-medium">Customer</th>
                    <th className="pb-3 pr-3 font-medium">Date</th>
                    <th className="pb-3 pr-3 font-medium">Time</th>
                    <th className="pb-3 pr-3 font-medium">Status</th>
                    <th className="pb-3 pr-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 pr-3 font-mono text-xs text-gray-900 dark:text-gray-100">{booking.id?.slice(0, 8)}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={booking.labourName} size="sm" />
                          <span className="text-gray-900 dark:text-gray-100">{booking.labourName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={booking.customerName} size="sm" />
                          <span className="text-gray-900 dark:text-gray-100">{booking.customerName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{formatDate(booking.date || booking.createdAt)}</td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{formatTime(booking.date || booking.createdAt)}</td>
                      <td className="py-3 pr-3">
                        <Badge variant={statusVariant[booking.status] || 'info'}>{booking.status}</Badge>
                      </td>
                      <td className="py-3 pr-3 text-gray-900 dark:text-gray-100 font-medium">₹{booking.amount || 0}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {['pending', 'accepted'].includes(booking.status) && (
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) statusMutation.mutate({ id: booking.id, status: e.target.value });
                              }}
                              className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>Change</option>
                              <option value="accepted">Accept</option>
                              <option value="completed">Complete</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          )}
                          <button onClick={() => setViewModal({ open: true, booking })} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"><FaEye size={14} /></button>
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

      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, booking: null })} title="Booking Details" size="lg">
        {viewModal.booking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Booking ID', viewModal.booking.id],
                ['Labour', viewModal.booking.labourName],
                ['Customer', viewModal.booking.customerName],
                ['Labour ID', viewModal.booking.labourId],
                ['Customer ID', viewModal.booking.customerId],
                ['Status', viewModal.booking.status],
                ['Amount', `₹${viewModal.booking.amount || 0}`],
                ['Date', formatDate(viewModal.booking.date || viewModal.booking.createdAt)],
                ['Time', formatTime(viewModal.booking.date || viewModal.booking.createdAt)],
                ['Address', viewModal.booking.address || '-'],
                ['Phone', viewModal.booking.phone || '-'],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-gray-500 dark:text-gray-400">{label}:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{value || '-'}</span>
                </div>
              ))}
            </div>
            {viewModal.booking.description && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Description:</span>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{viewModal.booking.description}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {['pending', 'accepted'].includes(viewModal.booking.status) && (
                <>
                  <Button size="sm" variant="primary" onClick={() => { statusMutation.mutate({ id: viewModal.booking.id, status: 'completed' }); setViewModal({ open: false, booking: null }); }}>Mark Completed</Button>
                  <Button size="sm" variant="danger" onClick={() => { statusMutation.mutate({ id: viewModal.booking.id, status: 'cancelled' }); setViewModal({ open: false, booking: null }); }}>Cancel Booking</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
