import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
	try {
		console.log("onCloudinaryUpload");
		1;
		if (!localFilePath) {
			return null;
		}
		console.log("before upload call");
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});
		fs.unlinkSync(localFilePath);
		console.log(response);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath);
		console.log("oncloudinaryUpload Error");
		return null;
	}
};

export { uploadOnCloudinary };
