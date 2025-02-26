import express from "express";
import { signIn, logIn } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/sign-in", signIn)
router.post("/log-in", logIn)

export default router