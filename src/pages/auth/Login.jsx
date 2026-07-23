import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash, FaHammer } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = 'Login - Labour.com';
  }, []);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Logged in with Google successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Google sign in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 items-center justify-center"
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative text-center px-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            <FaHammer className="text-white text-5xl" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-blue-100/80 text-lg max-w-md mx-auto">
            Find trusted labour near you. Connect with verified professionals for all your needs.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mason', 'Driver'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white/80 text-sm font-medium border border-white/10">
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-2">
                <FaHammer className="text-blue-600 dark:text-blue-400" />
                Labour.com
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your account</p>
            </div>

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

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  icon={FaLock}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" fullWidth loading={isSubmitting}>
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">OR</span>
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              icon={FaGoogle}
              onClick={handleGoogleLogin}
              loading={googleLoading}
            >
              Sign in with Google
            </Button>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
