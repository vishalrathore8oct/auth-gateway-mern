import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected successfully");
    
}).catch((err) => {
    console.log("MongoDB connected Error", err);
    
})

const app = express();

app.get("/", (req, res) => {
    res.send("Hello Server")
})

app.listen(3000, () => {
    console.log("Server Listening on Port 3000");
})