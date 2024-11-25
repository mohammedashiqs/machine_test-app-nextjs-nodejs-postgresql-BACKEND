// createAdmin.js
import prisma from '../models/index'  // Assuming your Prisma client is initialized here
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('adminpassword', 10); // Use a secure password
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',  // Assign admin role
      },
    });

    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdmin();