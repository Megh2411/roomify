import express from 'express';
const router = express.Router();
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public Routes
router.post('/', registerUser); 
router.post('/login', loginUser); 

// --- ADMIN ROUTES ---

// GET /api/users/all - Admin gets all users
router.get('/all', protect, admin, getAllUsers);

// PUT /api/users/:id/role - Admin updates a user's role
router.put('/:id/role', protect, admin, updateUserRole);

// DELETE /api/users/:id - Admin deletes a user
router.delete('/:id', protect, admin, deleteUser);

export default router;