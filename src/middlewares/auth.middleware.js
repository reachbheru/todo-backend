import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const decodeCognitoToken = asyncHandler(async (req, _, next) => {
  const idToken = req.header("x-id-token");

  if (!idToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "id",
      clientId: process.env.COGNITO_CLIENT_ID,
    });

    const payload = await verifier.verify(idToken);
    const email = payload.email;
    const user = await User.findOne({ email }).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    throw new ApiError(401, "Invalid or expired token");
  }
});

export { decodeCognitoToken };
