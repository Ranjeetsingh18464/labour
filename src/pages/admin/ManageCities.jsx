import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaCity, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Select, Badge, Spinner, Modal, EmptyState } from '../../components/ui';
import * as adminService from '../../services/adminService';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const defaultCityForm = { name: '', state: '', status: 'active' };
const defaultAreaForm = { name: '', pincode: '' };

export default function ManageCities() {
  const queryClient = useQueryClient();
  const [expandedCity, setExpandedCity] = useState(null);
  const [cityModal, setCityModal] = useState({ open: false, editing: false, form: defaultCityForm, id: null });
  const [areaModal, setAreaModal] = useState({ open: false, editing: false, form: defaultAreaForm, id: null, cityId: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, name: '' });

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const q = query(collection(db, 'cities'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const q = query(collection(db, 'areas'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const cityAreas = (cityId) => areas.filter((a) => a.cityId === cityId);

  const saveCityMutation = useMutation({
    mutationFn: (data) => adminService.manageCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success(cityModal.editing ? 'City updated' : 'City added');
      setCityModal({ open: false, editing: false, form: defaultCityForm, id: null });
    },
    onError: (err) => toast.error(err.message),
  });

  const saveAreaMutation = useMutation({
    mutationFn: (data) => adminService.manageArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      toast.success(areaModal.editing ? 'Area updated' : 'Area added');
      setAreaModal({ open: false, editing: false, form: defaultAreaForm, id: null, cityId: null });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }) => {
      await deleteDoc(doc(db, type === 'city' ? 'cities' : 'areas', id));
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [vars.type === 'city' ? 'cities' : 'areas'] });
      toast.success(`${vars.type === 'city' ? 'City' : 'Area'} deleted`);
      setDeleteModal({ open: false, type: '', id: null, name: '' });
    },
    onError: (err) => toast.error(err.message),
  });

  const openAddCity = () => setCityModal({ open: true, editing: false, form: defaultCityForm, id: null });
  const openEditCity = (city) => setCityModal({ open: true, editing: true, form: { name: city.name, state: city.state, status: city.status }, id: city.id });

  const openAddArea = (cityId) => setAreaModal({ open: true, editing: false, form: defaultAreaForm, id: null, cityId });
  const openEditArea = (area) => setAreaModal({ open: true, editing: true, form: { name: area.name, pincode: area.pincode }, id: area.id, cityId: area.cityId });

  const handleSaveCity = (e) => {
    e.preventDefault();
    if (!cityModal.form.name.trim()) return toast.error('City name is required');
    saveCityMutation.mutate(cityModal.editing ? { ...cityModal.form, id: cityModal.id } : cityModal.form);
  };

  const handleSaveArea = (e) => {
    e.preventDefault();
    if (!areaModal.form.name.trim()) return toast.error('Area name is required');
    saveAreaMutation.mutate(areaModal.editing ? { ...areaModal.form, id: areaModal.id } : { ...areaModal.form, cityId: areaModal.cityId });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Cities & Areas</h1>
          <Button onClick={openAddCity} icon={FaPlus}>Add City</Button>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : cities.length === 0 ? (
            <EmptyState icon={FaCity} title="No cities added" description="Add your first city with areas to get started" action={{ label: 'Add City', icon: FaPlus, onClick: openAddCity }} />
          ) : (
            <div className="space-y-2">
              {cities.map((city) => {
                const isExpanded = expandedCity === city.id;
                const cityAreaList = cityAreas(city.id);
                return (
                  <div key={city.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCity(isExpanded ? null : city.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      {isExpanded ? <FaChevronDown size={12} className="text-gray-400" /> : <FaChevronRight size={12} className="text-gray-400" />}
                      <FaCity className="text-blue-500" size={16} />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{city.name}</span>
                        <span className="ml-2 text-xs text-gray-500">{city.state}</span>
                      </div>
                      <Badge variant={city.status === 'active' ? 'success' : 'danger'} size="sm">{city.status}</Badge>
                      <span className="text-xs text-gray-400">{cityAreaList.length} areas</span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openEditCity(city)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"><FaEdit size={14} /></button>
                        <button onClick={() => setDeleteModal({ open: true, type: 'city', id: city.id, name: city.name })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20"><FaTrash size={14} /></button>
                        <button onClick={() => openAddArea(city.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-900/20"><FaPlus size={14} /></button>
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            {cityAreaList.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-4">No areas added yet</p>
                            ) : (
                              <div className="space-y-1">
                                {cityAreaList.map((area) => (
                                  <div key={area.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <FaMapMarkerAlt className="text-gray-400" size={12} />
                                    <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{area.name}</span>
                                    {area.pincode && <span className="text-xs text-gray-500">{area.pincode}</span>}
                                    <button onClick={() => openEditArea(area)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"><FaEdit size={12} /></button>
                                    <button onClick={() => setDeleteModal({ open: true, type: 'area', id: area.id, name: area.name })} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"><FaTrash size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      <Modal isOpen={cityModal.open} onClose={() => setCityModal({ open: false, editing: false, form: defaultCityForm, id: null })} title={cityModal.editing ? 'Edit City' : 'Add City'} size="md">
        <form onSubmit={handleSaveCity} className="space-y-4">
          <Input label="City Name" name="name" value={cityModal.form.name} onChange={(e) => setCityModal({ ...cityModal, form: { ...cityModal.form, name: e.target.value } })} required placeholder="e.g. Mumbai" />
          <Input label="State" name="state" value={cityModal.form.state} onChange={(e) => setCityModal({ ...cityModal, form: { ...cityModal.form, state: e.target.value } })} required placeholder="e.g. Maharashtra" />
          <Select
            label="Status"
            name="status"
            value={cityModal.form.status}
            onChange={(e) => setCityModal({ ...cityModal, form: { ...cityModal.form, status: e.target.value } })}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setCityModal({ open: false, editing: false, form: defaultCityForm, id: null })}>Cancel</Button>
            <Button type="submit" loading={saveCityMutation.isPending}>{cityModal.editing ? 'Update' : 'Add City'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={areaModal.open} onClose={() => setAreaModal({ open: false, editing: false, form: defaultAreaForm, id: null, cityId: null })} title={areaModal.editing ? 'Edit Area' : 'Add Area'} size="md">
        <form onSubmit={handleSaveArea} className="space-y-4">
          <Input label="Area Name" name="name" value={areaModal.form.name} onChange={(e) => setAreaModal({ ...areaModal, form: { ...areaModal.form, name: e.target.value } })} required placeholder="e.g. Andheri West" />
          <Input label="Pincode" name="pincode" value={areaModal.form.pincode} onChange={(e) => setAreaModal({ ...areaModal, form: { ...areaModal.form, pincode: e.target.value } })} placeholder="e.g. 400053" />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setAreaModal({ open: false, editing: false, form: defaultAreaForm, id: null, cityId: null })}>Cancel</Button>
            <Button type="submit" loading={saveAreaMutation.isPending}>{areaModal.editing ? 'Update' : 'Add Area'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, type: '', id: null, name: '' })} title={`Delete ${deleteModal.type === 'city' ? 'City' : 'Area'}`} size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong>"{deleteModal.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, type: '', id: null, name: '' })}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate({ type: deleteModal.type, id: deleteModal.id })}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
