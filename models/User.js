const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true }, // Indexing for performance
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'editor'], default: 'user', index: true }, // Indexing for quick role queries
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Custom method for password verification
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
