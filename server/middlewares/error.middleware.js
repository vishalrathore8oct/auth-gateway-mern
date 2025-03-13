export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error!";

    if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = `Invalid ${err.path}`;
    }
    if (err.name === "JsonWebTokenError") {
        err.statusCode = 400;
        err.message = `Json Web Token is invalid, Try again.`;
    }

    if (err.name === "TokenExpiredError") {
        err.statusCode = 400;
        err.message = `Json Web Token is expired, Try again.`;
    }

    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode,
    });
};
