export const ROLES = {
  ADMIN: 'admin',
  LABOUR: 'labour',
  CUSTOMER: 'customer',
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const EXPERIENCE_OPTIONS = [
  { value: 'fresher', label: 'Fresher (Less than 1 year)' },
  { value: '1-2', label: '1-2 Years' },
  { value: '3-5', label: '3-5 Years' },
  { value: '6-10', label: '6-10 Years' },
  { value: '10+', label: '10+ Years' },
];

export const WORK_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'temporary', label: 'Temporary' },
];

export const AVAILABILITY_OPTIONS = [
  { value: 'immediate', label: 'Immediate' },
  { value: '1-week', label: 'Within 1 Week' },
  { value: '2-weeks', label: 'Within 2 Weeks' },
  { value: '1-month', label: 'Within 1 Month' },
  { value: 'negotiable', label: 'Negotiable' },
];

export const LANGUAGES = [
  'Hindi',
  'English',
  'Punjabi',
  'Haryanvi',
  'Rajasthani',
  'Bhojpuri',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Odia',
  'Urdu',
  'Nepali',
];

export const SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Welding',
  'Masonry',
  'Gardening',
  'Cleaning',
  'Driving',
  'Cooking',
  'Tutoring',
  'Tailoring',
  'Mechanic',
  'AC Repair',
  'Home Renovation',
  'Furniture Assembly',
  'Pest Control',
  'Packers & Movers',
  'Security Guard',
  'Housekeeping',
];

export const LABOUR_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
  SUSPENDED: 'suspended',
  VERIFIED: 'verified',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const WAGE_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'fixed', label: 'Fixed (One Time)' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const CITY_OPTIONS = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Chandigarh', 'Bhopal',
  'Indore', 'Surat', 'Visakhapatnam', 'Nagpur', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Mysore', 'Bareilly',
  'Aligarh', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal',
  'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Guntur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur',
  'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar',
  'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur',
  'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
  'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore', 'Erode',
  'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon',
  'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool',
  'Rajahmundry', 'Bokaro', 'South Dumdum', 'Bellary', 'Patiala',
  'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara',
  'Panihati', 'Latur', 'Dhule', 'Rohtak', 'Korba', 'Bhilwara',
  'Brahmapur', 'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam',
  'Avadi', 'Kadapa', 'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur',
  'Satara', 'Kakinada', 'Rampur', 'Nizamabad', 'Bihar Sharif', 'Panipat',
  'Sonipat', 'Tenali', 'Tirupati', 'Hospet', 'Yamunanagar', 'Pali',
  'Parbhani', 'Ichalkaranji', 'Etawah', 'Katni', 'Alwar', 'Bathinda',
  'Hapur', 'Karnal', 'Moga', 'Rewa', 'Sagar', 'Mandi', 'Hisar', 'Sirsa',
  'Fatehabad', 'Kaithal', 'Jind', 'Ambala', 'Shimla', 'Haridwar',
  'Rishikesh', 'Roorkee', 'Haldwani', 'Nainital', 'Mussoorie',
  'Almora', 'Pithoragarh', 'Rudrapur', 'Kashipur', 'Bageshwar',
  'Champawat', 'Kotdwar', 'Pauri', 'Srinagar Garhwal', 'Tehri',
  'Lansdowne', 'Gairsain', 'Joshimath', 'Badrinath', 'Kedarnath',
  'Gangotri', 'Yamunotri', 'Auli', 'Munsiyari', 'Mukteshwar',
  'Bhimtal', 'Sattal', 'Naukuchiatal', 'Kausani', 'Chaukori',
  'Berinag', 'Didihat', 'Dharchula', 'Munsyari', 'Thal',
];
