import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Tour } from "../model/tourSchema.js";
import { Video } from "../model/videoSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";


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


export const deletePost =async(req,res)=>{
  try {
    const {id}=req.params
    const post = await Tour.findByIdAndDelete(id);
    if(!post) {
      return res.status(404).json({status:"failure",message:"Post not found"})
      }
      res.status(204).json({status:"success",message:"Post deleted successfully"})
    
  } catch (error) {
    console.log(error);
    
  }
}


export const postLike=async(req,res)=>{
  try {
    const {id}=req.params
    const tour=await Tour.findById(id)
    if(!tour) {
      return res.status(404).json({status:"failure",message:"Post not found"})
      }
      tour.likes += 1;
    await tour.save();

    res.status(200).json({ success: true, likes: tour.likes });
    
  } catch (error) {
    console.log(error);
    
  }
}


export const createVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ status: "failure", message: "Video file is required" });
  }

  // Upload video to Cloudinary
  const result = await cloudinaryInstance.uploader.upload(req.file.path, {
    folder: "tours/videos",
    resource_type: "video",
  });

  const newPost = await Video.create({
    title,
    description,
    video: result.secure_url,
  });

  res.status(201).json({
    status: "success",
    message: "Video post created successfully",
    newPost,
  });
});

export const getVideo=async(req,res)=>{
  const data=await Video.find()
  res.status(201).json({
 data
  });

}