import express from "express";

// import contactRoute from "./contactRoute.js";
import packageRoute from "./packageRoute.js";
import checkouteRoute from "./customerRoutes.js";
const router = express.Router();

router.use('/package', packageRoute);
router.use('/checkout', checkouteRoute);
export default router;
