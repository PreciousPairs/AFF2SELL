// apiGateway.js
const express = require('express');
const authMiddleware = require('./middleware/auth'); // Middleware to check JWT tokens
const authRoutes = require('./routes/auth');
const pricingRoutes = require('./routes/pricing');
const dataCollectionRoutes = require('./routes/dataCollection');
const dashboardRoutes = require('./routes/dashboard'); // For reporting and analytics
const userRoutes = require('./routes/user'); // For user account management

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // Authentication routes: login, signup
app.use('/api/pricing', authMiddleware, pricingRoutes); // Pricing-related actions, protected by auth middleware
app.use('/api/data', authMiddleware, dataCollectionRoutes); // Data collection and management, protected
app.use('/api/dashboard', authMiddleware, dashboardRoutes); // Dashboard for analytics and reporting, protected
app.use('/api/user', authMiddleware, userRoutes); // User account management, protected

// Error handling middleware for uncaught errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
