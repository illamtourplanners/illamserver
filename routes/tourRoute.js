import express from "express"
import { createNewPost, createVideo, deletePost, getallPosts, getVideo, postLike } from "../controllers/tourController.js";
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.array('images', 6), createNewPost);
router.get("/getall",getallPosts)
router.delete("/delete/:id",deletePost)

router.post('/like/:id',postLike)


router.post("/createv-video",upload.single('video'), createVideo);
router.get("/get-video",getVideo)

export  default router
