import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return next(new ApiError(401, "Unauthorized! No token provided."));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new ApiError(403, "Invalid or expired token. Please log in again."));

        req.user = user
        next()
    })
}