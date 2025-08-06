import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { inngest } from '../inngest/client'

export const Signup = async(req,res)=>{
  try {
    
  } catch (error) {
    res.status(500).json({
      message:`Internal Server error`
    })
  }
}