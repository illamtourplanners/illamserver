import express from "express"
import { createNewPost } from "../controllers/tourController.js";
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.single("image"), createNewPost);

export  default router
