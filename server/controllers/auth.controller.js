import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/customError.js";
import jwt from "jsonwebtoken";

export const signIn = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()

        res.status(201).json({ message: "User Created Successfully" })

    } catch (error) {
        next(error)
    }
}

export const logIn = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, "User Not Found!"));
        const validPassword = await bcryptjs.compare(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...restData } = validUser._doc
        const expiryDate = new Date(Date.now() + 3600000)
        res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200).json(restData)
    } catch (error) {
        next(error)
    }

}

export const google = async (req, res, next) => {

    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...restData } = user._doc
            const expiryDate = new Date(Date.now() + 3600000)
            // console.log("oAuth-log-in", restData);
            res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200).json(restData)
        } else {
            const generatedPassword = (Math.random().toString(36).slice(-8)) + (Math.random().toString(36).slice(-8))
            const hashedPassword = await bcryptjs.hash(generatedPassword, 10)
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8), email: req.body.email, password: hashedPassword, profilePicture: req.body.photo })
            await newUser.save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...restData } = newUser._doc
            const expiryDate = new Date(Date.now() + 3600000)
            // console.log("oAuth-sing-in", restData);
            res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200).json(restData)
            
        }
    } catch (error) {
        next(error)
    }


}

export const logOut = async (req, res, next) => {
    try {
        res.clearCookie('token').status(200).json("Log Out Successfully Done.")
    } catch (error) {
        next(error)
    }
}