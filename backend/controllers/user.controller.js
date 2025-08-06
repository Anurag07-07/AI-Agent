import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { inngest } from '../inngest/client.js'

export const Signup = async(req,res)=>{
  const {email,password,skills=[]} = req.body
  try {
    //Hash the password
    const salt = bcrypt.genSalt()
    const hashedPasssword = bcrypt.hash(password,salt)

    await User.create({email,password:hashedPasssword,skills})

    //Fire Inngest Event
    await inngest.send({
      name:"user/signup",
      data:{
        email
      }
    })

    const token = jwt.sign({
      _id:user._id,role:user.role
    },process.env.JWT_SECRET)

    res.status(200).json({
      user,token
    })
    
  } catch (error) {
    res.status(500).json({
      message:`Internal Server error ${error.message}`
    })
  }
}

export const Signin = async(req,res)=>{
  const {email,password} = req.body

  try {
     const user =  await User.findOne({email})
    if (!user) {
      return res.status(404).json({
        error:"User not found"
      })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
      return res.status(401).json({
        message:`Invalid Credentials`
      })
    }

     const token = jwt.sign({
      _id:user._id,role:user.role
    },process.env.JWT_SECRET)

    res.status(200).json({
      user,token
    })

  } catch (error) {
    res.status(500).json({
      message:`Login failed ${error.message}`
    })
  }
}

export const Logout = async(req,res)=>{
  try {
    const token =  req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).json({
        error:`Unauthorized`
      })
    }

      jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if (err) {
          return res.status(401).json({
            message:`Unauthorized`
          })
          res.status(200).json({
            message:`Logout Successfully`
          })
        }
      })
    
  } catch (error) {
    res.status(500).json({
      message:`Login failed ${error.message}`
    })
  }
}

export const updateUser = async(req,res)=>{
  const {skills=[],role,email}  = req.body
  try {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      error:`Forbidden`
    })
  }

  const user = await User.findOne({email})
  if (!user) {
    return res.status(401).json({
      error:"User Not Found"
    })
  }

  await User.updateOne(
    {email},  //Update on the the basis of 
    {skills:skills.length ? skills : user.skills,role}) //What to update

    return res.json({message:"User updated successfully"})
  }
  catch (error) {
     res.status(500).json({
      message:`Update failed ${error.message}`
    })   
  }
}

export const getUser = async(req,res)=>{
  try {
    if (req.user.role!=="admin") {
      return res.status(403).json({
        error:`Forbidden`
      })
    }

    const users = await User.find()
    return res.json({
      users
    })
  } catch (error) {
      res.status(403).json({
        error:`Update failed ${error.message}`
      }) 
  }
}