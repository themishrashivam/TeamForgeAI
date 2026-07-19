import express from 'express'
import dbconnect from './config/db.js'
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import requestRoutes from "./routes/requestRoutes.js"
import searchRoutes from "./routes/searchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cors from 'cors';
dotenv.config();
import cookieParser from 'cookie-parser';
const app = express()

dbconnect();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TeamForge AI Backend is Running 🚀"
  });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1", userRoutes);

app.use("/api/v1", requestRoutes);
app.use("/api/v1", notificationRoutes);

app.use("/api/v1", projectRoutes);



app.listen(process.env.PORT,()=>{
    console.log("server is running");
})