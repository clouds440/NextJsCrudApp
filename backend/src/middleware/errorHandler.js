const { validationResult } = require('express-validator');
const { sendError, HTTP_STATUS } = require('../utils/responseHandler');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      formattedErrors
    );
  }
  
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});

    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(
      res,
      HTTP_STATUS.CONFLICT,
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    );
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Invalid ID format'
    );
  }

  // Default Error
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'Internal server error. Please try again later.'
  );
};

module.exports = {
  validationMiddleware,
  errorHandler
};
