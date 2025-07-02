import express from "express"
import { createNewPost, deletePost, getallPosts } from "../controllers/tourController.js";
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.array('images', 6), createNewPost);
router.get("/getall",getallPosts)
router.delete("/delete/:id",deletePost)

export  default router
