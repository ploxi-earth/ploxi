const jwt = require('jsonwebtoken');

/**
 * Sign a JWT access token (uses UUID-based user IDs from Supabase)
 */
const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

/**
 * Sign a JWT refresh token
 */
const signRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Send token response with standard shape
 * Works with plain Supabase row objects (no Mongoose document methods)
 */
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { signAccessToken, signRefreshToken, sendTokenResponse };
