import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
	/**
	 * Algorithm
	 *
	 * 1.taking data from fronted / user
	 * 2.validating data taken from user
	 * 3.check if user already existed
	 * 4.check images
	 * 5.upload images to cloudinary
	 * 6.create user object and entry in db
	 * 7.remove password and refresh token in response field
	 * 8.check created user
	 * 9.send response
	 */

	//step 1
	const { userName, email, password, fullName } = req.body;
	console.log(userName, email, password, fullName);

	//step 2
	if ([userName, email, password, fullName].some((f) => f.trin() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	//step 3
	const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
	if (!existedUser) {
		throw new ApiError(409, "user already exists with this email or userName");
	}

	//step 4
	const avatarLocalPath = req.files?.avatar[0]?.path;
	console.lof(req.files.avatar);
	const coverImageLocalPath = req.files?.coverImage[0]?.path;
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar Image is Required.");
	}

	//step 5
	const avatar = await uploadOnCloudinary(avatarLocalPath);
	const coverImage = await uploadOnCloudinary(coverImageLocalPath);
	if (!avatar) {
		throw new ApiError(400, "avatar is required");
	}

	//step 6
	const user = await User.create({
		userName,
		email,
		password,
		fullName,
		avatar: avatar.url,
		coverImage: coverImage.url || "",
	});

	//step 7
	const createdUser = await User.findById(user._id).select(
		"-password -refreshtoken"
	);

	//step 8
	if (!createdUser) {
		throw new ApiError(500, "something went wrong in registering user");
	}

	//step 9
	res
		.status(200)
		.json(new ApiResponse(200, createdUser, "user registered successfully"));

	res.status(200).json({ message: "ok" });
});

const loginUser = asyncHandler(async (req, res) =>
	res.status(200).json({ message: "login successful" })
);

export { registerUser, loginUser };
