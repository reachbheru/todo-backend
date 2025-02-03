import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/users.controller.js";
import { decodeJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(decodeJWT,logoutUser);

export default router;