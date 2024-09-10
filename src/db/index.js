import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * Meathod-2
 * separating all the DB connection logic in to DB folder
 * - modular
 */

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/${DB_NAME}`
		);
		console.log(connectionInstance);
		console.log(`DB Host : ${connectionInstance.connection.host}`);
	} catch (error) {
		console.log(`connecting MongoDB Failed : ${error}`);
		process.exit(1);
	}
};

export default connectDB;
