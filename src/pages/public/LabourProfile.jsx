import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  FaStar, FaCheckCircle, FaPhoneAlt, FaWhatsapp, FaSms,
  FaMapMarkerAlt, FaBriefcase, FaLanguage, FaClock,
  FaMoneyBillWave, FaCalendarCheck, FaShareAlt, FaPrint,
  FaArrowLeft, FaStarHalfAlt, FaRegStar, FaUserCircle,
} from 'react-icons/fa';
import { HiPhotograph } from 'react-icons/hi';
import { BsQrCode } from 'react-icons/bs';
import { QRCodeCanvas } from 'qrcode.react';
import { getLabour } from '../../services/labourService';
import { getLabourReviews, getAverageRating } from '../../services/reviewService';
import {
  Button, Card, Badge, Skeleton, StarRating, Spinner,
} from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';

function SectionHeading({ title, icon: Icon }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {Icon && <Icon className="text-blue-600 dark:text-blue-400" size={20} />}
      {title}
    </h2>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{value || 'N/A'}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <Card padding="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
          {review.userName?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {review.userName || 'Anonymous'}
            </p>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{review.comment}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {review.createdAt ? formatDate(review.createdAt) : ''}
          </p>
        </div>
      </div>
    </Card>
  );
}

function SkeletonProfile() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton type="card" className="h-64" />
          <Skeleton type="card" className="h-48" />
          <Skeleton type="card" className="h-32" />
        </div>
        <div className="space-y-6">
          <Skeleton type="card" className="h-48" />
          <Skeleton type="card" className="h-32" />
        </div>
      </div>
    </div>
  );
}

export default function LabourProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const { data: labour, isLoading, error } = useQuery({
    queryKey: ['labour', id],
    queryFn: () => getLabour(id),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getLabourReviews(id),
    enabled: !!id,
  });

  const { data: ratingData } = useQuery({
    queryKey: ['rating', id],
    queryFn: () => getAverageRating(id),
    enabled: !!id,
  });

  if (isLoading) return <SkeletonProfile />;

  if (error || !labour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaUserCircle className="text-gray-300 dark:text-gray-600 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Labour Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The profile you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)} icon={FaArrowLeft}>Go Back</Button>
      </div>
    );
  }

  const photos = [
    labour.photo,
    ...(labour.additionalPhotos || []),
  ].filter(Boolean);

  const displayPhotos = showAllPhotos ? photos : photos.slice(0, 4);

  const profileUrl = `${window.location.origin}/labour/${id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: labour.name, url: profileUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied!');
    }
  };

  const handlePrint = () => window.print();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {labour.photo ? (
                  <img
                    src={labour.photo}
                    alt={labour.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-4xl">
                    {labour.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {labour.name}
                    </h1>
                    {labour.verified && (
                      <Badge variant="success" size="md">
                        <FaCheckCircle className="mr-1" size={12} />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    ID: {labour.labourId || id}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={ratingData?.averageRating || labour.rating || 0} size="md" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({(ratingData?.averageRating || labour.rating || 0).toFixed(1)})
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      &middot; {ratingData?.totalReviews || 0} reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                    <span>
                      {[labour.area, labour.city, labour.state].filter(Boolean).join(', ')}
                    </span>
                    {labour.available && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="p-6 sm:p-8">
              <SectionHeading title="Quick Info" icon={FaBriefcase} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoRow label="Experience" value={labour.experience} />
                <InfoRow label="Category" value={labour.category} />
                <InfoRow label="Subcategory" value={labour.subcategory} />
                <InfoRow label="Languages" value={labour.languages?.join(', ')} />
                <InfoRow label="Working Hours" value={labour.workingHours} />
                <InfoRow label="Holiday" value={labour.holiday} />
              </div>
            </Card>

            <Card padding="p-6 sm:p-8">
              <SectionHeading title="Availability & Charges" icon={FaMoneyBillWave} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoRow label="Daily Charge" value={labour.dailyCharges ? formatCurrency(labour.dailyCharges) : 'N/A'} />
                <InfoRow label="Monthly Salary" value={labour.monthlyCharges ? formatCurrency(labour.monthlyCharges) : 'N/A'} />
                <InfoRow label="Availability" value={labour.availability} />
                <InfoRow label="Work Type" value={labour.workTypes?.join(', ')} />
                <InfoRow label="Service Type" value={labour.services?.join(', ')} />
              </div>
            </Card>

            {labour.aboutMe && (
              <Card padding="p-6 sm:p-8">
                <SectionHeading title="About Me" icon={FaUserCircle} />
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {labour.aboutMe}
                </p>
              </Card>
            )}

            {labour.skills?.length > 0 && (
              <Card padding="p-6 sm:p-8">
                <SectionHeading title="Skills" icon={FaStar} />
                <div className="flex flex-wrap gap-2">
                  {labour.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {photos.length > 0 && (
              <Card padding="p-6 sm:p-8">
                <SectionHeading title="Photo Gallery" icon={HiPhotograph} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {displayPhotos.map((photo, i) => (
                    <a key={i} href={photo} target="_blank" rel="noopener noreferrer">
                      <img
                        src={photo}
                        alt={`${labour.name} photo ${i + 1}`}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
                {photos.length > 4 && (
                  <button
                    onClick={() => setShowAllPhotos(!showAllPhotos)}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showAllPhotos ? 'Show less' : `View all ${photos.length} photos`}
                  </button>
                )}
              </Card>
            )}

            <Card padding="p-6 sm:p-8">
              <SectionHeading title="Reviews" icon={FaStar} />
              {!reviewsData || reviewsData.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviewsData.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="p-6">
              <div className="space-y-3">
                <a
                  href={`tel:${labour.mobile}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <FaPhoneAlt size={14} />
                  Call {labour.mobile}
                </a>
                <a
                  href={`https://wa.me/${labour.whatsapp || labour.mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp
                </a>
                <a
                  href={`sms:${labour.mobile}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  <FaSms size={14} />
                  SMS
                </a>
                <Button
                  fullWidth
                  variant="primary"
                  icon={FaCalendarCheck}
                  onClick={() => navigate(`/booking/${id}`)}
                >
                  Book Now
                </Button>
              </div>
            </Card>

            <Card padding="p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BsQrCode className="text-blue-600 dark:text-blue-400" size={18} />
                QR Code
              </h3>
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeCanvas value={profileUrl} size={160} />
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                Scan to view profile
              </p>
            </Card>

            <Card padding="p-6">
              <div className="space-y-3">
                <Button fullWidth variant="outline" icon={FaShareAlt} onClick={handleShare}>
                  Share Profile
                </Button>
                <Button fullWidth variant="ghost" icon={FaPrint} onClick={handlePrint}>
                  Print Profile
                </Button>
              </div>
            </Card>

            {labour.city && (
              <Card padding="p-6">
                <SectionHeading title="Location" icon={FaMapMarkerAlt} />
                <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <iframe
                    title="Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent([labour.area, labour.city, labour.state].filter(Boolean).join(','))}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
