import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
// import twilio from "twilio";

// const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const signIn = async (req, res, next) => {
    try {
        const { username, email, phone, password, verificationMethod } = req.body;
        if (!username || !email || !phone || !password || !verificationMethod) {
            return next(new ApiError(400, "All fields are required."));
        }
        function validatePhoneNumber(phone) {
            const phoneRegex = /^\+91\d{10}$/;
            return phoneRegex.test(phone);
        }
        if (!validatePhoneNumber(phone)) {
            return next(new ApiError(400, "Invalid phone number."));
        }
        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true,
                },
                {
                    phone,
                    accountVerified: true,
                },
            ],
        });

        if (existingUser) {
            return next(new ApiError(400, "Phone or Email is already used."));
        }

        const registerationAttemptsByUser = await User.find({
            $or: [
                { phone, accountVerified: false },
                { email, accountVerified: false },
            ],
        });

        if (registerationAttemptsByUser.length > 3) {
            return next(new ApiError(400, "You have exceeded the maximum number of attempts (3). Please try again after an hour."));
        }


        const hashedPassword = await bcryptjs.hash(password, 10)
        const userData = {
            username,
            email,
            phone,
            password: hashedPassword,
        };
        const user = await User.create(userData);
        const verificationCode = await user.generateVerificationCode();
        await user.save();

        await sendVerificationCode(
            verificationMethod,
            verificationCode,
            username,
            email,
            phone,
            res,
            next
        );

        // res.status(201).json(new ApiResponse(201, null, "User Created Successfully"));

    } catch (error) {
        next(error)
    }
}

async function sendVerificationCode(
    verificationMethod,
    verificationCode,
    username,
    email,
    phone,
    res,
    next
) {
    try {
        if (verificationMethod === "email") {
            const message = generateEmailTemplate(verificationCode);
            await sendEmail({ email, subject: "Your Verification Code", message });
            return res.status(200).json(new ApiResponse(200, null, `Verification email successfully sent to ${username}`))
        } 
        // else if (verificationMethod === "call") {
        //     const verificationCodeWithSpace = verificationCode
        //         .toString()
        //         .split("")
        //         .join(" ");

        //     await client.studio.v2.flows(process.env.TWILIO_FLOW_ID)
        //         .executions
        //         .create({
        //             twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        //             to: phone,
        //             from: process.env.TWILIO_PHONE_NUMBER,
        //         });

        //     return res.status(200).json(new ApiResponse(200, null, `Voice Call Successfully sent to ${phone}`))
        // } 
        // else if (verificationMethod === "sms") {
    
        //     await client.messages.create({
        //         body: `Your verification code is: ${verificationCode}`,
        //         from: process.env.TWILIO_PHONE_NUMBER,
        //         to: phone
        //     });

        //     return res.status(200).json(new ApiResponse(200, null, `SMS Successfully sent to ${phone}`))
        // } 
        else {
            return next(new ApiError(400, "Invalid verification method."));
        }
    } catch (error) {
        console.error("Error sending verification code:", error);
        return next(new ApiError(500, "Verification code failed to send."));
    }
}

function generateEmailTemplate(verificationCode) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Dear User,</p>
        <p style="font-size: 16px; color: #333;">Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
            ${verificationCode}
          </span>
        </div>
        <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
        <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
          <p>Thank you,<br>Your Company Team</p>
          <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
        </footer>
      </div>
    `;
}


export const logIn = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(new ApiError(404, "User Not Found!"));
        const validPassword = await bcryptjs.compare(password, validUser.password)
        if (!validPassword) return next(new ApiError(401, "Wrong Credentials!"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...restData } = validUser._doc
        const expiryDate = new Date(Date.now() + 3600000)
        res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200)
            .json(new ApiResponse(200, restData, "Login Successful"));
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

            res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200)
                .json(new ApiResponse(200, restData, "Google Login Successful"));
        } else {
            const generatedPassword = (Math.random().toString(36).slice(-8)) + (Math.random().toString(36).slice(-8))
            const hashedPassword = await bcryptjs.hash(generatedPassword, 10)
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            })
            await newUser.save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...restData } = newUser._doc
            const expiryDate = new Date(Date.now() + 3600000)

            res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200)
                .json(new ApiResponse(200, restData, "Google Sign-Up Successful"));

        }
    } catch (error) {
        next(error)
    }


}

export const logOut = async (req, res, next) => {
    try {
        res.clearCookie("token").status(200)
            .json(new ApiResponse(200, null, "Log Out Successfully Done."));
    } catch (error) {
        next(error)
    }
}