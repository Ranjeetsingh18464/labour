import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import {
  FaUser, FaMapMarkerAlt, FaBriefcase, FaCogs, FaCamera,
  FaInfoCircle, FaPhoneAlt, FaCheckDouble, FaArrowLeft,
  FaArrowRight, FaPlus, FaTrash, FaCheckCircle,
  FaWhatsapp, FaEnvelope, FaVenusMars, FaCalendarAlt,
  FaIdCard, FaMoneyBillWave, FaClock, FaLanguage,
  FaHome, FaRoad, FaCity, FaMapPin, FaGlobe,
  FaStar, FaTruck, FaPaintRoller, FaBolt, FaHammer,
  FaUtensils, FaBroom, FaWrench,
} from 'react-icons/fa';
import { HiPhotograph, HiDocumentText } from 'react-icons/hi';
import {
  Input, Select, TextArea, Button, FileUpload, Card,
} from '../ui';
import { useAuth } from '../../context/AuthContext';
import { createLabour } from '../../services/labourService';
import { uploadImage } from '../../services/uploadService';
import {
  GENDER_OPTIONS, EXPERIENCE_OPTIONS, WORK_TYPES, LANGUAGES,
  SKILLS, INDIAN_STATES, CITY_OPTIONS,
} from '../../utils/constants';

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const AREA_OPTIONS = [
  { value: '', label: 'Select Area' },
  { value: 'sector-14', label: 'Sector 14' },
  { value: 'sector-15', label: 'Sector 15' },
  { value: 'dlf-phase-1', label: 'DLF Phase 1' },
  { value: 'mg-road', label: 'MG Road' },
  { value: 'indiranagar', label: 'Indiranagar' },
  { value: 'koramangala', label: 'Koramangala' },
  { value: 'whitefield', label: 'Whitefield' },
  { value: 'jayanagar', label: 'Jayanagar' },
  { value: 'btm-layout', label: 'BTM Layout' },
  { value: 'hsr-layout', label: 'HSR Layout' },
];

const WORK_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: '24-hours', label: '24 Hours' },
];

const SERVICE_OPTIONS = [
  { value: 'live-in', label: 'Live-in' },
  { value: 'live-out', label: 'Live-out' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'available-today', label: 'Available Today' },
  { value: 'available-tomorrow', label: 'Available Tomorrow' },
  { value: 'immediate-joining', label: 'Immediate Joining' },
];

const HOLIDAY_OPTIONS = [
  { value: '', label: 'Select Holiday' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'none', label: 'No Holiday' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select Category' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mason', label: 'Mason' },
  { value: 'gardener', label: 'Gardener' },
  { value: 'cleaner', label: 'House Cleaner' },
  { value: 'driver', label: 'Driver' },
  { value: 'cook', label: 'Cook' },
  { value: 'security', label: 'Security Guard' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'tutor', label: 'Tutor' },
  { value: 'tailor', label: 'Tailor' },
  { value: 'mechanic', label: 'Mechanic' },
];

const skillIcons = {
  Cooking: FaUtensils, Cleaning: FaBroom, Driving: FaTruck,
  Plumbing: FaWrench, Electrical: FaBolt, Painting: FaPaintRoller,
  Carpentry: FaHammer, Tutoring: FaStar, Tailoring: FaStar,
  Mechanic: FaWrench, Gardening: FaStar,
};

