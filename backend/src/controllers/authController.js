const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { sendError, sendSuccess, HTTP_STATUS } = require('../utils/responseHandler');

// Register new admin (requires secret from env)
exports.register = async (req, res, next) => {
  try {
    const { email, password, secret } = req.body;

    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid registration secret');
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return sendError(res, HTTP_STATUS.CONFLICT, 'Admin already exists');
    }

    const admin = new Admin({ email, password });
    await admin.save();

    return sendSuccess(res, HTTP_STATUS.CREATED, 'Admin registered successfully', { email: admin.email });
  } catch (err) {
    next(err);
  }
};

// Login admin and return JWT
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    const payload = { id: admin._id, email: admin.email, role: admin.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return sendSuccess(res, HTTP_STATUS.OK, 'Login successful', { token });
  } catch (err) {
    next(err);
  }
};
