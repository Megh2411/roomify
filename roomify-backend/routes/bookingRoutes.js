import express from 'express';
const router = express.Router();
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  getBookingById // <-- IMPORTED
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// GET /api/bookings - Admin gets all bookings
router.get('/', protect, admin, getAllBookings);

// POST /api/bookings - Any logged-in user can create a booking
router.post('/', protect, createBooking);

// GET /api/bookings/mybookings - Any logged-in user can see their own bookings
router.get('/mybookings', protect, getMyBookings);

// --- ADDED ROUTE ---
// GET /api/bookings/:id - Staff/Owner get booking details by ID
router.get('/:id', protect, getBookingById);
// --------------------

// PUT /api/bookings/:id/cancel - User who owns it OR an admin/receptionist can cancel
router.put('/:id/cancel', protect, cancelBooking);


export default router;