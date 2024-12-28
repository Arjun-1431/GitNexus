import mongoose from "mongoose";

export default async function connectMongoDB() {
	try {
		await mongoose.connect("");
		console.log("MONGODB connected");
	} catch (error) {
		console.log("Error connecting to MongoDB: ", error.message);
	}
}
