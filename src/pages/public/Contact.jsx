import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaPaperPlane, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';

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

const contactInfo = [
  { icon: FaMapMarkerAlt, title: 'Our Address', content: '123, Sector 14, Gurugram, Haryana 122001, India', href: null },
  { icon: FaPhoneAlt, title: 'Phone Number', content: '+91 99999 99999', href: 'tel:+919999999999' },
  { icon: FaEnvelope, title: 'Email Address', content: 'support@labour.com', href: 'mailto:support@labour.com' },
  { icon: FaWhatsapp, title: 'WhatsApp', content: '+91 99999 99999', href: 'https://wa.me/919999999999' },
];

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
];

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = 'Contact Us - Labour.com';
  }, []);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

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
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto"
          >
            Have a question, feedback, or want to partner with us? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Send Us a Message</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </motion.div>

              <motion.form
                variants={fadeInUp}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name"
                    name="name"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                  />
                </div>

                <Input
                  label="Subject"
                  name="subject"
                  placeholder="How can we help you?"
                  error={errors.subject?.message}
                  {...register('subject', { required: 'Subject is required' })}
                />

                <TextArea
                  label="Message"
                  name="message"
                  placeholder="Tell us more about your query..."
                  rows={5}
                  error={errors.message?.message}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' },
                  })}
                />

                <Button type="submit" icon={FaPaperPlane} loading={isSubmitting}>
                  Send Message
                </Button>
              </motion.form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const Component = info.href ? 'a' : 'div';
                  const extraProps = info.href ? { href: info.href, target: info.href.startsWith('http') ? '_blank' : undefined, rel: info.href.startsWith('http') ? 'noopener noreferrer' : undefined } : {};
                  return (
                    <Component
                      key={info.title}
                      {...extraProps}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
                    >
                      <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <Icon className="text-blue-600 dark:text-blue-400" size={18} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{info.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{info.content}</p>
                    </Component>
                  );
                })}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white transition-all ${social.color}`}
                    >
                      <social.icon size={14} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-64">
                <iframe
                  title="Labour.com Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112318.70809808466!2d76.99377275!3d28.40891115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d1e3e4a3b21%3A0x5f6b1d1e3e4a3b21!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale dark:invert-[.85]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Prefer WhatsApp?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Chat with our support team instantly on WhatsApp. We typically respond within 5 minutes.
            </p>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
            >
              <FaWhatsapp size={18} />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
