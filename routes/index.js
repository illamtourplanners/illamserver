import express from "express";

// import contactRoute from "./contactRoute.js";
import packageRoute from "./packageRoute.js";
import checkouteRoute from "./customerRoutes.js";
import passengerRoute from "./passengerRoute.js";
const router = express.Router();

router.use('/package', packageRoute);
router.use('/checkout', checkouteRoute);
router.use('/passenger', passengerRoute);
export default router;
