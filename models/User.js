const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NotificationSettingsSchema = new mongoose.Schema({
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
}, { _id: false });

const PreferencesSchema = new mongoose.Schema({
    notifications: NotificationSettingsSchema,
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    accessibility: {
        highContrast: { type: Boolean, default: false },
        textToSpeech: { type: Boolean, default: false },
    },
    contentPreferences: {
        categories: [{ type: String }],
        tags: [{ type: String }],
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

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
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
    verified: {
        type: Boolean,
        default: false,
    },
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.findByEmailAndActive = async function (email) {
    return this.findOne({ email, accountStatus: 'active' });
};

// Create a new user
userSchema.statics.createUser = async function (userData) {
    try {
        const user = new this(userData);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// Get user by ID
userSchema.statics.getUserById = async function (userId) {
    try {
        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw error;
    }
};

// Update user by ID
userSchema.statics.updateUserById = async function (userId, updateData) {
    try {
        const user = await this.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw error;
    }
};

// Delete user by ID
userSchema.statics.deleteUserById = async function (userId) {
    try {
        const user = await this.findByIdAndDelete(userId);
        if (!user) throw new Error('User not found');
        return { message: 'User successfully deleted' };
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
