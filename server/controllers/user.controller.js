import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcryptjs from "bcryptjs"

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(new ApiError(401, "Unauthorized! You can only update your own account."));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { 
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            }
        },
            { new: true }
        )

        if (!updatedUser) {
            return next(new ApiError(404, "User not found!"));
        }

        const {password, ...rest} = updatedUser._doc
        res.status(200).json(new ApiResponse(200, rest, "User updated successfully"));

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(new ApiError(401, "Unauthorized! You can only delete your own account."));
    }

    try {
        const user = await User.findByIdAndDelete(req.params.id) 
        if (!user) {
            return next(new ApiError(404, "User not found!"));
        }

        res.clearCookie("token").status(200).json(new ApiResponse(200, null, "User has been deleted successfully!"));

    } catch (error) {
        next(error)
    }
}