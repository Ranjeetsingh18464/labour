export const labourRegistration = {
  step1: (data) => {
    const errors = {};
    if (!data.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!data.mobile?.trim()) errors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(data.mobile.replace(/\D/g, '')))
      errors.mobile = 'Enter a valid 10-digit mobile number';
    if (!data.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = 'Enter a valid email address';
    if (!data.password || data.password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    return errors;
  },
  step2: (data) => {
    const errors = {};
    if (!data.gender) errors.gender = 'Please select your gender';
    if (!data.dob) errors.dob = 'Date of birth is required';
    if (!data.age || data.age < 18) errors.age = 'You must be at least 18 years old';
    return errors;
  },
  step3: (data) => {
    const errors = {};
    if (!data.state?.trim()) errors.state = 'State is required';
    if (!data.city?.trim()) errors.city = 'City is required';
    if (!data.area?.trim()) errors.area = 'Area/Locality is required';
    if (!data.pincode?.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(data.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
    if (!data.fullAddress?.trim()) errors.fullAddress = 'Full address is required';
    return errors;
  },
  step4: (data) => {
    const errors = {};
    if (!data.category) errors.category = 'Please select a category';
    if (data.skills?.length < 1) errors.skills = 'Select at least one skill';
    if (!data.experienceLevel) errors.experienceLevel = 'Experience level is required';
    if (data.previousWork?.length > 0) {
      data.previousWork.forEach((work, i) => {
        if (work?.company && !work?.duration) {
          errors[`previousWork.${i}.duration`] = 'Duration is required for each company';
        }
      });
    }
    return errors;
  },
  step5: (data) => {
    const errors = {};
    if (!data.preferredWorkType) errors.preferredWorkType = 'Work type is required';
    if (!data.expectedWage || data.expectedWage < 1)
      errors.expectedWage = 'Enter a valid expected wage';
    if (!data.wageType) errors.wageType = 'Wage type is required';
    if (!data.availability) errors.availability = 'Availability is required';
    return errors;
  },
  step6: (data) => {
    const errors = {};
    if (data.languages?.length < 1) errors.languages = 'Select at least one language';
    if (data.education?.length > 0) {
      data.education.forEach((edu, i) => {
        if (edu?.degree && !edu?.institution) {
          errors[`education.${i}.institution`] = 'Institution is required';
        }
        if (edu?.institution && !edu?.year) {
          errors[`education.${i}.year`] = 'Year is required';
        }
      });
    }
    if (data.certifications?.length > 0) {
      data.certifications.forEach((cert, i) => {
        if (cert?.name && !cert?.issuedBy) {
          errors[`certifications.${i}.issuedBy`] = 'Issued by is required';
        }
      });
    }
    return errors;
  },
  step7: (data) => {
    const errors = {};
    if (!data.idProof?.file) errors.idProof = 'ID proof document is required';
    if (!data.addressProof?.file) errors.addressProof = 'Address proof document is required';
    if (!data.photo?.file) errors.photo = 'Photo is required';
    return errors;
  },
  step8: (data) => {
    const errors = {};
    if (!data.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms';
    if (!data.agreeToVerify) errors.agreeToVerify = 'You must agree to verification';
    return errors;
  },
};

export const loginForm = (data) => {
  const errors = {};
  if (!data.email?.trim()) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';
  return errors;
};

export const bookingForm = (data) => {
  const errors = {};
  if (!data.labourId) errors.labourId = 'Labour is required';
  if (!data.serviceDate) errors.serviceDate = 'Service date is required';
  else if (new Date(data.serviceDate) < new Date(new Date().toDateString()))
    errors.serviceDate = 'Service date cannot be in the past';
  if (!data.serviceAddress?.trim()) errors.serviceAddress = 'Service address is required';
  if (!data.city?.trim()) errors.city = 'City is required';
  if (!data.description?.trim()) errors.description = 'Job description is required';
  else if (data.description.trim().length < 20)
    errors.description = 'Description must be at least 20 characters';
  if (!data.duration || data.duration < 1) errors.duration = 'Duration is required';
  if (!data.durationType) errors.durationType = 'Duration type is required';
  if (data.phone && !/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, '')))
    errors.phone = 'Enter a valid phone number';
  return errors;
};

export const reviewForm = (data) => {
  const errors = {};
  if (!data.rating || data.rating < 1 || data.rating > 5)
    errors.rating = 'Rating must be between 1 and 5';
  if (!data.comment?.trim()) errors.comment = 'Review comment is required';
  else if (data.comment.trim().length < 10)
    errors.comment = 'Comment must be at least 10 characters';
  return errors;
};

export const categoryForm = (data) => {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Category name is required';
  if (!data.description?.trim()) errors.description = 'Description is required';
  if (!data.icon) errors.icon = 'Icon is required';
  return errors;
};

export function validateField(rules, data) {
  if (typeof rules === 'function') return rules(data);
  const errors = {};
  for (const [key, validator] of Object.entries(rules)) {
    if (typeof validator === 'function') {
      const error = validator(data[key]);
      if (error) errors[key] = error;
    }
  }
  return errors;
}
