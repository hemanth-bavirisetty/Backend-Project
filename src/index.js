// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config({
	path: './env'
});


connectDB()
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