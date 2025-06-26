import express from "express"
import {getAllBookings, getBookingById, makeCheckout } from "../controllers/checkoutController.js";
import multer from 'multer';
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.single("image"), makeCheckout);
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
export  default router
