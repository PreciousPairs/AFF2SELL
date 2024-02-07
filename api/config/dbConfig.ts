import mongoose from 'mongoose';

// Import your models here
import UserModel from './models/User';
import ProductModel from './models/Product';
// Import any other models as needed

const connectDB = async (): Promise<void> => {
    const dbURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/myDatabase'; // Default URI

    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(-1);
    }

    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB disconnected through app termination');
        process.exit(0);
    });
};

// Initialize models
const User = UserModel(mongoose);
const Product = ProductModel(mongoose);
// Initialize any other models as needed

export { connectDB, User, Product };