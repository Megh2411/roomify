import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Get dashboard stats (Admin Only)
router.get('/stats', protect, admin, getDashboardStats);

export default router;