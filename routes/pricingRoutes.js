const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to verify if the user is authenticated
router.use(authMiddleware.verifyToken);

router.get('/', pricingController.getPricingStrategies);
router.get('/:strategyId', pricingController.getPricingStrategyById);
router.post('/', authMiddleware.adminRoleRequired, pricingController.createPricingStrategy);
router.put('/:strategyId', authMiddleware.adminRoleRequired, pricingController.updatePricingStrategy);
router.delete('/:strategyId', authMiddleware.adminRoleRequired, pricingController.deletePricingStrategy);

module.exports = router;
