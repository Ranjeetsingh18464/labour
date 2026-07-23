import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaThLarge } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, TextArea, Select, Badge, Spinner, Modal, EmptyState } from '../../components/ui';
import * as categoryService from '../../services/categoryService';
import * as adminService from '../../services/adminService';

const iconOptions = [
  { value: 'FaWrench', label: '🔧 Wrench' },
  { value: 'FaPaintRoller', label: '🎨 Paint' },
  { value: 'FaBolt', label: '⚡ Electric' },
  { value: 'FaTint', label: '💧 Plumbing' },
  { value: 'FaHammer', label: '🔨 Hammer' },
  { value: 'FaCouch', label: '🛋️ Furniture' },
  { value: 'FaSnowflake', label: '❄️ AC' },
  { value: 'FaHome', label: '🏠 Home' },
  { value: 'FaCar', label: '🚗 Car' },
  { value: 'FaTools', label: '🛠️ Tools' },
];

const defaultForm = { name: '', description: '', icon: 'FaWrench', status: 'active' };

export default function ManageCategories() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const filtered = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q));
  }, [categories, search]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) return categoryService.updateCategory(editingId, data);
      return categoryService.addCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(editingId ? 'Category updated' : 'Category created');
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
      setDeleteModal({ open: false, id: null, name: '' });
    },
    onError: (err) => toast.error(err.message),
  });

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name || '', description: cat.description || '', icon: cat.icon || 'FaWrench', status: cat.status || 'active' });
    setEditingId(cat.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    saveMutation.mutate({ ...form, slug });
  };

  const moveItem = (index, direction) => {
    const items = [...filtered];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Categories</h1>
          <Button onClick={openAdd} icon={FaPlus}>Add Category</Button>
        </div>

        <Card>
          <div className="relative max-w-md mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={FaThLarge} title="No categories" description="Add your first category to get started" action={{ label: 'Add Category', icon: FaPlus, onClick: openAdd }} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pr-3 font-medium w-16">Order</th>
                    <th className="pb-3 pr-3 font-medium">Name</th>
                    <th className="pb-3 pr-3 font-medium">Slug</th>
                    <th className="pb-3 pr-3 font-medium">Icon</th>
                    <th className="pb-3 pr-3 font-medium">Labour Count</th>
                    <th className="pb-3 pr-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat, index) => (
                    <motion.tr
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveItem(index, -1)} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30" disabled={index === 0}><FaArrowUp size={12} /></button>
                          <button onClick={() => moveItem(index, 1)} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" disabled={index === filtered.length - 1}><FaArrowDown size={12} /></button>
                        </div>
                      </td>
                      <td className="py-3 pr-3 font-medium text-gray-900 dark:text-gray-100">{cat.name}</td>
                      <td className="py-3 pr-3 text-gray-500 dark:text-gray-400 text-xs font-mono">{cat.slug}</td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{cat.icon || '-'}</td>
                      <td className="py-3 pr-3">
                        <Badge variant="primary">{cat.labourCount || 0}</Badge>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge variant={cat.status === 'active' ? 'success' : 'danger'}>{cat.status || 'active'}</Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"><FaEdit size={14} /></button>
                          <button onClick={() => setDeleteModal({ open: true, id: cat.id, name: cat.name })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20"><FaTrash size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Edit Category' : 'Add Category'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Plumbing" />
          <TextArea label="Description" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Category description" />
          <Select
            label="Icon"
            name="icon"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            options={iconOptions}
          />
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saveMutation.isPending}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null, name: '' })} title="Delete Category" size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong>"{deleteModal.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, id: null, name: '' })}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteModal.id)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