const STEPS = [
  'Personal Details',
  'Address',
  'Work Info',
  'Skills',
  'Photos',
  'About Me',
  'References',
  'Verification',
];

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {STEPS[currentStep - 1]}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
        />
      </div>
      <div className="hidden sm:flex justify-between mt-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-colors duration-200 ${
                i + 1 <= currentStep
                  ? 'bg-blue-600 border-blue-600 dark:bg-blue-400 dark:border-blue-400'
                  : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepWrapper({ children, direction }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={direction}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function PersonalDetails({ register, errors, setValue, watch }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Full Name" name="fullName" placeholder="Enter full name" required
        {...register('fullName', { required: 'Full name is required' })}
        error={errors.fullName?.message} icon={FaUser} />
      <Input label="Father's Name" name="fatherName" placeholder="Enter father's name"
        {...register('fatherName')} icon={FaUser} />
      <Input label="Mobile Number" name="mobile" placeholder="10-digit mobile" required
        {...register('mobile', {
          required: 'Mobile is required',
          pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid mobile number' },
        })}
        error={errors.mobile?.message} icon={FaPhoneAlt} />
      <Input label="WhatsApp Number" name="whatsapp" placeholder="WhatsApp number"
        {...register('whatsapp')} icon={FaWhatsapp} />
      <Input label="Email" name="email" type="email" placeholder="Email address" required
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        })}
        error={errors.email?.message} icon={FaEnvelope} />
      <Select label="Gender" name="gender" options={GENDER_OPTIONS} placeholder="Select Gender" required
        {...register('gender', { required: 'Gender is required' })}
        error={errors.gender?.message} />
      <Input label="Date of Birth" name="dob" type="date" required
        {...register('dob', { required: 'DOB is required' })}
        error={errors.dob?.message} icon={FaCalendarAlt} />
      <Input label="Aadhaar Number" name="aadhaar" placeholder="12-digit Aadhaar" required
        {...register('aadhaar', {
          required: 'Aadhaar is required',
          pattern: { value: /^\d{12}$/, message: 'Aadhaar must be 12 digits' },
        })}
        error={errors.aadhaar?.message} icon={FaIdCard} />
      <Input label="PAN Number (Optional)" name="pan" placeholder="PAN number"
        {...register('pan')} icon={FaIdCard} />
    </div>
  );
}

