import express from 'express';
const router = express.Router();
import {
  createService,
  getServices,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Define Routes ---

// Create a new service (Admin Only)
router.post('/', protect, admin, createService);

// Get all services (Any logged-in user can see)
router.get('/', protect, getServices);

// Update a service (Admin Only)
router.put('/:id', protect, admin, updateService);

// Delete a service (Admin Only)
router.delete('/:id', protect, admin, deleteService);

export default router;