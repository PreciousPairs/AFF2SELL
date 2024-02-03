// dbInit.js
const { MongoClient } = require('mongodb');

async function initDb() {
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('your_db_name');

    // Ensure indexes for efficient queries
    await db.collection('items').createIndexes([
        { key: { itemId: 1 }, unique: true },
        { key: { categoryPath: 1 } }
    ]);
    console.log("Database initialized with necessary indexes.");

    await client.close();
}

initDb().catch(console.error);
