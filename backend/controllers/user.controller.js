import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { inngest } from '../inngest/client.js'
import { onUserSignup } from '../inngest/functions/on-signup.js'

export const Signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  
  try {
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user and store the result
    const user = await User.create({ email, password: hashedPassword, skills });

    // Fire Inngest Event
    await inngest.send({
      name: "user/signup",
      data: { email }
    });

    // Generate token
    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({ user, token });

  } catch (error) {
    res.status(500).json({
      message: `Internal Server error ${error.message}`
    });
  }
}

export const Signin = async(req,res)=>{
  const {email,password} = req.body
  
  try {
    //Check if user is present or not
     const user =  await User.findOne({email}).select('+password')
    if (!user) {
      return res.status(404).json({
        error:"User not found"
      })
    }

    //Validate the password
    const isMatch = await bcrypt.compare(password,user.password)

    //If password Not Match
    if (!isMatch) {
      return res.status(401).json({
        message:`Invalid Credentials`
      })
    }

    //Generaet The Token
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

export const Logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      // Optional: If you use a token blacklist, add the token here

      return res.status(200).json({
        message: "Logout Successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: `Logout failed: ${error.message}`,
    });
  }
};


//Update the User 
export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;

  try {
    //Only change if the user is admin or not
    //as admin only update the user data 
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    const updateFields = {
      skills: skills.length ? skills : user.skills,
    };

    if (role) {
      updateFields.role = role;
    }

    await User.updateOne({ email }, updateFields);

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Update failed: ${error.message}`,
    });
  }
};

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