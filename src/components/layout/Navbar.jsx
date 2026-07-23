import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSearch, FaMoon, FaSun, FaChevronDown, FaUser, FaTachometerAlt, FaSignOutAlt, FaHammer, FaUserCircle } from 'react-icons/fa';
import { HiHome, HiInformationCircle, HiPhone, HiCollection } from 'react-icons/hi';

const navLinks = [
  { name: 'Home', path: '/', icon: HiHome },
  { name: 'Find Labour', path: '/find-labour', icon: FaSearch },
  { name: 'Categories', path: '/categories', icon: HiCollection },
  { name: 'About', path: '/about', icon: HiInformationCircle },
  { name: 'Contact', path: '/contact', icon: HiPhone },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.2 } },
};

import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const displayUser = userData || user;
  const isLabour = displayUser?.role === 'labour';
  const filteredLinks = isLabour
    ? navLinks.filter((l) => l.name !== 'Find Labour' && l.name !== 'Categories')
    : navLinks;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                <FaHammer className="text-2xl" />
                <span className="hidden sm:inline">Labour.com</span>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {filteredLinks.map((link) => (
                  <NavLink key={link.path} to={link.path} className={linkClass}>
                    <link.icon className="text-base" />
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search labours..."
                      className="w-full pl-9 pr-3 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Open search"
                  >
                    <FaSearch className="text-lg" />
                  </button>
                )}
              </AnimatePresence>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
              </button>

              <div className="hidden sm:flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {displayUser?.displayName?.[0] || displayUser?.name?.[0] || 'U'}
                      </div>
                      <FaChevronDown className={`text-xs text-gray-500 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                        >
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayUser?.displayName || displayUser?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{displayUser?.email || ''}</p>
                          </div>
                          {displayUser?.role === 'labour' ? (
                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>
                              <FaUserCircle className="text-gray-400" /> My Profile
                            </Link>
                          ) : (
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>
                              <FaUser className="text-gray-400" /> Profile
                            </Link>
                          )}
                          <Link to={displayUser?.role === 'admin' || displayUser?.role === 'super-admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>
                            <FaTachometerAlt className="text-gray-400" /> Dashboard
                          </Link>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }}>
                            <FaSignOutAlt /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Register
                    </Link>
                  </>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400" onClick={() => setMobileOpen(false)}>
                  <FaHammer className="text-xl" />
                  Labour.com
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="p-4">
                <div className="space-y-1">
                  {filteredLinks.map((link) => (
                    <NavLink key={link.path} to={link.path} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                      <link.icon className="text-lg" />
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                {isLoggedIn ? (
                  <div className="space-y-1">
                    {displayUser?.role === 'labour' ? (
                      <NavLink to="/dashboard" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                        <FaUserCircle className="text-lg" /> My Profile
                      </NavLink>
                    ) : (
                      <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                        <FaUser className="text-lg" /> Profile
                      </NavLink>
                    )}
                    <NavLink to={displayUser?.role === 'admin' || displayUser?.role === 'super-admin' ? '/admin' : '/dashboard'} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                      <FaTachometerAlt className="text-lg" /> Dashboard
                    </NavLink>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => { setMobileOpen(false); logout(); navigate('/'); }}>
                      <FaSignOutAlt className="text-lg" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
