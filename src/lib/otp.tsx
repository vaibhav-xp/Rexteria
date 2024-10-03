/**
 * @returns {number} - Return 6 digits OTP.
 */
export const generateOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * @returns {Date} - Return 15 min time to verify OTP.
 */
export const expiresOTP = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};
