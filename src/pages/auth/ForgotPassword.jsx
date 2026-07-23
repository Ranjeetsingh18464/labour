import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaHammer } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = 'Forgot Password - Labour.com';
  }, []);

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
              <FaHammer className="text-blue-600 dark:text-blue-400" />
              Labour.com
            </Link>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
              </p>
              <Button variant="outline" fullWidth onClick={() => setSent(false)}>
                Send Again
              </Button>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <FaArrowLeft size={12} />
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  icon={FaEnvelope}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  })}
                />

                <Button type="submit" fullWidth loading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 mt-6 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 w-full"
              >
                <FaArrowLeft size={12} />
                Back to Login
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
