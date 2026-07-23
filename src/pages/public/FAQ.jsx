import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronDown, FaHammer, FaCreditCard, FaUserCheck, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import Input from '../../components/ui/Input';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const categories = [
  { id: 'all', label: 'All Questions', icon: FaQuestionCircle },
  { id: 'registration', label: 'Registration', icon: FaUserCheck },
  { id: 'booking', label: 'Booking', icon: FaHammer },
  { id: 'payment', label: 'Payment', icon: FaCreditCard },
  { id: 'safety', label: 'Safety', icon: FaShieldAlt },
];

const faqs = [
  {
    category: 'registration',
    q: 'How do I create an account?',
    a: 'Click on "Register" at the top right corner. Fill in your name, email, password, and select your role (Customer or Labour). Verify your email and you\'re all set.',
  },
  {
    category: 'registration',
    q: 'Can I register as both Customer and Labour?',
    a: 'Currently, each account is tied to one role. If you need both, you can create a separate account with a different email address.',
  },
  {
    category: 'registration',
    q: 'How do I register as a Labour?',
    a: 'Select "Labour" as your role during registration. After creating your account, you\'ll be guided to complete your profile with skills, experience, photos, and other details for verification.',
  },
  {
    category: 'registration',
    q: 'Is there any fee for registration?',
    a: 'Registration is completely free for both customers and labours. We only charge a nominal service fee on confirmed bookings.',
  },
  {
    category: 'registration',
    q: 'How do I verify my email?',
    a: 'After registration, you\'ll receive a verification email. Click the link in the email to verify your account. If you don\'t see it, check your spam folder.',
  },
  {
    category: 'booking',
    q: 'How do I find a labour near me?',
    a: 'Use the search bar on the homepage to enter your city and select a category. Browse through available profiles, compare ratings, and connect directly.',
  },
  {
    category: 'booking',
    q: 'Can I book a labour for multiple days?',
    a: 'Yes, you can discuss the duration directly with the labour. Many labours offer daily and monthly pricing options.',
  },
  {
    category: 'booking',
    q: 'How do I cancel a booking?',
    a: 'You can cancel a booking from your dashboard. Please review our cancellation policy for any applicable charges.',
  },
  {
    category: 'booking',
    q: 'Can I schedule a booking in advance?',
    a: 'Yes, you can contact labours in advance and schedule a convenient time. Most professionals are happy to plan ahead.',
  },
  {
    category: 'booking',
    q: 'What if the labour doesn\'t show up?',
    a: 'If a labour fails to show up without prior notice, please report this through our support system. We take reliability seriously.',
  },
  {
    category: 'payment',
    q: 'How does payment work?',
    a: 'Payment is made directly between you and the labour. We display estimated charges on profiles so there are no surprises.',
  },
  {
    category: 'payment',
    q: 'Is my payment information secure?',
    a: 'We don\'t store any payment information on our platform. All transactions happen directly between you and the service provider.',
  },
  {
    category: 'payment',
    q: 'Are there any hidden charges?',
    a: 'No hidden charges. The pricing shown on each labour\'s profile is transparent. Always confirm the final amount with the labour before starting work.',
  },
  {
    category: 'payment',
    q: 'Can I pay after the work is done?',
    a: 'Payment terms are negotiated directly with the labour. Most professionals prefer payment upon completion or on a daily basis for ongoing work.',
  },
  {
    category: 'safety',
    q: 'Are labours on your platform verified?',
    a: 'Yes, every labour undergoes a verification process including ID verification, skill assessment, and background checks before being listed.',
  },
  {
    category: 'safety',
    q: 'What if I\'m not satisfied with the work?',
    a: 'First, discuss your concerns with the labour directly. If the issue persists, contact our support team and we\'ll help mediate a fair resolution.',
  },
  {
    category: 'safety',
    q: 'How do you ensure labour quality?',
    a: 'We maintain quality through ID verification, customer reviews, ratings, and regular follow-ups. Labours with consistent low ratings are removed from the platform.',
  },
  {
    category: 'safety',
    q: 'Can I report a problem with a labour?',
    a: 'Yes, you can report issues through your dashboard or by contacting our support team. All reports are investigated promptly and confidentially.',
  },
];

function AccordionItem({ faq, isOpen, onClick }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors hover:border-blue-200 dark:hover:border-blue-800">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm pr-4">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <FaChevronDown className="text-gray-400" size={14} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 leading-relaxed">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryButton({ cat, isActive, onClick }) {
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap
        ${isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
        }
      `}
    >
      <Icon size={14} />
      {cat.label}
    </button>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = 'FAQ - Labour.com';
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = !searchQuery ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 py-24">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto mb-8"
          >
            Find answers to common questions about using Labour.com
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            {categories.map((cat) => (
              <CategoryButton
                key={cat.id}
                cat={cat}
                isActive={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <FaQuestionCircle className="text-gray-300 dark:text-gray-600 text-5xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No matching questions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try a different search term or category
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => {
                const globalIndex = faqs.indexOf(faq);
                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <AccordionItem
                      faq={faq}
                      isOpen={openIndex === globalIndex}
                      onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                    />
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Still Have Questions?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Contact Support
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                <FaQuestionCircle size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