function AddressStep({ register, errors, setValue, watch }) {
  const [adding, setAdding] = useState(null);

  const handleAdd = async (field, value) => {
    if (!value || !value.trim()) return;
    const col = field === 'city' ? 'cities' : 'areas';
    try {
      await addDoc(collection(db, col), { name: value.trim(), status: 'active' });
      toast.success(`${field === 'city' ? 'City' : 'Area'} added`);
    } catch {
      toast.error(`Failed to add ${field}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="House/Flat No" name="houseNo" placeholder="House/Flat number" required
        {...register('houseNo', { required: 'House/Flat no is required' })}
        error={errors.houseNo?.message} icon={FaHome} />
      <Input label="Street" name="street" placeholder="Street name"
        {...register('street')} icon={FaRoad} />
      <Input label="Landmark" name="landmark" placeholder="Nearby landmark"
        {...register('landmark')} icon={FaMapPin} />
      <div className="relative">
        <Input label="Area" name="area" placeholder="Enter area name" required
          {...register('area', { required: 'Area is required' })}
          error={errors.area?.message} />
        <button
          type="button"
          onClick={() => { handleAdd('area', watch('area')); }}
          className="absolute right-2 top-[38px] p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title="Add area"
        >
          <FaPlus size={14} />
        </button>
      </div>
      <div className="relative">
        <Input label="City" name="city" placeholder="Enter city name" required
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message} />
        <button
          type="button"
          onClick={() => { handleAdd('city', watch('city')); }}
          className="absolute right-2 top-[38px] p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title="Add city"
        >
          <FaPlus size={14} />
        </button>
      </div>
      <Input label="District" name="district" placeholder="District"
        {...register('district')} icon={FaCity} />
      <Select label="State" name="state" options={[{ value: '', label: 'Select State' }, ...INDIAN_STATES.map(s => ({ value: s, label: s }))]} required
        {...register('state', { required: 'State is required' })}
        error={errors.state?.message} />
      <Input label="PIN Code" name="pincode" placeholder="6-digit PIN" required
        {...register('pincode', {
          required: 'PIN code is required',
          pattern: { value: /^\d{6}$/, message: 'Invalid PIN code' },
        })}
        error={errors.pincode?.message} icon={FaGlobe} />
    </div>
  );
}

function WorkInfo({ register, errors, watch, setValue }) {
  const selectedWorkTypes = watch('workTypes') || [];
  const selectedServices = watch('services') || [];
  const availability = watch('availability');

  const toggleWorkType = (val) => {
    const current = watch('workTypes') || [];
    const updated = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
    setValue('workTypes', updated, { shouldValidate: true });
  };

  const toggleService = (val) => {
    const current = watch('services') || [];
    const updated = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
    setValue('services', updated, { shouldValidate: true });
  };

  const toggleLanguage = (lang) => {
    const current = watch('languages') || [];
    const updated = current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang];
    setValue('languages', updated, { shouldValidate: true });
  };

  const selectedLanguages = watch('languages') || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Primary Category" name="primaryCategory" options={CATEGORY_OPTIONS} required
          {...register('primaryCategory', { required: 'Primary category is required' })}
          error={errors.primaryCategory?.message} />
        <Select label="Secondary Category" name="secondaryCategory" options={CATEGORY_OPTIONS}
          {...register('secondaryCategory')} />
        <Select label="Experience" name="experience" options={EXPERIENCE_OPTIONS} placeholder="Select Experience" required
          {...register('experience', { required: 'Experience is required' })}
          error={errors.experience?.message} />
        <Input label="Daily Wage (₹)" name="dailyWage" type="number" placeholder="Daily wage amount"
          {...register('dailyWage')} icon={FaMoneyBillWave} />
        <Input label="Monthly Salary (₹)" name="monthlySalary" type="number" placeholder="Monthly salary amount"
          {...register('monthlySalary')} icon={FaMoneyBillWave} />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Type</p>
        <div className="flex flex-wrap gap-2">
          {WORK_TYPE_OPTIONS.map((wt) => (
            <button
              key={wt.value}
              type="button"
              onClick={() => toggleWorkType(wt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedWorkTypes.includes(wt.value)
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-blue-500'
              }`}
            >
              {wt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Type</p>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((svc) => (
            <button
              key={svc.value}
              type="button"
              onClick={() => toggleService(svc.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedServices.includes(svc.value)
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-blue-500'
              }`}
            >
              {svc.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability</p>
        <div className="flex flex-wrap gap-3">
          {AVAILABILITY_OPTIONS.map((av) => (
            <label key={av.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('availability', { required: 'Availability is required' })}
                value={av.value}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{av.label}</span>
            </label>
          ))}
        </div>
        {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Working Hours" name="workingHours" placeholder="e.g. 9 AM - 6 PM"
          {...register('workingHours')} icon={FaClock} />
        <Select label="Holiday" name="holiday" options={HOLIDAY_OPTIONS}
          {...register('holiday')} />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Languages Known</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedLanguages.includes(lang)
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-blue-500'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsStep({ watch, setValue, errors }) {
  const selectedSkills = watch('skills') || [];

  const toggleSkill = (skill) => {
    const current = watch('skills') || [];
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill];
    setValue('skills', updated, { shouldValidate: true });
  };

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select your skills</p>
      {errors.skills && <p className="text-sm text-red-500 mb-2">{errors.skills.message}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SKILLS.map((skill) => {
          const Icon = skillIcons[skill] || FaCogs;
          const isSelected = selectedSkills.includes(skill);
          return (
            <motion.button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-blue-500'
              }`}
            >
              <Icon className={isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-500'} size={16} />
              {skill}
              {isSelected && <FaCheckCircle className="ml-auto text-white/80" size={14} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function PhotosStep({ files, setFiles, errors }) {
  const handleUpload = (key) => (fileArray) => {
    setFiles(prev => ({ ...prev, [key]: fileArray[0] }));
  };

  const handleMultipleUpload = (fileArray) => {
    setFiles(prev => ({ ...prev, additionalPhotos: [...(prev.additionalPhotos || []), ...fileArray] }));
  };

  const removeAdditional = (index) => {
    setFiles(prev => ({
      ...prev,
      additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FileUpload
            label="Profile Photo"
            accept="image/*"
            onUpload={handleUpload('profilePhoto')}
            currentFiles={files.profilePhoto ? [files.profilePhoto] : []}
          />
          {errors.profilePhoto && <p className="text-sm text-red-500 mt-1">{errors.profilePhoto}</p>}
        </div>
        <div>
          <FileUpload
            label="Aadhaar Front"
            accept="image/*"
            onUpload={handleUpload('aadhaarFront')}
            currentFiles={files.aadhaarFront ? [files.aadhaarFront] : []}
          />
        </div>
        <div>
          <FileUpload
            label="Aadhaar Back"
            accept="image/*"
            onUpload={handleUpload('aadhaarBack')}
            currentFiles={files.aadhaarBack ? [files.aadhaarBack] : []}
          />
        </div>
        <div>
          <FileUpload
            label="Experience Certificate"
            accept="image/*,application/pdf"
            onUpload={handleUpload('experienceCert')}
            currentFiles={files.experienceCert ? [files.experienceCert] : []}
          />
        </div>
      </div>
      <div>
        <FileUpload
          label="Additional Photos"
          accept="image/*"
          multiple
          onUpload={handleMultipleUpload}
          currentFiles={files.additionalPhotos || []}
        />
        {(files.additionalPhotos || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(files.additionalPhotos || []).map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Additional ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeAdditional(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AboutMeStep({ register, errors }) {
  return (
    <div>
      <TextArea
        label="About Me"
        name="aboutMe"
        placeholder="Tell us about yourself, your experience, and your work ethic..."
        rows={8}
        {...register('aboutMe', { required: 'Please tell us about yourself' })}
        error={errors.aboutMe?.message}
      />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Minimum 20 characters. Describe your background, specialties, and what makes you a great choice.
      </p>
    </div>
  );
}

function ReferencesStep({ register, errors, fields, append, remove }) {
  return (
    <div className="space-y-4">
      {(fields || []).map((field, index) => (
        <Card key={field.id} className="relative">
          {index > 0 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FaTrash size={14} />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Previous Employer"
              name={`references.${index}.employer`}
              placeholder="Employer name"
              {...register(`references.${index}.employer`)}
            />
            <Input
              label="Contact Number"
              name={`references.${index}.phone`}
              placeholder="Employer phone"
              {...register(`references.${index}.phone`, {
                pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid number' },
              })}
              error={errors.references?.[index]?.phone?.message}
              icon={FaPhoneAlt}
            />
          </div>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        icon={FaPlus}
        onClick={() => append({ employer: '', phone: '' })}
      >
        Add Reference
      </Button>
    </div>
  );
}

function VerificationStep({ register, errors }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <FaCheckCircle className="text-blue-600 dark:text-blue-400" />
          Before You Submit
        </h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
          <li>Verify all the information you have provided is accurate</li>
          <li>Uploaded documents will be verified by our team</li>
          <li>Your profile will be visible to customers once approved</li>
          <li>You can edit your profile anytime after registration</li>
        </ul>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('termsAccepted', { required: 'You must accept the terms' })}
            className="mt-1 accent-blue-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            I confirm that all the information provided is true and accurate. I agree to the{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">Terms & Conditions</span>
            {' '}and{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">Privacy Policy</span>.
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('dataVerification', { required: 'Consent is required' })}
            className="mt-1 accent-blue-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            I authorize Labour.com to verify my documents and contact me for verification purposes.
          </span>
        </label>
        {errors.dataVerification && (
          <p className="text-sm text-red-500">{errors.dataVerification.message}</p>
        )}
      </div>
    </div>
  );
}

export default function RegistrationWizard() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState({
    profilePhoto: null,
    aadhaarFront: null,
    aadhaarBack: null,
    experienceCert: null,
    additionalPhotos: [],
  });
  const [references, setReferences] = useState([{ employer: '', phone: '' }]);

  const {
    register, handleSubmit, watch, setValue, trigger, formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '', fatherName: '', mobile: '', whatsapp: '', email: '',
      gender: '', dob: '', aadhaar: '', pan: '',
      houseNo: '', street: '', landmark: '', area: '', city: '', district: '',
      state: '', pincode: '',
      primaryCategory: '', secondaryCategory: '', experience: '', dailyWage: '',
      monthlySalary: '', workTypes: [], services: [], availability: '',
      workingHours: '', holiday: '', languages: [], skills: [],
      aboutMe: '', termsAccepted: false, dataVerification: false,
      references: [{ employer: '', phone: '' }],
    },
  });

  const stepValidations = {
    1: async () => {
      const fields = ['fullName', 'mobile', 'email', 'gender', 'dob', 'aadhaar'];
      const result = await trigger(fields);
      return result;
    },
    2: async () => {
      const fields = ['houseNo', 'area', 'city', 'state', 'pincode'];
      const result = await trigger(fields);
      return result;
    },
    3: async () => {
      const fields = ['primaryCategory', 'experience', 'availability'];
      const result = await trigger(fields);
      return result;
    },
    4: async () => {
      const skills = watch('skills') || [];
      if (skills.length === 0) {
        setValue('skills', skills, { shouldValidate: true });
        return false;
      }
      return true;
    },
    5: async () => {
      if (!files.profilePhoto) {
        setFiles(prev => ({ ...prev, _error: 'Profile photo is required' }));
        return false;
      }
      return true;
    },
    6: async () => {
      const result = await trigger('aboutMe');
      return result;
    },
    7: () => true,
    8: async () => {
      const result = await trigger(['termsAccepted', 'dataVerification']);
      return result;
    },
  };

  const nextStep = async () => {
    const isValid = await stepValidations[step]();
    if (isValid) {
      setDirection(1);
      setStep(prev => Math.min(prev + 1, 8));
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;
    const result = await uploadImage(file, path);
    return result.url;
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const filePath = `labours/${user.uid}`;
      const [profilePhoto, aadhaarFront, aadhaarBack, experienceCert] = await Promise.all([
        uploadFile(files.profilePhoto, `${filePath}/profile.jpg`),
        uploadFile(files.aadhaarFront, `${filePath}/aadhaar-front.jpg`),
        uploadFile(files.aadhaarBack, `${filePath}/aadhaar-back.jpg`),
        uploadFile(files.experienceCert, `${filePath}/experience-cert.pdf`),
      ]);

      let additionalPhotoUrls = [];
      if (files.additionalPhotos?.length > 0) {
        const uploads = await Promise.all(
          files.additionalPhotos.map((f, i) => uploadFile(f, `${filePath}/additional-${i}.jpg`))
        );
        additionalPhotoUrls = uploads.filter(Boolean);
      }

      const labourData = {
        userId: user.uid,
        email: data.email,
        name: data.fullName,
        fatherName: data.fatherName,
        mobile: data.mobile,
        whatsapp: data.whatsapp || data.mobile,
        gender: data.gender,
        dob: data.dob,
        aadhaar: data.aadhaar,
        pan: data.pan,
        houseNo: data.houseNo,
        street: data.street,
        landmark: data.landmark,
        area: data.area,
        city: data.city,
        district: data.district,
        state: data.state,
        pincode: data.pincode,
        category: data.primaryCategory,
        subcategory: data.secondaryCategory,
        experience: data.experience,
        dailyCharges: Number(data.dailyWage) || 0,
        monthlyCharges: Number(data.monthlySalary) || 0,
        workTypes: data.workTypes,
        services: data.services,
        availability: data.availability,
        workingHours: data.workingHours,
        holiday: data.holiday,
        languages: data.languages,
        skills: data.skills,
        aboutMe: data.aboutMe,
        references: data.references,
        photo: profilePhoto,
        aadhaarFront: aadhaarFront,
        aadhaarBack: aadhaarBack,
        experienceCert: experienceCert,
        additionalPhotos: additionalPhotoUrls,
        labourId: '',
        verified: false,
        available: true,
        rating: 0,
      };

      const created = await createLabour(labourData);
      const labourId = `LAB-${data.city?.substring(0, 3).toUpperCase() || 'XXX'}-${data.area?.substring(0, 3).toUpperCase() || 'XXX'}-${String(created.id).slice(-4).toUpperCase()}`;

      await import('../../services/labourService').then(({ updateLabour }) =>
        updateLabour(created.id, { labourId })
      );

      toast.success('Registration submitted successfully!');
      navigate('/labour/profile');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const renderStep = () => {
    const props = { register, errors, watch, setValue };
    switch (step) {
      case 1: return <PersonalDetails {...props} />;
      case 2: return <AddressStep {...props} />;
      case 3: return <WorkInfo {...props} />;
      case 4: return <SkillsStep {...props} errors={errors} />;
      case 5: return <PhotosStep files={files} setFiles={setFiles} errors={errors} />;
      case 6: return <AboutMeStep {...props} />;
      case 7: return <ReferencesStep {...props} fields={watch('references')} append={(v) => {
        const current = watch('references') || [];
        setValue('references', [...current, v]);
      }} remove={(i) => {
        const current = watch('references') || [];
        setValue('references', current.filter((_, idx) => idx !== i));
      }} />;
      case 8: return <VerificationStep {...props} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={step} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepWrapper direction={direction}>
          <Card padding="p-6 sm:p-8">
            {renderStep()}
          </Card>
        </StepWrapper>
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button type="button" variant="ghost" icon={FaArrowLeft} onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <div />
          )}
          {step < 8 ? (
            <Button type="button" variant="primary" icon={FaArrowRight} onClick={nextStep} iconPosition="right">
              Next
            </Button>
          ) : (
            <Button type="submit" variant="primary" loading={uploading} icon={FaCheckCircle}>
              Submit Registration
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
