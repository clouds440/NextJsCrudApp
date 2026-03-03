const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validationMiddleware } = require('../middleware/errorHandler');

const router = express.Router();

// validation rules
const validateRegister = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('secret').notEmpty().withMessage('Registration secret is required')
];

const validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', validateRegister, validationMiddleware, authController.register);
router.post('/login', validateLogin, validationMiddleware, authController.login);

module.exports = router;
