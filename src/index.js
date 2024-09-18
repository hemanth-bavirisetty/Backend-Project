// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
	path: "./.env",
});

connectDB()
	.then((res) => {
		// listening on event error
		app.on("error", (err) => {
			console.log("Err: ", err);
			throw err;
		});

		app.listen(process.env.PORT || 8000, () => {
			console.log(`Server is running on port ${process.env.PORT || 8000}`);
		});
	})
	.catch((err) => {
		console.log(`MongoDB connection failed: ${err}`);
	});

/**
 *
 * Meathod 1 - do everythin in index.js file (not good practice) 

(async () => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
		console.log(connectionInstance);
		console.log(`Mongodb connectd!! DB Host :  ${connectionInstance.connection.host}`)
	} catch (error) {
		console.log(`MongoDB connection FAILED ${error} `)
		process.exit(1)
	}
})()

 */
