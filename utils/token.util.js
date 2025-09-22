const jwt = require("jsonwebtoken");

const signAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });
};

const signRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
};

const signPendingVerificationToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      pendingVerification: true,
    },
    process.env.JWT_PENDING_VERIFY_SECRET,
    { expiresIn: process.env.JWT_PENDING_VERIFY_EXPIRES }
  );
};

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const verifyPendingVerificationToken = (token) =>
  jwt.verify(token, process.env.JWT_PENDING_VERIFY_SECRET);

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
