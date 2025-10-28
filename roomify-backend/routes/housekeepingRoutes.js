import express from 'express';
const router = express.Router();
import { updateRoomStatus } from '../controllers/housekeepingController.js';
import { protect } from '../middleware/authMiddleware.js';

// Middleware for Housekeeping or Admin
const housekeeping = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'Admin' || req.user.role === 'Housekeeping')
  ) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as housekeeping staff' });
  }
};

router.put('/rooms/:id/status', protect, housekeeping, updateRoomStatus);

export default router;