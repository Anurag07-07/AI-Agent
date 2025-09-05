import bcrypt from 'bcrypt';
import dbConnect from './dbConnect.js';
import User from '../models/user.js'; // path to your User model
import dotenv from 'dotenv'
dotenv.config()

const seedAdmin = async () => {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(process.env.DB_ADMIN_PASSWORD, 10);

    // Create the admin
    const adminUser = new User({
      email: 'anurag07raj@gmail.com',
      password: hashedPassword,
      role: 'admin', // This must exist in your schema
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();