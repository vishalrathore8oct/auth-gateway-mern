import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import { removeUnverifiedAccounts } from "./utils/removeUnverifiedUser.js";

dotenv.config();

removeUnverifiedAccounts()
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected successfully");
    
}).catch((err) => {
    console.log("MongoDB connected Error", err);
    
})

const app = express();
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: [process.env.FRONTEND_URL], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}\nURL => http://localhost:${PORT}`);
})


app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)


app.use(errorMiddleware)