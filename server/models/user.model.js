import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    phone: String,
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
    this.verificationCodeExpire = (Date.now() + (5 * 60 * 1000))

    return verificationCode
}

const User = mongoose.model("User", userSchema)

export default User;