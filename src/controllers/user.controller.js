import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessandRefreshToken = async (userId) => {
	const user = await User.findById(userId);
	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();
	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });
	return { accessToken, refreshToken };
};

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
	``;
	//step 1
	const { userName, email, password, fullName } = req.body;
	console.log("user details: \n", userName, email, password, fullName);
	console.log("request object contents :\n", req);

	//step 2
	if ([userName, email, password, fullName].some((f) => f.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	//step 3
	const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
	if (existedUser) {
		throw new ApiError(409, "user already exists with this email or userName");
	}

	//step 4
	console.log("files in request object :\n", req.files);
	const avatarLocalPath = req.files?.avatar[0]?.path;
	console.log("avatar in files in request object :\n", req.files.avatar);
	const coverImageLocalPath =
		(req.files.coverImage && req.files?.coverImage[0]?.path) || "";

	// let coverImageLocalPath;
	// if (
	// 	req.files &&
	// 	Array.isArray(req.files.coverImage) &&
	// 	req.files.coverImage.length > 0
	// ) {
	// 	coverImageLocalPath = req.files.coverImage[0].path;
	// }
	console.log(
		"coverimage in files in request object :\n",
		req.files.coverImage
	);
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar Image is Required.");
	}

	//step 5
	const avatar = await uploadOnCloudinary(avatarLocalPath);
	const coverImage = await uploadOnCloudinary(coverImageLocalPath);
	console.log("cloudinary response object of avater \n", avatar);
	console.log("cloudinary response object of coverImage \n", coverImage);

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
		coverImage: (coverImage && coverImage.url) || "",
	});
	console.log("created user Entry : \n", user);

	//step 7
	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	//step 8
	if (!createdUser) {
		throw new ApiError(500, "something went wrong in registering user");
	}

	//step 9
	res
		.status(200)
		.json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	/**
	 * Algorithm
	 * take data from req.body
	 * username | email base login
	 * find the user in db
	 * check the password
	 * generate tokens access and refresh [send to user]
	 * send cookies	 *
	 */

	const { userName, email, password } = req.body;
	if (!userName || !email) {
		throw new ApiError(400, "username or email is required");
	}

	const user = await User.findOne({ $or: [{ userName }, { email }] });
	if (!user) {
		throw new ApiError(404, "user not found");
	}

	const passwordMatch = await user.isPasswordCorrect(password);
	if (!passwordMatch) {
		throw new ApiError(403, "password is incorrect");
	}

	const { accessToken, refreshToken } = await generateAccessandRefreshToken(
		user._id
	);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	res
		.status(200)
		.cookie("access_token", accessToken, options)
		.cookie("refresh_token", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					accessToken,
					refreshToken,
				},
				"user logged in successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	/**
	 * logging out user
	 *
	 * 1. reset the refreshToken in db to undefined using findByIdAndUpdate() meathod
	 * 2. detelete cookies using clearCookies meathod from cookie-parser middleware
	 *
	 * - to perform all this we need access to user, but here we dont have user.
	 * we can create a middlewere which can give acces to user by adding on req/res obj.
	 *
	 *
	 */

	User.findByIdAndUpdate(
		req.user.id,
		{
			$set: {
				refreshToken: undefined,
			},
		},
		{
			new: true,
		}
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookies("access_token", options)
		.clearCookies("refresh_token", options)
		.json(new ApiResponse(200, {}, "user logged out Successfully"));
});

export { registerUser, loginUser, logoutUser };
