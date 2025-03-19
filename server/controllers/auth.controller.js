import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { emailTemplateForResetPasswordUrl, emailTemplateForVerificationCode } from "../utils/emailTemplates.js";

export const signIn = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;
        if (!username || !email || !phone || !password) {
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

        if (registerationAttemptsByUser.length >= 3) {
            return next(new ApiError(400, "You have exceeded the maximum number of attempts (3). Please try again after 30 Minutes."));
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

        const message = emailTemplateForVerificationCode(verificationCode);
        await sendEmail({ email, subject: "Your Verification Code", message });
        return res.status(200).json(new ApiResponse(200, null, `User Created Successfully and Verification code successfully sent to Email: ${email} `))

    } catch (error) {
        next(error)
    }
}

export const logIn = async (req, res, next) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new ApiError(400, "Both email and password are required."));
        }
        const validUser = await User.findOne({ email, accountVerified: true })
        if (!validUser) return next(new ApiError(404, "No account found with this email or the account is not verified."));
        const validPassword = await bcryptjs.compare(password, validUser.password)
        if (!validPassword) return next(new ApiError(401, "Invalid email or password."));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        const { password: hashedPassword, ...restData } = validUser._doc
        const expiryDate = new Date(Date.now() + 3600000)
        res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200)
            .json(new ApiResponse(200, { ...restData, token }, "User logged in successfully."));
    } catch (error) {
        next(error)
    }

}

export const google = async (req, res, next) => {

    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });
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

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
            });
            const { password: hashedPassword2, ...restData } = newUser._doc
            const expiryDate = new Date(Date.now() + 3600000)

            res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200)
                .json(new ApiResponse(200, { ...restData, token }, "Google Sign-Up Successful"));

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

export const verifyOTP = async (req, res, next) => {
    const { email, otp, phone } = req.body;

    function validatePhoneNumber(phone) {
        const phoneRegex = /^\+91\d{10}$/;
        return phoneRegex.test(phone);
    }
    if (!validatePhoneNumber(phone)) {
        return next(new ApiError(400, "Invalid phone number."));
    }

    try {
        const userAllEntries = await User.find({
            $or: [
                {
                    email,
                    accountVerified: false,
                },
                {
                    phone,
                    accountVerified: false,
                },
            ],
        }).sort({ createdAt: -1 });

        if (!userAllEntries) {
            return next(new ApiError(404, "User not found."));
        }

        let user;

        if (userAllEntries.length > 1) {
            user = userAllEntries[0];

            await User.deleteMany({
                _id: { $ne: user._id },
                $or: [
                    { phone, accountVerified: false },
                    { email, accountVerified: false },
                ],
            });
        } else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ApiError(400, "Invalid OTP."));
        }

        const currentTime = Date.now();

        const verificationCodeExpire = new Date(
            user.verificationCodeExpire
        ).getTime();
        if (currentTime > verificationCodeExpire) {
            return next(new ApiError(400, "OTP Expired."));
        }

        user.accountVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        const { password: hashedPassword, ...restData } = user._doc
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        const expiryDate = new Date(Date.now() + 3600000)
        res.cookie("token", token, { httpOnly: true, expires: expiryDate })
        res.status(200).json(new ApiResponse(200, { ...restData, token }, "Account Verified."))
    } catch (error) {
        return next(new ApiError(500, "Internal Server Error."));
    }
};

export const getUser = async (req, res, next) => {

    try {
        const user = req.user;
        const userData = await User.findById(user.id).select("-password")
        res.status(200).json(new ApiResponse(200, userData));

    } catch (error) {
        next(error)
    }

};

export const forgotPassword = async (req, res, next) => {

    try {
        const user = await User.findOne({ email: req.body.email, accountVerified: true })
        if (!user) {
            return next(new ApiError(404, "User not found."));
        }

        const resetToken = await user.generateResetPasswordToken();
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/password/${resetToken}`;
        await user.save();

        const message = emailTemplateForResetPasswordUrl(resetPasswordUrl)

        await sendEmail({ email: user.email, subject: "Your Reset Password URL", message });
        return res.status(200).json(new ApiResponse(200, null, `Reset Password link successfully sent to Email: ${user.email} .`))


    } catch (error) {
        next(error)
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: { $gt: Date.now() },
        });
        if (!user) {
            return next(new ApiError(400, "Reset password token is invalid or has been expired."));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ApiError(400, "Password & confirm password do not match."));
        }

        const hashedPassword = await bcryptjs.hash(req.body.password, 10)
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save();

        const { password: hashedPassword2, ...restData } = user._doc
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return res.status(200).json(new ApiResponse(200, { ...restData, token: jwtToken }, "Reset Password Successfully."))

    } catch (error) {
        next(error)
    }
};  