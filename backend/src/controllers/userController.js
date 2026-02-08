const User = require('../models/User');
const { sendError, sendSuccess, HTTP_STATUS } = require('../utils/responseHandler');

// Get all users with pagination
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find({ isActive: true })
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({ isActive: true });
    const totalPages = Math.ceil(total / parseInt(limit));

    return sendSuccess(res, HTTP_STATUS.OK, 'Users retrieved successfully', {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
        usersPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    if (!user.isActive) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return sendSuccess(res, HTTP_STATUS.OK, 'User retrieved successfully', user);
  } catch (err) {
    next(err);
  }
};

// Create user
exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, zipCode, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, HTTP_STATUS.CONFLICT, 'Email already exists');
    }

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      dateOfBirth
    });

    await user.save();

    return sendSuccess(res, HTTP_STATUS.CREATED, 'User created successfully', user);
  } catch (err) {
    next(err);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, city, state, zipCode, dateOfBirth, isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendError(res, HTTP_STATUS.CONFLICT, 'Email already exists');
      }
      user.email = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (zipCode) user.zipCode = zipCode;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    return sendSuccess(res, HTTP_STATUS.OK, 'User updated successfully', user);
  } catch (err) {
    next(err);
  }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    user.isActive = false;
    await user.save();

    return sendSuccess(res, HTTP_STATUS.OK, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Permanent delete user
exports.permanentDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return sendSuccess(res, HTTP_STATUS.OK, 'User permanently deleted');
  } catch (err) {
    next(err);
  }
};

// Search users
exports.searchUsers = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Search query is required');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchRegex = new RegExp(query, 'i');

    const users = await User.find({
      isActive: true,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { city: searchRegex }
      ]
    })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      isActive: true,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { city: searchRegex }
      ]
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    return sendSuccess(res, HTTP_STATUS.OK, 'Users search completed', {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: total,
        usersPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get users by city
exports.getUsersByCity = async (req, res, next) => {
  try {
    const { city, page = 1, limit = 10 } = req.query;

    if (!city || city.trim().length === 0) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'City is required');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const cityRegex = new RegExp(city, 'i');

    const users = await User.find({
      isActive: true,
      city: cityRegex
    })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      isActive: true,
      city: cityRegex
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    return sendSuccess(res, HTTP_STATUS.OK, 'Users retrieved by city', {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: total,
        usersPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get statistics
exports.getStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalInactiveUsers = await User.countDocuments({ isActive: false });

    const usersByCity = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5);

    return sendSuccess(res, HTTP_STATUS.OK, 'Statistics retrieved successfully', {
      totalUsers,
      totalInactiveUsers,
      usersByCity,
      recentUsers
    });
  } catch (err) {
    next(err);
  }
};
