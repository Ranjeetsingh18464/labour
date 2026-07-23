import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaHammer, FaUserCheck, FaCity, FaArrowRight } from 'react-icons/fa';

const stats = [
  { icon: FaUserCheck, value: '50K+', label: 'Happy Customers' },
  { icon: FaHammer, value: '10K+', label: 'Trusted Labours' },
  { icon: FaCity, value: '500+', label: 'Cities Covered' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.8 + i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mason', label: 'Mason' },
  { value: 'cleaner', label: 'House Cleaner' },
  { value: 'driver', label: 'Driver' },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    navigate(`/find-labour?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Find Trusted Labour Near You{' '}
            <span className="text-blue-200">in Minutes</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10"
          >
            Connect with verified, skilled professionals for all your home and business needs. Reliable, affordable, and just a click away.
          </motion.p>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-2xl">
              <div className="relative flex-1">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Enter your city or area..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none rounded-xl"
                />
              </div>
              <div className="relative sm:w-44">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 pr-8 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 focus:outline-none rounded-xl cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <FaArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaSearch className="text-sm" />
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <button
              onClick={() => navigate('/find-labour')}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-semibold text-sm rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
            >
              Find Labour
            </button>
            <button
              onClick={() => navigate('/register-labour')}
              className="px-6 py-3 border-2 border-white/30 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors"
            >
              Register as Labour
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <stat.icon className="text-white text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-blue-100/70">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
