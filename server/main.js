import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected successfully");
    
}).catch((err) => {
    console.log("MongoDB connected Error", err);
    
})

const app = express();

app.listen(3000, () => {
    console.log("Server Listening on Port 3000");
})


app.use("/api/user", userRoutes)
