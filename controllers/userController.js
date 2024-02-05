const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

// Create a new user with hashed password and role
exports.createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;
    const user = await User.findById(userId);
    user.role = newRole;
    await user.save();
    res.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user role', error: error.message });
  }
};
