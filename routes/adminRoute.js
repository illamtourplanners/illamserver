import express from 'express';
import { adminCreate, adminLogin, checkAdmin } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/verifyAdminToke.js';



const router = express.Router();

router.post('/create', adminCreate);
router.get("/check-admin",verifyToken,checkAdmin)
router.post('/login', adminLogin);
export default router;
