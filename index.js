import express from "express";
import v1Router from "./routes/index.js";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./config/db.js";

import cookieParser from 'cookie-parser';
const PORT=process.env.PORT








const app=express()
// Middlewares
app.use(cookieParser());

app.use(express.json());

app.use(cors({
  origin: process.env.CORS, 
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(logger("dev"));


dbConnect()
app.use("/api/v1", v1Router);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})