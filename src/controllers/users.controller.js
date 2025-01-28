import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async(user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "error while generating tokens");
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const { username, fullname, email, password } = req.body;
    if([username,fullname,email,password].some((field) => field.trim() === "")){
        throw new ApiError(400, "all fields are required");
    }
    const isUserExist = await User.findOne({email});
    if(isUserExist){
        throw new ApiError(400, "user already exist");
    }
    const user = await User.create({
        username: username.toLowerCase(),
        fullname: fullname,
        email: email,
        password: password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating user");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "user registered successfully"
        )
    )
});

const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if(!(email && password)){
        throw new ApiError(400, "credentials required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "user not found");
    }
    const IsPasswordCorrect = await user.isPasswordCorrect(password);
    if(!IsPasswordCorrect){
        throw new ApiError(400, "incorrect credentials");
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
   
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser
            },
            "user logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "user logged out successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}