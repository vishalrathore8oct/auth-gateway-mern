import express from "express";
import { signIn, logIn, google, logOut, verifyOTP, getUser, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router()

router.post("/google", google)
router.post("/sign-in", signIn)
router.post("/otp-verification", verifyOTP);
router.post("/log-in", logIn)
router.get("/log-out", verifyToken, logOut)
router.get("/me", verifyToken, getUser);
router.post("/forgot/password", forgotPassword)
router.put("/reset/password/:token", resetPassword)

export default router