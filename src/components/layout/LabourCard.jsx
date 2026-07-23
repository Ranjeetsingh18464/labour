import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaPhoneAlt, FaWhatsapp, FaHeart, FaRegHeart, FaCheckCircle, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function LabourCard({ labour, onFavorite, isFavorite }) {
  const {
    name = 'Unknown Labour',
    labourId = 'N/A',
    photo,
    verified = false,
    category = 'General',
    subcategory = '',
    city = '',
    area = '',
    rating = 0,
    experience = 0,
    dailyCharges = 0,
    monthlyCharges = 0,
    available = false,
  } = labour || {};

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{name}</h3>
                {verified && <FaCheckCircle className="text-green-500 text-sm" title="Verified" />}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {labourId}</p>
            </div>
          </div>
          <button
            onClick={() => onFavorite?.(labour)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-400 text-lg hover:text-red-400 transition-colors" />
            )}
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{category}</span>
            {subcategory && <span className="text-gray-400"> &rsaquo; {subcategory}</span>}
          </p>

          {(city || area) && (
            <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <FaMapMarkerAlt className="text-xs shrink-0" />
              {[area, city].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={rating} />
          <span className="text-xs text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FaBriefcase className="text-gray-400 text-xs shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{experience} years exp.</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            available
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-green-500' : 'bg-gray-400'}`} />
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
          <div>
            {dailyCharges > 0 && (
              <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold">&#8377;{dailyCharges}<span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/day</span></p>
            )}
            {monthlyCharges > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">&#8377;{monthlyCharges}/month</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <button className="col-span-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
            View Profile
          </button>
          <a href={`tel:${labour?.phone || ''}`} className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <FaPhoneAlt className="text-xs" /> Call
          </a>
          <a href={`https://wa.me/${labour?.phone || ''}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            <FaWhatsapp className="text-xs" /> WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
