import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect=async(req,res)=>{
    try {
     
       await mongoose.connect(process.env.MONGO_URl, {
  
  
    });
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log(error);
        
    }
}