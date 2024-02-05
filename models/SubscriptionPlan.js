// Filename: /models/SubscriptionPlan.js
const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    features: [String],
    createdAt: { type: Date, default: Date.now },
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

subscriptionPlanSchema.statics.createSubscriptionPlan = async function (subscriptionPlanData) {
    try {
        const plan = new this(subscriptionPlanData);
        await plan.validate();
        await plan.save();
        return plan;
    } catch (error) {
        throw error;
    }
};

subscriptionPlanSchema.statics.getAllSubscriptionPlans = async function () {
    try {
        const plans = await this.find();
        return plans;
    } catch (error) {
        throw error;
    }
};

subscriptionPlanSchema.statics.getSubscriptionPlanById = async function (planId) {
    try {
        const plan = await this.findById(planId);
        if (!plan) throw new Error('Subscription plan not found');
        return plan;
    } catch (error) {
        throw error;
    }
};

subscriptionPlanSchema.statics.updateSubscriptionPlanById = async function (planId, updateData) {
    try {
        const plan = await this.findByIdAndUpdate(planId, updateData, { new: true, runValidators: true });
        if (!plan) throw new Error('Subscription plan not found');
        return plan;
    } catch (error) {
        throw error;
    }
};

subscriptionPlanSchema.statics.deleteSubscriptionPlanById = async function (planId) {
    try {
        const plan = await this.findByIdAndDelete(planId);
        if (!plan) throw new Error('Subscription plan not found');
        return { message: 'Subscription plan successfully deleted' };
    } catch (error) {
        throw error;
    }
};

module.exports = SubscriptionPlan;

// Filename: /app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');
const SubscriptionPlan = require('./models/SubscriptionPlan');
require('dotenv').config(); // Load environment variables from .env file

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());

// User routes
app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.updateOne({ _id: req.params.id }, req.body);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

// Subscription Plan routes
app.post('/subscription-plans', async (req, res) => {
    try {
        const plan = await SubscriptionPlan.createSubscriptionPlan(req.body);
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/subscription-plans', async (req, res) => {
    try {
        const plans = await SubscriptionPlan.getAllSubscriptionPlans();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/subscription-plans/:id', async (req, res) => {
    try {
        const plan = await SubscriptionPlan.getSubscriptionPlanById(req.params.id);
        res.status(200).json(plan);
    } catch (error) {
        res.status(404).json({ error: 'Subscription plan not found' });
    }
});

app.put('/subscription-plans/:id', async (req, res) => {
    try {
        const plan = await SubscriptionPlan.updateSubscriptionPlanById(req.params.id, req.body);
        res.status(200).json({ message: 'Subscription plan updated successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Subscription plan not found' });
    }
});

app.delete('/subscription-plans/:id', async (req, res) => {
    try {
        await SubscriptionPlan.deleteSubscriptionPlanById(req.params.id);
        res.status(200).json({ message: 'Subscription plan deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Subscription plan not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
