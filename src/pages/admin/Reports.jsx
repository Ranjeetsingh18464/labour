import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FaUsers, FaCalendarCheck, FaRupeeSign, FaFileExcel, FaFilePdf, FaDownload,
  FaStar, FaEye,
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Select, Badge, Avatar, Spinner } from '../../components/ui';
import * as adminService from '../../services/adminService';
import * as labourService from '../../services/labourService';
import * as bookingService from '../../services/bookingService';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const rangeOptions = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'Last 7 Days' },
  { value: 'monthly', label: 'Last 30 Days' },
  { value: 'yearly', label: 'Last Year' },
];

export default function Reports() {
  const [range, setRange] = useState('weekly');

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['reports', range],
    queryFn: () => adminService.getReports(range),
  });

  const { data: allLabours = [] } = useQuery({
    queryKey: ['labours', 'all'],
    queryFn: () => labourService.getAllLabours(),
  });

  const { data: allBookings = [] } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const totalRevenue = useMemo(() => {
    return allBookings.filter((b) => b.status === 'completed').reduce((sum, b) => sum + (b.amount || 0), 0);
  }, [allBookings]);

  const dailyRegData = useMemo(() => {
    const days = range === 'daily' ? 1 : range === 'weekly' ? 7 : range === 'monthly' ? 30 : 365;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const count = reports?.labours?.filter((l) => {
        const d = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt);
        return d.toDateString() === date.toDateString();
      }).length || 0;
      data.push({ date: dateStr, registrations: count });
    }
    return data;
  }, [reports, range]);

  const categoryData = useMemo(() => {
    const map = {};
    allLabours.forEach((l) => {
      const cat = l.category || 'Other';
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allLabours]);

  const cityData = useMemo(() => {
    const map = {};
    allLabours.forEach((l) => {
      const city = l.city || 'Other';
      map[city] = (map[city] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allLabours]);

  const topRated = useMemo(() => {
    return [...allLabours].filter((l) => l.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  }, [allLabours]);

  const mostBooked = useMemo(() => {
    const counts = {};
    allBookings.forEach((b) => {
      const key = b.labourId;
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([labourId, count]) => {
        const labour = allLabours.find((l) => l.id === labourId);
        return { ...labour, bookingCount: count };
      })
      .filter((l) => l?.name)
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 10);
  }, [allLabours, allBookings]);

  const exportCSV = () => {
    const headers = 'Name,Category,City,Status,Rating\n';
    const rows = allLabours.map((l) => `${l.name || ''},${l.category || ''},${l.city || ''},${l.status || ''},${l.rating || 0}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labour-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <div className="flex items-center gap-3">
            <Select name="range" value={range} onChange={(e) => setRange(e.target.value)} options={rangeOptions} className="w-40" />
            <Button variant="outline" size="sm" icon={FaFileExcel} onClick={exportCSV}>Export CSV</Button>
            <Button variant="outline" size="sm" icon={FaFilePdf}>Export PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><FaUsers size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Registrations</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{reports?.totalLabours || 0}</p>
              </div>
            </div>
          </Card>
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><FaCalendarCheck size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{reports?.totalBookings || 0}</p>
              </div>
            </div>
          </Card>
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><FaRupeeSign size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Registrations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyRegData}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                <Area type="monotone" dataKey="registrations" stroke="#3B82F6" fill="url(#colorReg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Category-Wise Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">City-Wise Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={cityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {cityData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Top Rated Labours</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {topRated.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No data</p>}
              {topRated.map((labour, i) => (
                <div key={labour.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="text-xs font-bold text-gray-400 w-5 text-right">{i + 1}</span>
                  <Avatar name={labour.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{labour.name}</p>
                    <p className="text-xs text-gray-500">{labour.category} - {labour.city}</p>
                  </div>
                  <span className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                    <FaStar size={12} /> {labour.rating?.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Most Booked Labours</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {mostBooked.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No data</p>}
              {mostBooked.map((labour, i) => (
                <div key={labour.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="text-xs font-bold text-gray-400 w-5 text-right">{i + 1}</span>
                  <Avatar name={labour.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{labour.name}</p>
                    <p className="text-xs text-gray-500">{labour.category} - {labour.city}</p>
                  </div>
                  <Badge variant="primary">{labour.bookingCount} bookings</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Most Viewed Labours</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {[...allLabours]
                .filter((l) => l.views)
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 10)
                .map((labour, i) => (
                  <div key={labour.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <span className="text-xs font-bold text-gray-400 w-5 text-right">{i + 1}</span>
                    <Avatar name={labour.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{labour.name}</p>
                      <p className="text-xs text-gray-500">{labour.category} - {labour.city}</p>
                    </div>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaEye size={12} /> {labour.views || 0}
                    </span>
                  </div>
                ))}
              {allLabours.filter((l) => l.views).length === 0 && <p className="text-sm text-gray-400 text-center py-8">No data</p>}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
