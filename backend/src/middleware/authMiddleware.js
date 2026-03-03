const jwt = require('jsonwebtoken');
const { sendError, HTTP_STATUS } = require('../utils/responseHandler');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return sendError(res, HTTP_STATUS.FORBIDDEN, 'Admin privileges required');
  }
  next();
};
