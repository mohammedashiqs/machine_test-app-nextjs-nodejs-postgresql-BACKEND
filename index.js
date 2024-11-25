import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client"; 
import cors from 'cors';

import userRoutes from './routes/usersRoutes.js'
import bookRoutes from './routes/booksRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT;

app.use(
    cors({
    origin: [process.env.PUBLIC_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);


app.use(express.json())

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the Book Review App API!");
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewsRoutes);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);    
})