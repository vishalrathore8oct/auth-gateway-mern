import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import { errorMiddleware } from "./middlewares/error.middleware.js";
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected successfully");
    
}).catch((err) => {
    console.log("MongoDB connected Error", err);
    
})

const app = express();
app.use(express.json())

app.listen(3000, () => {
    console.log("Server Listening on Port 3000");
})


app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

app.use(errorMiddleware)
