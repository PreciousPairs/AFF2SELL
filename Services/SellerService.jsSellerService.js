const axios = require('axios');
const { kafkaProducer } = require('./KafkaProducer');

async function fetchSellerInventory(sellerId) {
    const inventoryItems = []; // Placeholder for inventory items
    try {
        // Fetch inventory from Seller API in batches
        let hasMoreItems = true;
        let nextPageToken = null;

        while (hasMoreItems) {
            const response = await axios.get(`${process.env.SELLER_API_URL}/inventory/${sellerId}`, {
                params: { nextPageToken },
                headers: { Authorization: `Bearer ${process.env.SELLER_API_TOKEN}` },
            });

            inventoryItems.push(...response.data.items);
            nextPageToken = response.data.nextPageToken;
            hasMoreItems = nextPageToken !== null;

            // Rate limiting compliance
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Produce messages to Kafka for each inventory item
        inventoryItems.forEach(item => {
            kafkaProducer.send({
                topic: process.env.KAFKA_INVENTORY_TOPIC,
                messages: [{ value: JSON.stringify(item) }],
            });
        });

    } catch (error) {
        console.error("Failed to fetch seller inventory:", error);
        // Implement retry mechanism with exponential backoff
    }
}
