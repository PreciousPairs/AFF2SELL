import { MongoClient } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

// Import your models here
import UserModel, { UserDocument } from './models/User';
import ProductModel, { ProductDocument } from './models/Product';
// Import any other models as needed

class EnhancedDbConfig {
    private static mongoClientInstance: MongoClient;
    private static mongooseConnection: typeof mongoose;
    private static connectionString: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/myDatabase';
    private static mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10, // Maintain up to 10 socket connections
    };
    private static mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    };

    private constructor() {}

    public static async getMongoClientInstance(): Promise<MongoClient> {
        if (!this.mongoClientInstance) {
            try {
                this.mongoClientInstance = new MongoClient(this.connectionString, this.mongoOptions);
                await this.mongoClientInstance.connect();
                console.log('MongoDB connected successfully with MongoClient.');
            } catch (error) {
                console.error('Failed to connect to MongoDB using MongoClient', error);
                process.exit(1);
            }
        }
        return this.mongoClientInstance;
    }

    public static async getMongooseConnection(): Promise<typeof mongoose> {
        if (!this.mongooseConnection) {
            try {
                this.mongooseConnection = await mongoose.connect(this.connectionString, this.mongooseOptions);
                console.log('MongoDB connected successfully with Mongoose.');

                // Mongoose connection events
                mongoose.connection.on('error', (err) => {
                    console.error(`MongoDB connection error through Mongoose: ${err}`);
                });

                mongoose.connection.on('disconnected', () => {
                    console.log('MongoDB disconnected');
                });

                process.on('SIGINT', async () => {
                    await mongoose.connection.close();
                    console.log('MongoDB disconnected through app termination');
                    process.exit(0);
                });

                // Initialize models
                this.initializeModels();
            } catch (error) {
                console.error('Failed to connect to MongoDB using Mongoose', error);
                process.exit(1);
            }
        }
        return this.mongooseConnection;
    }

    private static initializeModels(): void {
        // Initializing models here ensures that they are available globally through mongoose
        UserModel(mongoose);
        ProductModel(mongoose);
        // Initialize any other models as needed
    }

    public static async closeConnections(): Promise<void> {
        if (this.mongoClientInstance) {
            try {
                await this.mongoClientInstance.close();
                console.log('MongoClient connection closed.');
            } catch (error) {
                console.error('Failed to close MongoClient connection', error);
            }
            this.mongoClientInstance = null;
        }
        if (this.mongooseConnection) {
            try {
                await mongoose.connection.close();
                console.log('Mongoose connection closed.');
            } catch (error) {
                console.error('Failed to close Mongoose connection', error);
            }
            this.mongooseConnection = null;
        }
    }
}

export default EnhancedDbConfig;
export { UserDocument, ProductDocument }; // Export initialized models for easy access