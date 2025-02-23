import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";

const decodeJWT = asyncHandler(async (req, _, next) => {

    const token = req.header("Authorization").replace("Bearer ","");

    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }

    try {

        const decodedJWT = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedJWT._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401, "invalid token");
        }
        req.user = user;
        next();

    } 
    catch (error) {
        throw new ApiError(401, "invalid token");
    }
})

export { decodeJWT }
