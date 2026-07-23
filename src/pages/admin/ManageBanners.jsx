import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaImage, FaToggleOn, FaToggleOff, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, TextArea, Badge, Spinner, Modal, EmptyState, FileUpload } from '../../components/ui';
import * as adminService from '../../services/adminService';
import * as uploadService from '../../services/uploadService';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const defaultForm = { title: '', subtitle: '', link: '', order: 0, active: true, imageUrl: '' };

export default function ManageBanners() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingId) {
        const ref = doc(db, 'banners', editingId);
        await updateDoc(ref, data);
        return { id: editingId, ...data };
      }
      return adminService.manageBanner(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success(editingId ? 'Banner updated' : 'Banner created');
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(db, 'banners', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner deleted');
      setDeleteModal({ open: false, id: null });
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }) => {
      const ref = doc(db, 'banners', id);
      await updateDoc(ref, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const openAdd = () => {
    setForm({ ...defaultForm, order: banners.length + 1 });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setForm({ title: banner.title || '', subtitle: banner.subtitle || '', link: banner.link || '', order: banner.order || 0, active: banner.active !== false, imageUrl: banner.imageUrl || '' });
    setEditingId(banner.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleFileUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const result = await uploadService.uploadImage(files[0], `banners/${Date.now()}_${files[0].name}`);
      setForm((prev) => ({ ...prev, imageUrl: result.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message);
    }
    setUploading(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    saveMutation.mutate(form);
  };

  const moveBanner = (index, direction) => {
    const items = [...banners];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    items.forEach((b, i) => {
      const ref = doc(db, 'banners', b.id);
      updateDoc(ref, { order: i + 1 });
    });
    queryClient.invalidateQueries({ queryKey: ['banners'] });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Banners</h1>
          <Button onClick={openAdd} icon={FaPlus}>Add Banner</Button>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : banners.length === 0 ? (
            <EmptyState icon={FaImage} title="No banners yet" description="Add homepage banners to promote categories and offers" action={{ label: 'Add Banner', icon: FaPlus, onClick: openAdd }} />
          ) : (
            <div className="space-y-3">
              {banners.map((banner, index) => (
                <div key={banner.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveBanner(index, -1)} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30" disabled={index === 0}><FaArrowUp size={10} /></button>
                    <button onClick={() => moveBanner(index, 1)} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" disabled={index === banners.length - 1}><FaArrowDown size={10} /></button>
                  </div>
                  <div className="w-24 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage size={20} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{banner.title || 'Untitled'}</p>
                    {banner.subtitle && <p className="text-xs text-gray-500 truncate">{banner.subtitle}</p>}
                    {banner.link && (
                      <p className="text-xs text-blue-500 truncate flex items-center gap-1 mt-0.5"><FaLink size={10} />{banner.link}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={banner.active !== false ? 'success' : 'danger'} size="sm">{banner.active !== false ? 'Active' : 'Inactive'}</Badge>
                    <span className="text-xs text-gray-400">#{banner.order || index + 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleMutation.mutate({ id: banner.id, active: banner.active === false })}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:text-yellow-400 dark:hover:bg-yellow-900/20"
                    >
                      {banner.active !== false ? <FaToggleOn size={16} className="text-green-500" /> : <FaToggleOff size={16} />}
                    </button>
                    <button onClick={() => openEdit(banner)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"><FaEdit size={14} /></button>
                    <button onClick={() => setDeleteModal({ open: true, id: banner.id })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20"><FaTrash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Edit Banner' : 'Add Banner'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <FileUpload
            label="Banner Image"
            accept="image/*"
            onUpload={handleFileUpload}
            currentFiles={form.imageUrl ? [{ name: form.imageUrl.split('/').pop() }] : []}
          />
          {uploading && <Spinner size="sm" />}
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
          )}
          <Input label="Title" name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Find the Best Plumbers" />
          <Input label="Subtitle" name="subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g. Book trusted professionals near you" />
          <Input label="Link URL" name="link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="e.g. /category/plumbing" />
          <Input label="Display Order" name="order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saveMutation.isPending}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} title="Delete Banner" size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this banner? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteModal.id)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
