import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = { user: null, loading: false };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="inline-block"
          >
            <FaSpinner className="text-3xl text-blue-600 dark:text-blue-400" />
          </motion.div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
