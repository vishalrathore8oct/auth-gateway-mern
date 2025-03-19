import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
    },
    phone: {
        type: String,
        required: true,
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date


}, { timestamps: true })

userSchema.methods.generateVerificationCode = function () {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigit = Math.floor(Math.random() * 10000).toString().padStart(5, 0)
        return parseInt(firstDigit + remainingDigit)
    }

    const verificationCode = generateRandomFiveDigitNumber()
    this.verificationCode = verificationCode
    this.verificationCodeExpire = (Date.now() + (10 * 60 * 1000))

    return verificationCode
}

userSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

const User = mongoose.model("User", userSchema)

export default User;