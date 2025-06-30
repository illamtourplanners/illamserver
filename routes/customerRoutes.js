import express from "express"
import { getAllBookings, getAllBookingsCount, getBookingById, makeCheckout } from "../controllers/checkoutController.js";
import multer from 'multer';
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.single("image"), makeCheckout);
router.get("/bookings/:packageNumber", getAllBookings);
router.get("/bookingdetail/:id", getBookingById);
router.get("/getcount", getAllBookingsCount);



export  default router
