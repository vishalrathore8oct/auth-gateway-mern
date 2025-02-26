import mongoose from "mongoose";
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/customError.js";

export const signIn = async (req, res, next) => {
    const {username, email, password} = req.body;
    try {
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = new User({username, email, password: hashedPassword})
        await newUser.save()

        res.status(201).json({message: "User Created Successfully"})
        
    } catch (error) {
        next(error)
    }
}