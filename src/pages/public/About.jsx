import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHammer, FaUsers, FaCity, FaStar, FaCalendarAlt, FaBullseye, FaEye, FaHeart, FaCheckCircle, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const stats = [
  { icon: FaHammer, value: '10,000+', label: 'Verified Labours' },
  { icon: FaCity, value: '500+', label: 'Cities Covered' },
  { icon: FaUsers, value: '50,000+', label: 'Happy Customers' },
  { icon: FaCalendarAlt, value: '5+', label: 'Years of Service' },
];

const values = [
  {
    icon: FaBullseye,
    title: 'Mission',
    description: 'To bridge the gap between skilled labour and those who need them, creating opportunities and enabling reliable service delivery across India.',
  },
  {
    icon: FaEye,
    title: 'Vision',
    description: 'To become India\'s most trusted platform for connecting customers with verified, skilled professionals, empowering millions of labours.',
  },
  {
    icon: FaHeart,
    title: 'Values',
    description: 'Trust, transparency, and quality are at our core. We believe in fair opportunities, verified profiles, and complete customer satisfaction.',
  },
];

const team = [
  { name: 'Rahul Verma', role: 'Founder & CEO', bio: '10+ years in tech and skilling industries.' },
  { name: 'Priya Singh', role: 'COO', bio: 'Operations expert with a passion for social impact.' },
  { name: 'Amit Sharma', role: 'CTO', bio: 'Full-stack developer and platform architect.' },
  { name: 'Neha Gupta', role: 'Head of Partnerships', bio: 'Building relationships with labour unions and skill centers.' },
];

function StatCounter({ value, label, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700"
    >
      <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="text-blue-600 dark:text-blue-400 text-2xl" />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}

export default function About() {
  useEffect(() => {
    document.title = 'About Us - Labour.com';
  }, []);

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
            About Labour.com
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto"
          >
            We are on a mission to transform how India connects with skilled labour. Reliable, transparent, and built for everyone.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Connecting <span className="text-blue-600 dark:text-blue-400">Skilled Labour</span> with Those Who Need Them
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Labour.com was founded with a simple idea: make it easy for people to find trusted, skilled professionals for their home and business needs, while creating dignified livelihood opportunities for labourers.
                </p>
                <p>
                  We verify every professional on our platform, provide transparent pricing, and ensure a seamless experience from search to hire. Our platform currently serves over 50,000 customers across 500+ cities in India.
                </p>
                <p>
                  We are committed to empowering the workforce of India by providing them with a digital platform to showcase their skills, get discovered, and earn a fair wage.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: FaCheckCircle, text: 'Verified Professionals' },
                { icon: FaCheckCircle, text: 'Transparent Pricing' },
                { icon: FaCheckCircle, text: 'Pan-India Coverage' },
                { icon: FaCheckCircle, text: '24/7 Support' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 flex items-center gap-3 border border-gray-200 dark:border-gray-700">
                  <item.icon className="text-green-500 shrink-0" size={18} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Our Mission, Vision & Values</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeInUp}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="text-blue-600 dark:text-blue-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Meet Our Team</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              The people behind Labour.com
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700"
              >
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{member.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FaQuoteLeft className="text-blue-600 dark:text-blue-400 text-4xl mx-auto mb-6 opacity-50" />
            <blockquote className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 font-medium italic mb-6">
              &ldquo;Labour.com is not just a platform — it&apos;s a movement to dignify skilled work and make hiring simple, safe, and fair for every Indian.&rdquo;
            </blockquote>
            <p className="font-semibold text-gray-900 dark:text-white">Rahul Verma</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Founder & CEO, Labour.com</p>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 py-20">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100/80 mb-8 max-w-xl mx-auto">
            Join thousands of customers and labours who trust Labour.com every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              Find Labour
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Register as Labour
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
