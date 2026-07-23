import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaUserTie } from 'react-icons/fa';
import RegistrationWizard from '../../components/labour/RegistrationWizard';
import { useAuth } from '../../context/AuthContext';
import { getAllLabours } from '../../services/labourService';
import { Spinner } from '../../components/ui';

export default function LabourRegistration() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { data: existingLabours, isLoading: labourLoading } = useQuery({
    queryKey: ['labours', 'user', user?.uid],
    queryFn: () => getAllLabours({ status: 'pending' }),
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/register', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!labourLoading && existingLabours?.length > 0) {
      const userLabour = existingLabours.find(l => l.userId === user?.uid);
      if (userLabour) {
        navigate('/labour/profile', { replace: true });
      }
    }
  }, [existingLabours, labourLoading, user, navigate]);

  if (authLoading || labourLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <FaUserTie className="text-blue-600 dark:text-blue-400 text-2xl" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Register as Labour
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Fill in your details to create your professional profile and start finding work opportunities.
          </p>
        </div>
        <RegistrationWizard />
      </div>
    </motion.div>
  );
}
