import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaUserCheck, FaHandshake, FaArrowRight, FaStar, FaMapMarkerAlt, FaChevronDown, FaHammer, FaBolt, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { HiMenuAlt4 } from 'react-icons/hi';
import HeroSection from '../../components/layout/HeroSection';
import LabourCard from '../../components/layout/LabourCard';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getCategories } from '../../services/categoryService';
import { getAllLabours } from '../../services/labourService';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const howItWorks = [
  {
    icon: FaSearch,
    title: 'Search',
    description: 'Browse through thousands of verified labour profiles near you.',
    step: '01',
  },
  {
    icon: FaUserCheck,
    title: 'Compare',
    description: 'Compare ratings, experience, and charges to find the best match.',
    step: '02',
  },
  {
    icon: FaHandshake,
    title: 'Hire',
    description: 'Connect directly and hire with confidence. No middlemen.',
    step: '03',
  },
];

const cities = [
  { name: 'Delhi', icon: FaMapMarkerAlt, count: '2,500+ Labours' },
  { name: 'Mumbai', icon: FaMapMarkerAlt, count: '3,200+ Labours' },
  { name: 'Bangalore', icon: FaMapMarkerAlt, count: '1,800+ Labours' },
  { name: 'Hyderabad', icon: FaMapMarkerAlt, count: '1,500+ Labours' },
  { name: 'Chennai', icon: FaMapMarkerAlt, count: '1,200+ Labours' },
  { name: 'Kolkata', icon: FaMapMarkerAlt, count: '1,000+ Labours' },
  { name: 'Pune', icon: FaMapMarkerAlt, count: '900+ Labours' },
  { name: 'Ahmedabad', icon: FaMapMarkerAlt, count: '800+ Labours' },
  { name: 'Jaipur', icon: FaMapMarkerAlt, count: '700+ Labours' },
  { name: 'Lucknow', icon: FaMapMarkerAlt, count: '600+ Labours' },
  { name: 'Chandigarh', icon: FaMapMarkerAlt, count: '500+ Labours' },
  { name: 'Indore', icon: FaMapMarkerAlt, count: '400+ Labours' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Homeowner',
    content: 'Found an amazing plumber within minutes. The platform is incredibly easy to use and the labour was professional and on time.',
    rating: 5,
    location: 'Delhi',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Small Business Owner',
    content: 'Labour.com helped me find reliable electricians for my shop. Highly recommended for anyone needing quick, trustworthy help.',
    rating: 5,
    location: 'Mumbai',
  },
  {
    name: 'Anita Patel',
    role: 'Customer',
    content: 'I was skeptical at first, but the verified profiles and reviews gave me confidence. The carpenter I hired did excellent work.',
    rating: 4,
    location: 'Bangalore',
  },
];

const faqs = [
  {
    q: 'How do I find a labour near me?',
    a: 'Simply enter your city in the search bar on our homepage, select a category, and browse through available professionals in your area.',
  },
  {
    q: 'Are the labours verified?',
    a: 'Yes, all labours on our platform go through a verification process including ID verification, background checks, and skill assessments.',
  },
  {
    q: 'How do I pay for services?',
    a: 'Payment is made directly between you and the labour. We provide transparent pricing information so you know the charges upfront.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes, you can cancel a booking directly through the platform. Please refer to our cancellation policy for more details.',
  },
  {
    q: 'How do I register as a labour?',
    a: 'Click on "Register as Labour" on our homepage, fill in your details, and our team will verify your profile before listing you on the platform.',
  },
  {
    q: 'What if I\'m not satisfied with the work?',
    a: 'We encourage you to communicate directly with the labour. If issues persist, our support team will help resolve the matter.',
  },
];

const categoryIcons = {
  plumber: FaBolt,
  electrician: FaBolt,
  carpenter: FaHammer,
  painter: FaLeaf,
  mason: FaHammer,
  cleaner: FaLeaf,
  driver: FaMapMarkerAlt,
  gardener: FaLeaf,
};

function SectionHeading({ title, subtitle, light }) {
  return (
    <div className="text-center mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-3xl sm:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-gray-900 dark:text-white'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-blue-100/70' : 'text-gray-500 dark:text-gray-400'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function AccordionItem({ faq, isOpen, onClick }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400 shrink-0" size={14} />
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
            <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = 'Labour.com - Find Trusted Labour Near You';
  }, []);

  const { data: categories, isLoading: catLoading, isError: catError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: labours, isLoading: labourLoading, isError: labourError } = useQuery({
    queryKey: ['labours', 'featured'],
    queryFn: () => getAllLabours({ status: 'approved', verified: true, limit: 8 }),
  });

  const { data: topLabours, isLoading: topLoading, isError: topError } = useQuery({
    queryKey: ['labours', 'top-rated'],
    queryFn: () => getAllLabours({ status: 'approved', verified: true, limit: 8 }),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Popular Categories"
            subtitle="Explore our wide range of service categories"
          />

          {catLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} type="card" className="h-28" />
              ))}
            </div>
          ) : catError ? (
            <EmptyState
              title="Failed to load categories"
              description="Please try again later"
            />
          ) : categories?.length === 0 ? (
            <EmptyState
              title="No categories available"
              description="Categories will appear here once added"
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {(categories || []).slice(0, 12).map((cat) => {
                const Icon = categoryIcons[cat.name?.toLowerCase()] || FaHammer;
                return (
                  <motion.div
                    key={cat.id}
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/find-labour?category=${cat.slug || cat.name?.toLowerCase()}`)}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all group"
                  >
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm capitalize">{cat.name}</h3>
                    {cat.count !== undefined && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.count} labours</p>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How It Works"
            subtitle="Three simple steps to get the job done"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center"
                >
                  <span className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </span>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="text-blue-600 dark:text-blue-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Featured Labours"
            subtitle="Hand-picked professionals ready to help"
          />

          {labourLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} type="card" className="h-72" />
              ))}
            </div>
          ) : labourError ? (
            <EmptyState
              title="Failed to load labours"
              description="Please try again later"
            />
          ) : labours?.length === 0 ? (
            <EmptyState
              title="No labours available"
              description="Check back soon for new listings"
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(labours || []).slice(0, 8).map((labour) => (
                <motion.div key={labour.id} variants={fadeInUp}>
                  <LabourCard labour={labour} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button variant="outline" icon={FaArrowRight} onClick={() => navigate('/find-labour')}>
              View All Labours
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Top Rated Labours"
            subtitle="Our highest-rated professionals"
          />

          {topLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} type="card" className="h-72" />
              ))}
            </div>
          ) : topError ? (
            <EmptyState
              title="Failed to load labours"
              description="Please try again later"
            />
          ) : topLabours?.length === 0 ? (
            <EmptyState
              title="No labours available"
              description="Check back soon for new listings"
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(topLabours || []).slice(0, 8).map((labour) => (
                <motion.div key={labour.id} variants={fadeInUp}>
                  <LabourCard labour={labour} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Cities We Cover"
            subtitle="Find labours in your city"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {cities.map((city) => (
              <motion.div
                key={city.name}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/find-labour?location=${city.name}`)}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 text-center cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
              >
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-xl mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{city.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{city.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Real stories from real people"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FaStar
                      key={j}
                      className={j < t.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}
                      size={14}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role} &middot; {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <AccordionItem
                  faq={faq}
                  isOpen={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 py-20">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Are You a Skilled Professional?
            </h2>
            <p className="text-lg text-blue-100/80 mb-8 max-w-2xl mx-auto">
              Join thousands of labours across India. Get verified, showcase your skills, and start earning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/register-labour')}
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                Register as Labour
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/faq')}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
