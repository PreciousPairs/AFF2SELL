require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Kafka } = require('kafkajs');
const bcrypt = require('bcryptjs');

// MongoDB Multi-Tenant Connection Setup
class MongoDBConnector {
    static async connectToTenantDB(tenantId) {
        const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const dbName = `tenant_${tenantId}`; // Dynamic DB naming based on tenant ID
            console.log(`Connected to MongoDB for tenant ${tenantId}.`);
            return client.db(dbName);
        } catch (error) {
            console.error(`Failed to connect to MongoDB for tenant ${tenantId}:`, error);
            throw error; // Changed from process.exit(1) to throw error for better error handling in async environments
        }
    }
}

// Kafka Producer with Tenant-Specific Topics
class KafkaProducerWithTenantSupport {
    constructor() {
        this.kafka = new Kafka({
            clientId: 'advanced-repricing-service',
            brokers: [process.env.KAFKA_BROKER],
            ssl: true,
            sasl: {
                mechanism: 'plain',
                username: process.env.KAFKA_USERNAME,
                password: process.env.KAFKA_PASSWORD,
            },
        });
        this.producer = this.kafka.producer();
    }

    async connect() {
        await this.producer.connect().catch(err => {
            console.error('Failed to connect Kafka Producer:', err);
            throw err;
        });
        console.log('Kafka Producer connected successfully.');
    }

    async sendMessage(tenantId, topic, messages) {
        const tenantTopic = `${tenantId}-${topic}`; // Tenant-specific topic naming
        try {
            await this.producer.send({
                topic: tenantTopic,
                messages: messages.map(message => ({ value: JSON.stringify(message) })),
            });
            console.log(`Message(s) sent to topic ${tenantTopic} successfully.`);
        } catch (error) {
            console.error(`Failed to send message to topic ${tenantTopic}:`, error);
            throw error;
        }
    }
}

// Enhanced Repricing Logic with Multi-Tenant Support
async function enhancedRepricingLogic(tenantId) {
    const db = await MongoDBConnector.connectToTenantDB(tenantId);
    const producer = new KafkaProducerWithTenantSupport();
    await producer.connect();

    const productsCollection = db.collection('products');
    const strategiesCollection = db.collection('repricingStrategies');
    
    const strategies = await strategiesCollection.find().toArray();
    for (let strategy of strategies) {
        const applicableProducts = await productsCollection.find({ strategyId: strategy._id }).toArray();
        
        for (let product of applicableProducts) {
            const newPrice = calculateNewPrice(product.price, strategy.parameters);
            await productsCollection.updateOne({ _id: product._id }, { $set: { price: newPrice } });
            const encryptedPriceUpdate = encryptData({ productId: product._id.toString(), newPrice });
            await producer.sendMessage(tenantId, 'priceUpdates', [{ key: product._id.toString(), value: encryptedPriceUpdate }]);
            console.log(`Encrypted price update for product ${product._id} (Tenant ${tenantId}) sent to Kafka.`);
        }
    }
}

// Main Function to Run the Advanced Repricing Service
(async () => {
    const tenants = await fetchTenantIds(); // Assume fetchTenantIds() fetches tenant IDs dynamically from a central configuration or database
    for (let tenantId of tenants) {
        enhancedRepricingLogic(tenantId).catch(err => {
            console.error(`Error in repricing logic for tenant ${tenantId}:`, err);
        });
    }
})();

async function fetchTenantIds() {
    // Placeholder for fetching tenant IDs from a central configuration or database
    // Example return value: ['tenant1', 'tenant2']
    return ['tenant1', 'tenant2']; // Replace with actual implementation
}

// Utility functions assumed to be implemented elsewhere
async function calculateNewPrice(currentPrice, strategyParameters) {
    // Placeholder for actual calculation logic
    return currentPrice * 0.95; // Example: apply a 5% discount
}

function encryptData(data) {
    // Placeholder for actual encryption logic
    return Buffer.from(JSON.stringify(data)).toString('base64'); // Example: simple Base64 encoding
}
