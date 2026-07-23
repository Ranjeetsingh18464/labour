import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaUser, FaPhoneAlt, FaGoogle, FaEye, FaEyeSlash, FaHammer, FaUserTie } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

const roles = [
  { value: 'customer', label: 'Customer', icon: FaUserTie },
  { value: 'labour', label: 'Labour', icon: FaHammer },
];

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    document.title = 'Register - Labour.com';
  }, []);

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password, { ...data, role: selectedRole });
      toast.success('Account created successfully!');
      if (selectedRole === 'labour') {
        navigate('/labour/register', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Account created with Google!');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Google sign up failed');
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
            <FaUserTie className="text-white text-5xl" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Join Labour.com</h2>
          <p className="text-blue-100/80 text-lg max-w-md mx-auto">
            Whether you need a professional or are one, start your journey with us today.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { title: 'For Customers', desc: 'Find verified professionals near you' },
              { title: 'For Labours', desc: 'Get more work and grow your business' },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-left border border-white/10">
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-blue-100/60 text-xs mt-0.5">{item.desc}</p>
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
              <p className="text-gray-500 dark:text-gray-400 text-sm">Create your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                icon={FaUser}
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />

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

              <Input
                label="Mobile Number"
                name="mobile"
                type="tel"
                placeholder="+91 99999 99999"
                icon={FaPhoneAlt}
                error={errors.mobile?.message}
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: { value: /^\+?[\d\s-]{10,15}$/, message: 'Invalid mobile number' },
                })}
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  icon={FaLock}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
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

              <div className="relative">
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  icon={FaLock}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  I want to join as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`
                          flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all
                          ${isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500'
                          }
                        `}
                      >
                        <Icon className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} size={16} />
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                  {...register('terms', { required: 'You must accept the terms' })}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.terms.message}</p>
              )}

              <Button type="submit" fullWidth loading={isSubmitting}>
                Create Account
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
              onClick={handleGoogleSignUp}
              loading={googleLoading}
            >
              Sign up with Google
            </Button>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
