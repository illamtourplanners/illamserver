import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Tour } from "../model/tourSchema.js";


export const createNewPost=async(req,res)=>{
    const {title,description}=req.body;

    try {
        let imageUrl = "";
            if (req.file) {
              const result = await cloudinaryInstance.uploader.upload(req.file.path, {
                folder: "tours"
              });
              imageUrl = result.secure_url;
            }
        
        const newPost = await Tour.create({title,description,image:imageUrl});
        res.status(201).json({ status: "success", message: "Post created successfully", newPost });

        
        
    } catch (error) {
        console.log(error);
         res.status(500).json({ status: "failure", message: error.message });
    }

}

export const getallPosts=async(req,res)=>{
    try {
        const posts = await Tour.find().sort({createdAt:-1});
        res.status(200).json({status:success,message:"Posts retrieved successfully",posts});
        
    } catch (error) {
          console.log(error);
        res.status(500).json({status:failure,message:error.message});
    }
}