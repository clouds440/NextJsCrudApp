const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before save
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Compare password helper
adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
