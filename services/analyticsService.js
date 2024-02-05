const SalesData = require('../models/SalesData');
const UserData = require('../models/UserData');

exports.generateSalesReport = async () => {
  const salesReport = await SalesData.aggregate([...]); // Complex aggregation queries
  return salesReport;
};

exports.generateUserActivityReport = async () => {
  const userActivityReport = await UserData.aggregate([...]); // Complex aggregation queries
  return userActivityReport;
};
