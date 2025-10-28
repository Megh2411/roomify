import express from 'express';
const router = express.Router();
import {
  checkInGuest,
  checkOutGuest,
} from '../controllers/receptionController.js';
import { protect } from '../middleware/authMiddleware.js';

// Middleware to check for Staff (Receptionist or Admin)
const staff = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'Admin' || req.user.role === 'Receptionist')
  ) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as staff' });
  }
};

router.post('/checkin', protect, staff, checkInGuest);
router.post('/checkout', protect, staff, checkOutGuest);

export default router;