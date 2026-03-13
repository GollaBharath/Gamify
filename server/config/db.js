import mongoose from "mongoose";
import dotenv from "dotenv";
import { getOrCreateDefaultOrganization } from "../services/organizationService.js";

dotenv.config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: "gamify",
			retryWrites: true,
			w: "majority",
		});
		await getOrCreateDefaultOrganization();
		console.log("✅ Connected to MongoDB");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		process.exit(1);
	}
};

export default connectDB;
