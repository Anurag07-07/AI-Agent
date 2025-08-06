import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const dbConnect = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`Database Connected`);
  } catch (error) {
    console.log(`Database Not Connected`);
    console.error(error);
    process.exit(1)
  }
}

export default dbConnect