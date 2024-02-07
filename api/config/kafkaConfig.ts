KafkaConfig.ts
import { Kafka, logLevel } from 'kafkajs';

class KafkaConfig {
    private static kafkaInstance: Kafka;
    
    private constructor() {}

    public static getInstance(): Kafka {
        if (!this.kafkaInstance) {
            this.kafkaInstance = new Kafka({
                clientId: 'saas-repricer',
                brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
                ssl: true,
                sasl: {
                    mechanism: 'plain', // Or 'scram-sha-256'/'scram-sha-512'
                    username: process.env.KAFKA_USERNAME,
                    password: process.env.KAFKA_PASSWORD,
                },
                logLevel: logLevel.ERROR, // Adjust log level based on environment
            });
            console.log('Kafka client configured successfully.');
        }
        return this.kafkaInstance;
    }
}

export default KafkaConfig;

