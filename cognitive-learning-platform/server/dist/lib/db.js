// --- START OF FILE server/lib/db.ts ---
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in the .env file.");
    process.exit(1);
}
// Mongoose connection options for better performance and stability
const mongooseOptions = {
// These are no longer needed in Mongoose 6+ but are good to be aware of
// useNewUrlParser: true,
// useUnifiedTopology: true,
};
/**
 * Connects to the MongoDB database.
 * This function handles the connection and logs the status.
 */
export async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URI, mongooseOptions);
        console.log("✅ Successfully connected to MongoDB.");
    }
    catch (error) {
        console.error("⚠️  Database connection failed:", error);
        console.log("ℹ️  Running without MongoDB. Some features may not work.");
        // Don't exit the process, allow the server to run without DB
    }
}
// --- END OF FILE server/lib/db.ts ---
//# sourceMappingURL=db.js.map