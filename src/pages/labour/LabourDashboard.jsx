import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserTie, FaCalendarCheck, FaStar, FaShieldAlt, FaEdit, FaExternalLinkAlt, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { collection, getDocs, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getLabourReviews, getAverageRating } from '../../services/reviewService';
import { Card, Spinner, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  pending: { label: 'Pending Approval', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', badge: 'warning' },
  approved: { label: 'Approved', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', badge: 'success' },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', badge: 'danger' },
  suspended: { label: 'Suspended', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', badge: 'danger' },
};

export default function LabourDashboard() {
  const { user, userData } = useAuth();

  const { data: labour, isLoading: labourLoading } = useQuery({
    queryKey: ['labour', 'user', user?.uid],
    queryFn: async () => {
      const q = query(collection(db, 'labours'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), firestoreLimit(1));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    },
    enabled: !!user,
  });

  const labourId = labour?.id;

  const { data: bookings = [] } = useQuery({
    queryKey: ['labour-bookings', labourId],
    queryFn: async () => {
      const q = query(collection(db, 'bookings'), where('labourId', '==', labourId), orderBy('createdAt', 'desc'), firestoreLimit(5));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    enabled: !!labourId,
  });

  const { data: ratingData } = useQuery({
    queryKey: ['rating', labourId],
    queryFn: () => getAverageRating(labourId),
    enabled: !!labourId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', labourId],
    queryFn: () => getLabourReviews(labourId),
    enabled: !!labourId,
  });

  if (labourLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!labour) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaUserTie className="text-blue-600 dark:text-blue-400 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Labour Profile Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Complete your registration to start receiving bookings.</p>
        <Link
          to="/labour/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          <FaEdit /> Complete Registration
        </Link>
      </div>
    );
  }

  const status = labour.status || 'pending';
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {labour.photo ? (
                <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400"><FaUserTie size={28} /></div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{labour.name || 'Labour'}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <FaMapMarkerAlt /> {[labour.area, labour.city, labour.state].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={config.badge}>{config.label}</Badge>
            <Link
              to={`/labour/${labourId}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <FaExternalLinkAlt size={12} /> View Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <FaCalendarCheck size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bookings.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
              </div>
            </div>
          </Card>
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <FaStar size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ratingData?.averageRating?.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{ratingData?.totalReviews || 0} Reviews</p>
              </div>
            </div>
          </Card>
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${config.bg} ${config.color}`}>
                <FaShieldAlt size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{config.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              </div>
            </div>
          </Card>
          <Card padding="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <FaMoneyBillWave size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{labour.dailyCharges || 0}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{labour.monthlyCharges ? `₹${labour.monthlyCharges}/mo` : 'Per Day'}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card padding="p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaCalendarCheck /> Recent Bookings
              </h2>
              {bookings.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FaCalendarCheck size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No bookings yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-2 pr-3">Customer</th>
                        <th className="pb-2 pr-3">Date</th>
                        <th className="pb-2 pr-3">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 pr-3 text-gray-700 dark:text-gray-300">{b.userName || 'N/A'}</td>
                          <td className="py-3 pr-3 text-gray-500">{b.serviceDate || '-'}</td>
                          <td className="py-3 pr-3 text-gray-700 dark:text-gray-300">₹{b.dailyCharges || b.monthlyCharges || 0}</td>
                          <td className="py-3">
                            <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}>
                              {b.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card padding="p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaEdit /> Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to={`/labour/${labourId}`}
                  className="flex items-center gap-3 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaExternalLinkAlt className="text-blue-500" size={14} />
                  View Public Profile
                </Link>
                <Link
                  to="/labour/register"
                  className="flex items-center gap-3 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaEdit className="text-green-500" size={14} />
                  Edit Profile
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaCalendarCheck className="text-purple-500" size={14} />
                  Browse Jobs
                </Link>
              </div>
            </Card>

            <Card padding="p-5" className="mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaStar /> Recent Reviews
              </h2>
              {reviews.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <FaStar size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((r) => (
                    <div key={r.id} className="pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{r.userName || 'Anonymous'}</span>
                        <span className="text-xs text-yellow-500 flex items-center gap-1">
                          <FaStar size={12} /> {r.rating}
                        </span>
                      </div>
                      {r.comment && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
