import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return next(new ApiError(401, "You are not Authenticated"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new ApiError(403, "Token is not Valid."));

        req.user = user
        next()
    })
}