const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Notification settings sub-schema
const NotificationSettingsSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  push: { type: Boolean, default: false },
}, { _id: false });

// User preferences sub-schema
const PreferencesSchema = new mongoose.Schema({
  notifications: NotificationSettingsSchema,
  theme: { type: String, default: 'light' },
  language: { type: String, default: 'en' },
  accessibility: {
    highContrast: { type: Boolean, default: false },
    textToSpeech: { type: Boolean, default: false },
  },
  contentPreferences: {
    categories: [String],
    tags: [String],
  },
  privacy: {
    profileVisibility: { type: String, default: 'public', enum: ['public', 'private', 'friends'] },
    dataCollectionConsent: { type: Boolean, default: true },
  },
  dashboardLayout: {
    layoutType: { type: String, default: 'standard', enum: ['standard', 'compact', 'detailed'] },
    widgets: [{ widgetName: String, enabled: Boolean }],
  },
}, { _id: false });

// Main user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email is invalid'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user', 'editor'],
  },
  verified: { type: Boolean, default: false },
  refreshToken: String,
  preferences: PreferencesSchema,
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  },
  lastLogin: Date,
}, {
  timestamps: true,
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Pre-update middleware for password hashing
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 8);
  }
  next();
});

// Method to compare candidate password with user's hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find active user by email
userSchema.statics.findByEmailAndActive = async function (email) {
  return this.findOne({ email, accountStatus: 'active' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;