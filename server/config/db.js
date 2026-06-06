import mongoose from "mongoose";
import dotenv from "dotenv";
import { getOrCreateDefaultOrganization } from "../services/organizationService.js";

dotenv.config();

const connectDB = async (retries = 5, delay = 1000) => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: "gamify",
			retryWrites: true,
			w: "majority",
		});
		await getOrCreateDefaultOrganization();
		console.log("✅ Connected to MongoDB");
	} catch (err) {
		console.error(`❌ MongoDB connection error (Retries left: ${retries}):`, err.message);
		if (retries === 0) {
			console.error("❌ Max retries reached. Exiting process...");
			process.exit(1);
		}
		console.log(`Retrying connection in ${delay / 1000}s...`);
		await new Promise((resolve) => setTimeout(resolve, delay));
		return connectDB(retries - 1, delay * 2);
	}
};

export default connectDB;
