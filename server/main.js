import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected successfully");
    
}).catch((err) => {
    console.log("MongoDB connected Error", err);
    
})

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}\nURL => http://localhost:${PORT}`);
})


app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)


app.use(errorMiddleware)