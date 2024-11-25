import prisma from '../models/index.js';

// Add a new book
export const addBook = async (req, res) => {
  console.log('adding book');
  console.log(req.body)
  const { title, author, isbn, genre, coverUrl } = req.body;
  const userId = req.user?.userId; // Assuming `req.user` is set by authentication middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        genre,
        coverUrl,
        id: req.user.userId, // from authMiddleware
      },
    });

    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add the book" });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        reviews: true, // Include reviews for each book
      },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};


export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, genre, coverUrl } = req.body;

  try {
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, isbn, genre, coverUrl },
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};


export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await prisma.book.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};


// Get details of a single book by ID
export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the book by ID
    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(id), // Ensure the ID is an integer
      },
      include: {
        reviews: true, // Optionally include reviews associated with the book
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
