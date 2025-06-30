import express from "express"
import {createPackage, deletePackage, getAllPackages, getPackageById, updatePackage} from '../controllers/packageController.js'
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.single("image"), createPackage);
router.get("/getall", getAllPackages);
router.get("/getallbyid/:id", getPackageById);
router.put("/update/:id",upload.single('image'), updatePackage);
router.delete("/delete/:id", deletePackage);
export  default router
