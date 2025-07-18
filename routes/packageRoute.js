import express from "express"
import {createPackage, deletePackage, getAllPackages, getPackageById, getPackagesByStatus, isActivePackage, updatePackage} from '../controllers/packageController.js'
import { upload } from "../middleware/uploadMiddleWare.js";
import { verifyToken } from "../middleware/verifyAdminToke.js";
const router = express.Router();

router.post("/create",upload.single("image"), createPackage);
router.get("/getall",getAllPackages);
router.get("/dataforhome",getPackagesByStatus);
router.get("/getallbyid/:id", getPackageById);
router.put("/update/:id",upload.single("image"), updatePackage);
router.delete("/delete/:id", deletePackage);


router.put("/status/", isActivePackage);

export  default router
