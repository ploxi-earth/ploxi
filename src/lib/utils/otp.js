// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP expires in 10 minutes
export function getOTPExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000).toISOString();
}

// Verify OTP is not expired
export function isOTPExpired(expiryTime) {
  return new Date() > new Date(expiryTime);
}
