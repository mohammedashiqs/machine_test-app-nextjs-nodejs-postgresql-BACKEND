import express from 'express';
import {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByBookId,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/add/:bookId', authenticate, addReview);

router.put('/update/:reviewId', authenticate, updateReview);


router.delete('/delete/:reviewId', authenticate, deleteReview);

// Get all reviews for a specific book
router.get('/:bookId', getReviewsByBookId);

export default router;
