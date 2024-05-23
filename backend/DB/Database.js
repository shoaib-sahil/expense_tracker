import mongoose from "mongoose";

export const connectDB = async () => {
    const db = process.env.MONGODB_URI;

    try {
        const { connection } = mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 });
        console.log(`MongoDB Connected to ${connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
