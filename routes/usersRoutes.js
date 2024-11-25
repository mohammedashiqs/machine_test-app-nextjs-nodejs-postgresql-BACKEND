import express from 'express';
import { signup, login, updateRole } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Route to update user role (only accessible by admins)
router.put('/update-role/:userId', authenticate, checkRole('admin'), updateRole);

export default router;
