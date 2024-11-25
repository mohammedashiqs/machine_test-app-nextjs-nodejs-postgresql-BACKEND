import prisma from '../models/index.js';

// Add a new review
export const addReview = async (req, res) => {
  const { bookId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId; // Assuming `req.user` is set by authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Validate that the book exists
    const existingBook = await prisma.book.findUnique({
        where: { id: parseInt(bookId, 10) },
      });

      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found' });
      }

      
    const review = await prisma.review.create({
      data: {
        content,
        rating,
        userId,
        bookId: parseInt(bookId, 10),
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to add review' });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the review belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(reviewId, 10) },
    });

    if (!existingReview || existingReview.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(reviewId, 10) },
      data: { content, rating },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update review' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.userId;

  try {
    // Check if the review belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(reviewId, 10) },
    });

    if (!existingReview || existingReview.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    await prisma.review.delete({
      where: { id: parseInt(reviewId, 10) },
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete review' });
  }
};

// Get all reviews for a specific book
export const getReviewsByBookId = async (req, res) => {
  const { bookId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { bookId: parseInt(bookId, 10) },
      include: { user: true },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch reviews' });
  }
};
