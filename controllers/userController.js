import prisma from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  console.log('req.body', req.body);
  const { name, email, password, role  } = req.body;


  // Check if email already exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Validate role if it's provided
  if (role && role !== 'user' && role !== 'admin') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Ensure only admins can assign the admin role
  const userRole = role || 'user'; // Default to 'user' if no role is provided


  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole, // Set role as 'user' or 'admin'
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};




export const updateRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
    });

    res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

