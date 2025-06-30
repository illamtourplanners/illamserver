import express from "express"
<<<<<<< HEAD
import { getAllBookings, getAllBookingsCount, getBookingById, makeCheckout } from "../controllers/checkoutController.js";
=======
import {confirmBooking, getAllBookings, getAllBookingsCount, getBookingById, getByTransactionId, makeCheckout } from "../controllers/checkoutController.js";
>>>>>>> dc59509c10910f9ea3345354fa438da37f7e3e0b
import multer from 'multer';
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.single("image"), makeCheckout);
router.get("/bookings/:packageNumber", getAllBookings);
router.get("/bookingdetail/:id", getBookingById);
<<<<<<< HEAD
=======
router.get("/confirmation/:transactionId", getByTransactionId);

router.post("/confirm", confirmBooking);
>>>>>>> dc59509c10910f9ea3345354fa438da37f7e3e0b
router.get("/getcount", getAllBookingsCount);



export  default router
