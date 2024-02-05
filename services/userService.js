// Assuming the existence of a User model and RefreshToken model
exports.register = async (email, password, role = 'user') => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  // Create a refresh token for the new user
  const refreshToken = jwt.sign({ userId: newUser._id }, REFRESH_SECRET, { expiresIn: '7d' });
  const newRefreshToken = new RefreshToken({
    userId: newUser._id,
    token: refreshToken,
  });
  
  await newRefreshToken.save();

  const token = jwt.sign({ userId: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
  
  return {
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    },
    token,
    refreshToken,
  };
};
