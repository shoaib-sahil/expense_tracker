import mongoose from "mongoose";

export const connectDB = async () => {
    const db = process.env.MONGODB_URI;

    try {
        const { connection } = await mongoose.connect(db, { useNewUrlParser: true });
        console.log(`MongoDB Connected to ${connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
