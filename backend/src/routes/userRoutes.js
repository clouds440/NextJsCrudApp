const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { validationMiddleware } = require('../middleware/errorHandler');

const router = express.Router();

// Validation middleware
const validateUser = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^\d{10,15}$/).withMessage('Phone must be 10-15 digits'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('zipCode')
    .trim()
    .notEmpty().withMessage('Zip code is required')
    .matches(/^\d{5,10}$/).withMessage('Zip code must be 5-10 digits'),
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format')
];

const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\d{10,15}$/).withMessage('Phone must be 10-15 digits'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('state')
    .optional()
    .trim(),
  body('zipCode')
    .optional()
    .trim()
    .matches(/^\d{5,10}$/).withMessage('Zip code must be 5-10 digits'),
  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];

// Routes - Order matters! Specific routes before dynamic routes
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/by-city', userController.getUsersByCity);
router.get('/statistics/dashboard', userController.getStatistics);
router.get('/:id', userController.getUserById);

router.post('/', validateUser, validationMiddleware, userController.createUser);
router.put('/:id', validateUserUpdate, validationMiddleware, userController.updateUser);
router.delete('/permanent/:id', userController.permanentDeleteUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
