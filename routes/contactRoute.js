import express from 'express';
import { createMessage, getAllMessage } from '../controllers/contactController.js';
// import { contactInfo } from '../controller/ContactController.js';


const router = express.Router();

router.post('/create', createMessage);
router.get("/",getAllMessage)

export default router;
