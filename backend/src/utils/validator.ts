export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateBookingData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.experienceId || typeof data.experienceId !== 'number') {
    errors.push('Valid experience ID is required');
  }

  if (!data.slotId || typeof data.slotId !== 'number') {
    errors.push('Valid slot ID is required');
  }

  if (!data.guests || data.guests < 1) {
    errors.push('At least 1 guest is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};