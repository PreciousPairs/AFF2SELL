// app.js
const { consumeMessages } = require('./kafka/consumer');
const { processMessage } = require('./services/messageProcessor'); // Define your message processing logic here
// app.js or server.js
const express = require('express');
const app = express();
const { securityMiddlewares } = require('./middleware/securityMiddleware');

// Apply security middlewares
securityMiddlewares(app);

// Continue with the rest of your application setup...

const topic = 'your-topic-name';

consumeMessages(topic, processMessage)
    .then(() => console.log(`Consuming messages from ${topic}`))
    .catch((error) => console.error('Error in Kafka consumer:', error));
