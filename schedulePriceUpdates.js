// schedulePriceUpdates.js
const cron = require('node-cron');
const { fetchAndStoreItems } = require('./fetchAndStoreItems');
const { fetchCompetitorData, updateItemPrice } = require('./pricing');

async function checkAndUpdatePrices() {
    const items = await fetchAndStoreItems(); // Assuming this function now returns the list of items

    for (const item of items) {
        const competitorPrice = await fetchCompetitorData(item.itemId);
        const newPrice = competitorPrice - 0.01; // Example logic for new price calculation
        await updateItemPrice(item.itemId, newPrice);
    }
}

// Schedule to run every day at midnight
cron.schedule('0 0 * * *', checkAndUpdatePrices);
