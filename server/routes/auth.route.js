import express from "express";
import { signIn, logIn, google, logOut } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/sign-in", signIn)
router.post("/log-in", logIn)
router.post("/google", google)
router.get("/log-out", logOut)

export default router