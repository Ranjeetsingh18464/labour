import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTachometerAlt, FaUsers, FaThLarge, FaCity, FaCalendarCheck, FaStar, FaImages, FaChartBar, FaCog, FaBars, FaTimes, FaBell, FaMoon, FaSun, FaChevronDown, FaSearch } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: FaTachometerAlt, end: true },
  { name: 'Manage Labours', path: '/admin/labours', icon: FaUsers },
  { name: 'Categories', path: '/admin/categories', icon: FaThLarge },
  { name: 'Cities/Areas', path: '/admin/cities', icon: FaCity },
  { name: 'Bookings', path: '/admin/bookings', icon: FaCalendarCheck },
  { name: 'Reviews', path: '/admin/reviews', icon: FaStar },
  { name: 'Banners', path: '/admin/banners', icon: FaImages },
  { name: 'Reports', path: '/admin/reports', icon: FaChartBar },
  { name: 'Settings', path: '/admin/settings', icon: FaCog },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col lg:translate-x-0"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <NavLink to="/admin" className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400">
            <FaTachometerAlt className="text-xl" />
            <span>Admin Panel</span>
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FaTimes className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.end} className={linkClass} onClick={() => setSidebarOpen(false)}>
              <link.icon className="text-base" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <NavLink to="/" className={linkClass}>
            <HiHome className="text-base" />
            Back to Site
          </NavLink>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <FaBars className="text-lg" />
          </button>

          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle dark mode">
              {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
            <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Notifications">
              <FaBell className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100 leading-tight">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
              </div>
              <FaChevronDown className="text-xs text-gray-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
