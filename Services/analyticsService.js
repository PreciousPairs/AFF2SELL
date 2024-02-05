const SalesData = require('../models/SalesData');
const UserData = require('../models/UserActivity');
const SystemHealth = require('../models/SystemHealth');

/**
 * Generates a real-time sales report by aggregating sales data.
 * This could involve summing up sales figures, counting transactions, or other metrics relevant to the business model.
 */
exports.generateRealTimeSalesReport = async () => {
    try {
        // Example aggregation query (adjust according to your data structure and needs)
        const salesReport = await SalesData.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } } }, // Last 24 hours
            { $group: { _id: null, totalSales: { $sum: "$amount" }, transactions: { $sum: 1 } } }
        ]);

        if (salesReport.length > 0) {
            return { totalSales: salesReport[0].totalSales, transactions: salesReport[0].transactions };
        } else {
            return { totalSales: 0, transactions: 0 };
        }
    } catch (error) {
        console.error("Error generating real-time sales report:", error);
        throw new Error('Failed to generate real-time sales report.');
    }
};

/**
 * Generates a report on user activity, such as login frequencies, feature usage stats, etc.
 */
exports.generateUserActivityReport = async () => {
    try {
        // Example: Counting user logins in the last 24 hours
        const activityReport = await UserData.aggregate([
            { $match: { activityType: 'login', timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) } } },
            { $group: { _id: null, loginCount: { $sum: 1 } } }
        ]);

        return activityReport.length > 0 ? { loginCount: activityReport[0].loginCount } : { loginCount: 0 };
    } catch (error) {
        console.error("Error generating user activity report:", error);
        throw new Error('Failed to generate user activity report.');
    }
};

/**
 * Assesses and returns the system health status.
 * This function could check various parameters like server load, database connectivity, etc., to determine the overall health.
 */
exports.getSystemHealthStatus = async () => {
    try {
        // Example: Checking database connectivity
        const canConnectToDB = await SystemHealth.checkDatabaseConnectivity();
        const serverLoad = await SystemHealth.getServerLoad();

        if (canConnectToDB && serverLoad < 0.7) { // Assuming serverLoad returns a value between 0 and 1
            return { status: 'Healthy', details: 'All systems operational.' };
        } else {
            return { status: 'Issues Detected', details: 'Potential issues with database connectivity or server load.' };
        }
    } catch (error) {
        console.error("Error assessing system health status:", error);
        return { status: 'Error', details: 'Unable to assess system health.' };
    }
};
