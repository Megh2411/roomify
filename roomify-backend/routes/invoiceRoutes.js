import express from 'express';
const router = express.Router();
import {
  generateInvoice,
  recordPayment,
  getInvoiceById,
} from '../controllers/invoiceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// We need a 'receptionist' middleware or just use 'admin' for now
// For simplicity, we'll let Admin (or a custom role) handle this
// Let's create a 'staff' role check (Admin or Receptionist)

const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Receptionist')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as staff' });
  }
};

// Generate an invoice (Staff only)
router.post('/', protect, staff, generateInvoice);

// Get invoice details (Owner or Staff)
router.get('/:id', protect, getInvoiceById);

// Pay for an invoice (Staff only - records payment)
router.post('/:id/pay', protect, staff, recordPayment);

export default router;