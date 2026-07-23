import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaMoneyBillWave,
  FaUserCircle, FaArrowLeft, FaCheckCircle, FaPhoneAlt,
  FaWhatsapp, FaStar,
} from 'react-icons/fa';
import { getLabour } from '../../services/labourService';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import {
  Button, Card, Input, Select, TextArea, Badge, Skeleton,
} from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';

const DURATION_OPTIONS = [
  { value: '2', label: '2 Hours' },
  { value: '4', label: '4 Hours' },
  { value: '8', label: '8 Hours' },
  { value: 'full-day', label: 'Full Day' },
];

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'online', label: 'Online Transfer' },
];

function PriceBreakdown({ labour, duration }) {
  const price = useMemo(() => {
    if (!labour) return 0;
    const daily = labour.dailyCharges || 0;
    const monthly = labour.monthlyCharges || 0;

    if (duration === 'full-day') return daily;
    if (monthly > 0 && daily === 0) return monthly / 30;

    const hours = parseInt(duration) || 2;
    const hourlyRate = (daily > 0 ? daily : 1000) / 8;
    return Math.round(hourlyRate * hours);
  }, [labour, duration]);

  const serviceFee = Math.round(price * 0.05);
  const total = price + serviceFee;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Service Charge</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(price)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Service Fee (5%)</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(serviceFee)}</span>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
        <span className="font-semibold text-gray-900 dark:text-white">Total</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { data: labour, isLoading } = useQuery({
    queryKey: ['labour', id],
    queryFn: () => getLabour(id),
    enabled: !!id,
  });

  const {
    register, handleSubmit, watch, formState: { errors },
  } = useForm({
    defaultValues: {
      serviceDate: '',
      serviceTime: '',
      duration: '4',
      address: '',
      instructions: '',
      paymentMode: 'cash',
    },
  });

  const selectedDuration = watch('duration');

  const minDate = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        labourId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        labourName: labour.name,
        labourPhone: labour.mobile,
        serviceDate: data.serviceDate,
        serviceTime: data.serviceTime,
        duration: data.duration,
        address: data.address,
        instructions: data.instructions,
        paymentMode: data.paymentMode,
        dailyCharges: labour.dailyCharges || 0,
        monthlyCharges: labour.monthlyCharges || 0,
        status: 'pending',
      });

      toast.success('Booking request sent successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Skeleton type="card" className="h-32 mb-6" />
          <Skeleton type="card" className="h-96" />
        </div>
      </div>
    );
  }

  if (!labour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaUserCircle className="text-gray-300 dark:text-gray-600 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Labour Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This labour profile doesn't exist.</p>
        <Button onClick={() => navigate(-1)} icon={FaArrowLeft}>Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Book a Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Fill in the details to book this professional
          </p>
        </div>

        <Card padding="p-5 sm:p-6" className="mb-6">
          <div className="flex items-center gap-4">
            {labour.photo ? (
              <img
                src={labour.photo}
                alt={labour.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                {labour.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-gray-900 dark:text-white">{labour.name}</h2>
                {labour.verified && <FaCheckCircle className="text-green-500 text-sm" />}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {labour.category}{labour.subcategory ? ` › ${labour.subcategory}` : ''}
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-xs" />
                  {(labour.rating || 0).toFixed(1)}
                </span>
                <span>{labour.experience} exp.</span>
                {labour.dailyCharges > 0 && (
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(labour.dailyCharges)}/day
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <a
                href={`tel:${labour.mobile}`}
                className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <FaPhoneAlt size={16} />
              </a>
              <a
                href={`https://wa.me/${labour.whatsapp || labour.mobile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card padding="p-5 sm:p-6" className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Service Date"
                name="serviceDate"
                type="date"
                min={minDate}
                required
                icon={FaCalendarAlt}
                {...register('serviceDate', { required: 'Service date is required' })}
                error={errors.serviceDate?.message}
              />
              <Input
                label="Service Time"
                name="serviceTime"
                type="time"
                required
                icon={FaClock}
                {...register('serviceTime', { required: 'Service time is required' })}
                error={errors.serviceTime?.message}
              />
            </div>

            <div className="mt-4">
              <Select
                label="Duration"
                name="duration"
                options={DURATION_OPTIONS}
                {...register('duration', { required: 'Duration is required' })}
                error={errors.duration?.message}
              />
            </div>

            <div className="mt-4">
              <Input
                label="Service Address"
                name="address"
                placeholder="Enter full address"
                required
                icon={FaMapMarkerAlt}
                {...register('address', { required: 'Address is required' })}
                error={errors.address?.message}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="Special Instructions"
                name="instructions"
                placeholder="Any special instructions or requirements..."
                rows={3}
                {...register('instructions')}
              />
            </div>
          </Card>

          <Card padding="p-5 sm:p-6" className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-blue-600 dark:text-blue-400" size={18} />
              Price Breakdown
            </h3>
            <PriceBreakdown labour={labour} duration={selectedDuration} />

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Mode</p>
              <div className="flex flex-wrap gap-3">
                {PAYMENT_OPTIONS.map((po) => (
                  <label key={po.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register('paymentMode')}
                      value={po.value}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{po.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" icon={FaArrowLeft} onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting} icon={FaCheckCircle}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
