// Error Response Utility
const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Success Response Utility
const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    statusCode,
    message,
    timestamp: new Date().toISOString()
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  sendError,
  sendSuccess,
  HTTP_STATUS
};
