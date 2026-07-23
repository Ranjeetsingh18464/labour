import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaBan, FaShieldAlt, FaEdit, FaTrash, FaChevronDown, FaCheckDouble, FaUserCheck, FaUsers,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Card, Button, Input, Select, Badge, Avatar, Spinner, Pagination, Modal, EmptyState,
} from '../../components/ui';
import * as labourService from '../../services/labourService';
import * as categoryService from '../../services/categoryService';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'rejected', label: 'Rejected' },
];

const ITEMS_PER_PAGE = 10;

const statusVariant = {
  approved: 'success',
  pending: 'warning',
  suspended: 'danger',
  rejected: 'danger',
};

export default function ManageLabours() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', ids: [] });
  const [viewModal, setViewModal] = useState({ open: false, labour: null });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const { data: labours = [], isLoading } = useQuery({
    queryKey: ['labours', 'all'],
    queryFn: () => labourService.getAllLabours(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const cities = useMemo(() => [...new Set(labours.map((l) => l.city).filter(Boolean))], [labours]);

  const filtered = useMemo(() => {
    return labours.filter((l) => {
      const matchesSearch = !search || [l.name, l.labourId, l.email, l.phone].some((f) => f?.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = !statusFilter || l.status === statusFilter;
      const matchesCategory = !categoryFilter || l.category === categoryFilter;
      const matchesCity = !cityFilter || l.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesCity;
    });
  }, [labours, search, statusFilter, categoryFilter, cityFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const mutation = useMutation({
    mutationFn: ({ action, ids }) => {
      if (action === 'delete') return Promise.all(ids.map((id) => labourService.deleteLabour(id)));
      if (action === 'approve') return Promise.all(ids.map((id) => labourService.approveLabour(id)));
      if (action === 'reject') return Promise.all(ids.map((id) => labourService.rejectLabour(id)));
      if (action === 'suspend') return Promise.all(ids.map((id) => labourService.suspendLabour(id)));
      if (action === 'verify') return Promise.all(ids.map((id) => labourService.verifyLabour(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labours'] });
      toast.success('Action completed successfully');
      setConfirmModal({ open: false, type: '', ids: [] });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleBulkAction = (action) => {
    if (selected.size === 0) return toast.error('No labours selected');
    setConfirmModal({ open: true, type: action, ids: Array.from(selected) });
  };

  const handleAction = (id, action) => {
    setConfirmModal({ open: true, type: action, ids: [id] });
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((l) => l.id)));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Labours</h1>
        </div>

        <Card>
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select name="status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} options={statusOptions} className="w-full lg:w-40" />
            <Select name="category" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c.name, label: c.name }))]} className="w-full lg:w-40" />
            <Select name="city" value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1); }} options={[{ value: '', label: 'All Cities' }, ...cities.map((c) => ({ value: c, label: c }))]} className="w-full lg:w-40" />
          </div>

          {selected.size > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-blue-700 dark:text-blue-300">{selected.size} selected</span>
              <Button size="sm" variant="primary" icon={FaCheck} onClick={() => handleBulkAction('approve')}>Approve</Button>
              <Button size="sm" variant="danger" icon={FaTrash} onClick={() => handleBulkAction('delete')}>Delete</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : paginated.length === 0 ? (
            <EmptyState icon={FaUsers} title="No labours found" description="Try adjusting your search or filters" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pr-2 w-8">
                      <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded border-gray-300 dark:border-gray-600" />
                    </th>
                    <th className="pb-3 pr-3 font-medium">Photo</th>
                    <th className="pb-3 pr-3 font-medium">Labour ID</th>
                    <th className="pb-3 pr-3 font-medium">Name</th>
                    <th className="pb-3 pr-3 font-medium">Category</th>
                    <th className="pb-3 pr-3 font-medium">City</th>
                    <th className="pb-3 pr-3 font-medium">Status</th>
                    <th className="pb-3 pr-3 font-medium">Verification</th>
                    <th className="pb-3 pr-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((labour) => (
                    <motion.tr
                      key={labour.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 pr-2">
                        <input type="checkbox" checked={selected.has(labour.id)} onChange={() => toggleSelect(labour.id)} className="rounded border-gray-300 dark:border-gray-600" />
                      </td>
                      <td className="py-3 pr-3">
                        <Avatar src={labour.photoURL} name={labour.name} size="sm" />
                      </td>
                      <td className="py-3 pr-3 text-gray-900 dark:text-gray-100 font-mono text-xs">{labour.labourId || labour.id.slice(0, 8)}</td>
                      <td className="py-3 pr-3">
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{labour.name}</span>
                      </td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{labour.category}</td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{labour.city}</td>
                      <td className="py-3 pr-3">
                        <Badge variant={statusVariant[labour.status] || 'info'}>{labour.status}</Badge>
                      </td>
                      <td className="py-3 pr-3">
                        {labour.verified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="warning">Unverified</Badge>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                          ★ {labour.rating?.toFixed(1) || '0.0'}
                        </span>
                      </td>
                      <td className="py-3 relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === labour.id ? null : labour.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <FaChevronDown size={14} />
                        </button>
                        <AnimatePresence>
                          {dropdownOpen === labour.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1"
                            >
                              {[
                                { icon: FaEye, label: 'View', action: () => setViewModal({ open: true, labour }) },
                                { icon: FaCheck, label: 'Approve', action: () => handleAction(labour.id, 'approve'), show: labour.status !== 'approved' },
                                { icon: FaTimes, label: 'Reject', action: () => handleAction(labour.id, 'reject'), show: labour.status !== 'rejected' },
                                { icon: FaBan, label: 'Suspend', action: () => handleAction(labour.id, 'suspend'), show: !labour.suspended },
                                { icon: FaShieldAlt, label: 'Verify', action: () => handleAction(labour.id, 'verify'), show: !labour.verified },
                                { icon: FaEdit, label: 'Edit' },
                                { icon: FaTrash, label: 'Delete', action: () => handleAction(labour.id, 'delete'), danger: true },
                              ].filter((item) => item.show !== false).map((item) => (
                                <button
                                  key={item.label}
                                  onClick={() => { setDropdownOpen(null); item.action?.(); }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${item.danger ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                                >
                                  <item.icon size={14} />
                                  {item.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
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

      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', ids: [] })} title={`${confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)} Labour`} size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to {confirmModal.type} {confirmModal.ids.length > 1 ? `these ${confirmModal.ids.length} labours` : 'this labour'}?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setConfirmModal({ open: false, type: '', ids: [] })}>Cancel</Button>
          <Button
            variant={confirmModal.type === 'delete' ? 'danger' : 'primary'}
            loading={mutation.isPending}
            onClick={() => mutation.mutate({ action: confirmModal.type, ids: confirmModal.ids })}
          >
            {confirmModal.type.charAt(0).toUpperCase() + confirmModal.type.slice(1)}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, labour: null })} title="Labour Details" size="lg">
        {viewModal.labour && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={viewModal.labour.photoURL} name={viewModal.labour.name} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{viewModal.labour.name}</h3>
                <p className="text-sm text-gray-500">{viewModal.labour.email}</p>
                <p className="text-sm text-gray-500">{viewModal.labour.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Labour ID', viewModal.labour.labourId || viewModal.labour.id.slice(0, 8)],
                ['Category', viewModal.labour.category],
                ['City', viewModal.labour.city],
                ['Area', viewModal.labour.area],
                ['Experience', `${viewModal.labour.experience || 0} years`],
                ['Age', viewModal.labour.age],
                ['Gender', viewModal.labour.gender],
                ['Status', viewModal.labour.status],
                ['Verification', viewModal.labour.verified ? 'Verified' : 'Unverified'],
                ['Rating', `${viewModal.labour.rating || 0} / 5`],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-gray-500 dark:text-gray-400">{label}:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{value || '-'}</span>
                </div>
              ))}
            </div>
            {viewModal.labour.description && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Description:</span>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{viewModal.labour.description}</p>
              </div>
            )}
            {viewModal.labour.skills?.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {viewModal.labour.skills.map((s, i) => (
                    <Badge key={i} variant="info">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
