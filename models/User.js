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
    const PreferencesSchema = new mongoose.Schema({
    notifications: NotificationSettingsSchema,
    theme: { type: String, default: 'light' }, // Default theme
    language: { type: String, default: 'en' }, // Language preference
    accessibility: { // Accessibility preferences
        highContrast: { type: Boolean, default: false },
        textToSpeech: { type: Boolean, default: false },
    },
    contentPreferences: { // Personalized content settings
        categories: [{ type: String }], // Preferred categories
        tags: [{ type: String }], // Favorite tags for filtering content
    },
    privacy: { // Privacy settings
        profileVisibility: { type: String, default: 'public', enum: ['public', 'private', 'friends'] },
        dataCollectionConsent: { type: Boolean, default: true },
    },
    dashboardLayout: { // Layout customization for user dashboard
        layoutType: { type: String, default: 'standard', enum: ['standard', 'compact', 'detailed'] },
        widgets: [{ widgetName: String, enabled: Boolean }], // Enable/disable dashboard widgets
    },
    // Extend with additional preferences as needed
}, { _id: false });

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

const User = mongoose.model('User', userSchema);

module.exports = User;
