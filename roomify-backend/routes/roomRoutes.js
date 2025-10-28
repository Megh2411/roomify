import express from 'express';
const router = express.Router();
import { createRoom, getRooms } from '../controllers/roomController.js';

// We'll create 'protect' and 'admin' middleware next
import { protect, admin } from '../middleware/authMiddleware.js'; 

// --- Define Routes ---
// POST /api/rooms - Only an Admin can create a room
router.post('/', protect, admin, createRoom);

// GET /api/rooms - Any logged-in user can see rooms
router.get('/', protect, getRooms); 

export default router;