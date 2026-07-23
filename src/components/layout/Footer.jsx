import { Link } from 'react-router-dom';
import { FaHammer, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const categories = [
  { name: 'Plumber', path: '/category/plumber' },
  { name: 'Electrician', path: '/category/electrician' },
  { name: 'Carpenter', path: '/category/carpenter' },
  { name: 'Painter', path: '/category/painter' },
  { name: 'Mason', path: '/category/mason' },
  { name: 'Gardener', path: '/category/gardener' },
  { name: 'House Cleaner', path: '/category/house-cleaner' },
  { name: 'Driver', path: '/category/driver' },
];

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'FAQ', path: '/faq' },
];

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <FaHammer className="text-blue-400 text-2xl" />
              Labour.com
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              India's trusted platform connecting skilled labour with customers. Find verified professionals for all your home and business needs.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FaMapMarkerAlt className="mt-1 text-blue-400 shrink-0" />
                <span>123, Sector 14, Gurugram, Haryana 122001, India</span>
              </li>
              <li>
                <a href="tel:+919999999999" className="flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  <FaPhoneAlt className="text-blue-400 shrink-0" />
                  +91 99999 99999
                </a>
              </li>
              <li>
                <a href="mailto:support@labour.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  <FaEnvelope className="text-blue-400 shrink-0" />
                  support@labour.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors">
                  <FaWhatsapp className="text-green-400 text-base shrink-0" />
                  +91 99999 99999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Labour.com. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link to="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
