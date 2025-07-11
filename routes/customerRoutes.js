import express from "express"

// import { getAllBookings, getAllBookingsCount, getBookingById, makeCheckout } from "../controllers/checkoutController.js";

import {confirmBooking, deleteCustomerFromBooking, getAllBookings, getAllBookingsCount, getBookingById, getByTransactionId, makeCheckout } from "../controllers/checkoutController.js";

import multer from 'multer';
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create",upload.single("image"), makeCheckout);
router.get("/bookings/:packageNumber", getAllBookings);
router.get("/bookingdetail/:id", getBookingById);

router.get("/confirmation/:transactionId", getByTransactionId);
router.delete('/booking/:bookingId', deleteCustomerFromBooking);

router.post("/confirm", confirmBooking);

router.get("/getcount", getAllBookingsCount);



export  default router
