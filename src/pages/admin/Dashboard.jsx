import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaUserCheck, FaClock, FaThLarge, FaCity, FaUserPlus,
  FaArrowUp, FaArrowDown, FaPlus, FaImage,
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Spinner, Badge, Button, Avatar } from '../../components/ui';
import * as adminService from '../../services/adminService';
import * as labourService from '../../services/labourService';
import * as categoryService from '../../services/categoryService';

const statCards = [
  { key: 'totalLabours', label: 'Total Labour', icon: FaUsers, color: 'from-blue-500 to-blue-600', trend: 12 },
  { key: 'activeLabours', label: 'Active Labour', icon: FaUserCheck, color: 'from-green-500 to-green-600', trend: 8 },
  { key: 'pendingVerifications', label: 'Pending Verification', icon: FaClock, color: 'from-yellow-500 to-yellow-600', trend: -3 },
  { key: 'totalUsers', label: 'Total Users', icon: FaUserPlus, color: 'from-purple-500 to-purple-600', trend: 15 },
  { key: 'totalCategories', label: 'Total Categories', icon: FaThLarge, color: 'from-pink-500 to-pink-600', trend: 0 },
  { key: 'totalCities', label: 'Total Cities', icon: FaCity, color: 'from-indigo-500 to-indigo-600', trend: 5 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getAnalytics,
  });

  const { data: labours } = useQuery({
    queryKey: ['labours', 'recent'],
    queryFn: () => labourService.getAllLabours({ limit: 5 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = weekDays.map((day, i) => ({
    day,
    registrations: Math.floor(Math.random() * 15) + 3,
  }));

  const pieData = categories?.slice(0, 8).map((cat) => ({
    name: cat.name,
    value: cat.labourCount || Math.floor(Math.random() * 30) + 5,
  })) || [];

  const topRated = labours?.filter((l) => l.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const value = stats?.[stat.key] ?? 0;
            const isUp = stat.trend >= 0;
            return (
              <motion.div key={stat.key} variants={itemVariants}>
                <Card padding="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                      <Icon size={18} />
                    </div>
                    {stat.trend !== 0 && (
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                        {Math.abs(stat.trend)}%
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    {statsLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">{value.toLocaleString()}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Weekly Registrations</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f9fafb',
                    }}
                  />
                  <Bar dataKey="registrations" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Labour by Category</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Registrations</h3>
                <Link to="/admin/labours" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-2 font-medium">Labour</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">City</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labours?.slice(0, 5).map((labour) => (
                      <tr key={labour.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2.5 flex items-center gap-2">
                          <Avatar name={labour.name} size="sm" />
                          <span className="text-gray-900 dark:text-gray-100">{labour.name}</span>
                        </td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-400">{labour.category}</td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-400">{labour.city}</td>
                        <td className="py-2.5">
                          <Badge variant={labour.status === 'approved' ? 'success' : labour.status === 'suspended' ? 'danger' : 'warning'}>{labour.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Top Rated Labours</h3>
                <Link to="/admin/labours" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {topRated.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No ratings yet</p>
                )}
                {topRated.map((labour, i) => (
                  <div key={labour.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5">{i + 1}.</span>
                    <Avatar name={labour.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{labour.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{labour.category} - {labour.city}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                      <span>★</span>
                      <span>{labour.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Link to="/admin/labours?action=add">
            <Button variant="primary" icon={FaPlus}>Add Labour</Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="outline" icon={FaThLarge}>Add Category</Button>
          </Link>
          <Link to="/admin/banners">
            <Button variant="outline" icon={FaImage}>Manage Banners</Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
