import express from 'express';
import { getPickupList, updateBoardingStatus } from '../controllers/passengerController.js';
// import { contactInfo } from '../controller/ContactController.js';


const router = express.Router();

router.get("/pickup-list/:packageNumber", getPickupList);
// router.post('/create', contactInfo);
router.post("/update-status", updateBoardingStatus);
export default router;
