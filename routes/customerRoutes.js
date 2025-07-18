import express from "express"

// import { getAllBookings, getAllBookingsCount, getBookingById, makeCheckout } from "../controllers/checkoutController.js";

import {confirmBooking, deleteCustomerFromBooking, getAllBookings, getAllBookingsCount, getBookingById, getByBookingNumber, getByTransactionId, makeCheckout, verifyPayment } from "../controllers/checkoutController.js";

import multer from 'multer';
import { upload } from "../middleware/uploadMiddleWare.js";
const router = express.Router();

router.post("/create", makeCheckout);
router.post("/confirm",upload.none(), verifyPayment);

router.get("/bookings/:packageNumber", getAllBookings);
router.get("/bookingdetail/:id", getBookingById);

router.get("/confirmation/:transactionId", getByTransactionId);
router.delete('/booking/:bookingId', deleteCustomerFromBooking);

router.post("/statusConfirm", confirmBooking);

router.get("/getcount", getAllBookingsCount);

router.get("/getbyBKN", getByBookingNumber);

export  default router
