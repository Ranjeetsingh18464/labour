import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCog, FaPhone, FaBell, FaFire, FaChevronDown, FaChevronUp,
  FaSave, FaGlobe, FaKey,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, TextArea } from '../../components/ui';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { changePassword } from '../../services/authService';

const sections = [
  { id: 'general', label: 'General Settings', icon: FaCog },
  { id: 'contact', label: 'Contact Settings', icon: FaPhone },
  { id: 'seo', label: 'SEO Settings', icon: FaGlobe },
  { id: 'notifications', label: 'Notification Settings', icon: FaBell },
  { id: 'firebase', label: 'Firebase Settings', icon: FaFire },
  { id: 'password', label: 'Change Password', icon: FaKey },
];

const generalFields = [
  { name: 'siteName', label: 'Site Name', placeholder: 'Labour.com' },
  { name: 'tagline', label: 'Tagline', placeholder: 'Find trusted labour near you' },
  { name: 'logoUrl', label: 'Logo URL', placeholder: 'https://example.com/logo.png' },
  { name: 'faviconUrl', label: 'Favicon URL', placeholder: 'https://example.com/favicon.ico' },
];

const contactFields = [
  { name: 'address', label: 'Address', placeholder: '123 Main Street, City' },
  { name: 'phone', label: 'Phone', placeholder: '+91 9876543210' },
  { name: 'email', label: 'Email', placeholder: 'contact@labour.com' },
  { name: 'whatsapp', label: 'WhatsApp', placeholder: '+91 9876543210' },
];

const seoFields = [
  { name: 'metaTitle', label: 'Meta Title', placeholder: 'Labour.com - Find Trusted Labour' },
  { name: 'metaDescription', label: 'Meta Description', placeholder: 'Description for search engines', isTextarea: true },
  { name: 'metaKeywords', label: 'Meta Keywords', placeholder: 'labour, plumber, electrician, ...' },
];

const notificationFields = [
  { name: 'emailNotifications', label: 'Email Notifications', type: 'checkbox' },
  { name: 'smsNotifications', label: 'SMS Notifications', type: 'checkbox' },
  { name: 'bookingAlerts', label: 'Booking Alerts', type: 'checkbox' },
  { name: 'reviewAlerts', label: 'Review Alerts', type: 'checkbox' },
];

const firebaseFields = [
  { name: 'apiKey', label: 'API Key' },
  { name: 'authDomain', label: 'Auth Domain' },
  { name: 'projectId', label: 'Project ID' },
  { name: 'storageBucket', label: 'Storage Bucket' },
  { name: 'messagingSenderId', label: 'Messaging Sender ID' },
  { name: 'appId', label: 'App ID' },
];

const initialSettings = {
  general: { siteName: 'Labour.com', tagline: 'Find trusted labour near you', logoUrl: '', faviconUrl: '' },
  contact: { address: '', phone: '', email: '', whatsapp: '' },
  seo: { metaTitle: '', metaDescription: '', metaKeywords: '' },
  notifications: { emailNotifications: true, smsNotifications: false, bookingAlerts: true, reviewAlerts: true },
  firebase: { apiKey: '••••••••', authDomain: '••••••••', projectId: '••••••••', storageBucket: '••••••••', messagingSenderId: '••••••••', appId: '••••••••' },
};

export default function Settings() {
  const [expanded, setExpanded] = useState('general');
  const [settings, setSettings] = useState(initialSettings);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const saveMutation = useMutation({
    mutationFn: async ({ sectionId, data }) => {
      const ref = doc(db, 'settings', sectionId);
      await setDoc(ref, data, { merge: true });
    },
    onSuccess: () => toast.success('Settings saved successfully'),
    onError: (err) => toast.error(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (passwordData.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateField = (sectionId, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const handleSave = (sectionId) => {
    saveMutation.mutate({ sectionId, data: settings[sectionId] });
  };

  const maskValue = (val) => {
    if (!val || val.includes('••')) return val;
    return val.length > 8 ? val.slice(0, 4) + '••••' + val.slice(-4) : '••••••••';
  };

  const renderField = (field, sectionId) => {
    if (field.type === 'checkbox') {
      return (
        <label key={field.name} className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            checked={settings[sectionId][field.name]}
            onChange={(e) => updateField(sectionId, field.name, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">{field.label}</span>
        </label>
      );
    }

    if (field.isTextarea) {
      return (
        <TextArea
          key={field.name}
          label={field.label}
          name={field.name}
          value={settings[sectionId][field.name]}
          onChange={(e) => updateField(sectionId, field.name, e.target.value)}
          placeholder={field.placeholder}
        />
      );
    }

    return (
      <Input
        key={field.name}
        label={field.label}
        name={field.name}
        value={sectionId === 'firebase' ? maskValue(settings[sectionId][field.name]) : settings[sectionId][field.name]}
        onChange={(e) => updateField(sectionId, field.name, e.target.value)}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>

        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = expanded === section.id;

            return (
              <Card key={section.id} padding="p-0">
                <button
                  onClick={() => setExpanded(isOpen ? null : section.id)}
                  className="w-full flex items-center gap-3 px-6 py-4 text-left"
                >
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Icon size={18} />
                  </div>
                  <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100">{section.label}</span>
                  {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                        {section.id === 'general' && (
                          <div className="pt-4 space-y-4">
                            {generalFields.map((f) => renderField(f, 'general'))}
                          </div>
                        )}
                        {section.id === 'contact' && (
                          <div className="pt-4 space-y-4">
                            {contactFields.map((f) => renderField(f, 'contact'))}
                          </div>
                        )}
                        {section.id === 'seo' && (
                          <div className="pt-4 space-y-4">
                            {seoFields.map((f) => renderField(f, 'seo'))}
                          </div>
                        )}
                        {section.id === 'notifications' && (
                          <div className="pt-4 space-y-2">
                            {notificationFields.map((f) => renderField(f, 'notifications'))}
                          </div>
                        )}
                        {section.id === 'firebase' && (
                          <div className="pt-4 space-y-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Firebase configuration values are masked for security.</p>
                            {firebaseFields.map((f) => renderField(f, 'firebase'))}
                          </div>
                        )}
                        {section.id === 'password' && (
                          <div className="pt-4 space-y-4">
                            <Input
                              label="Current Password"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                              placeholder="Enter current password"
                            />
                            <Input
                              label="New Password"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                              placeholder="Enter new password (min 6 characters)"
                            />
                            <Input
                              label="Confirm New Password"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                              placeholder="Confirm new password"
                            />
                          </div>
                        )}
                        {section.id !== 'password' && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Button
                              size="sm"
                              icon={FaSave}
                              loading={saveMutation.isPending}
                              onClick={() => handleSave(section.id)}
                            >
                              Save {section.label}
                            </Button>
                          </div>
                        )}
                        {section.id === 'password' && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Button
                              size="sm"
                              icon={FaKey}
                              loading={passwordMutation.isPending}
                              onClick={() => passwordMutation.mutate()}
                            >
                              Change Password
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
