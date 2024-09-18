import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

/**
 * Algorithm
 *
 * 1.we get cookies from cookie-parser middlware.
 * 2.from cookies we get access_token and refresh_token
 * 3.using jwt, accessToken decoded
 * 4.from the decoded data, we get userId
 * 5.using userId we get user from db
 * 6.check user is existed
 * 7.add user to req with req.user
 * 7.call next()
 */

export const verifyJWT = asyncHandler(async (req, res, next) => {
	const token =
		req.cookies?.access_token ||
		req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		throw new ApiError(401, "unauthorized access");
	}

	const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	const user = await User.findById(decodedInfo._id);

	if (!user) {
		throw new ApiError(401, "Invalid Acces Token");
	}
	req.user = user;

	next();
});
