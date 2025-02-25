import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/customError.js";
import jwt from "jsonwebtoken";

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

export const logIn = async (req, res, next) => { 
    const {email, password} = req.body

    try {
        const validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404, "User Not Found!"));
        const validPassword = await bcryptjs.compare( password, validUser.password)
        if(!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: hashedPassword, ...restData} = validUser._doc
        const expiryDate = new Date( Date.now() + 3600000)
        res.cookie("token", token, {httpOnly: true, expires: expiryDate}).status(200).json(restData)
    } catch (error) {
        next(error)
    }

}