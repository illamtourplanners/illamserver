import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Tour } from "../model/tourSchema.js";


export const createNewPost = async (req, res) => {
  const { title, description } = req.body;

  try {
    let imageUrls = [];

    // Check if files are uploaded
    if (req.files && req.files.length > 0) {
      // Upload each file to Cloudinary
      for (let file of req.files) {
        const result = await cloudinaryInstance.uploader.upload(file.path, {
          folder: "tours"
        });
        imageUrls.push(result.secure_url);
      }
    }

    const newPost = await Tour.create({
      title,
      description,
      images: imageUrls, // Store image array
    });

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

export const getallPosts=async(req,res)=>{
    try {
        const posts = await Tour.find().sort({createdAt:-1});
        res.status(200).json({status:"success",message:"Posts retrieved successfully",posts});
        
    } catch (error) {
          console.log(error);
        res.status(500).json({status:"failure",message:error.message});
    }
}

