import express from 'express';
import { adminCreate, adminLogin, checkAdmin, dashboardData } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/verifyAdminToke.js';



const router = express.Router();

router.post('/create', adminCreate);
router.get("/check-admin",verifyToken,checkAdmin)
router.post('/login', adminLogin);

router.get('/data', dashboardData);

export default router;
