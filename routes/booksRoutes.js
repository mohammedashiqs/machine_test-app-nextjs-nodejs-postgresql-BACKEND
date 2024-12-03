import express from 'express';
import { addBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/bookController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const router = express.Router();

router.post('/add', authenticate, /* checkRole('admin'), */ addBook); // Protect this route with authentication middleware
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/edit/:id', authenticate, updateBook);
router.delete('/delete/:id', authenticate, checkRole('admin'), deleteBook);

export default router;
