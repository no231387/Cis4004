const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => process.env.JWT_SECRET || 'development_jwt_secret_change_me';

const extractToken = (headerValue = '') => {
  if (!headerValue.startsWith('Bearer ')) {
    return null;
  }

  return headerValue.slice(7).trim();
};

exports.protect = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'User account was not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  next();
};
