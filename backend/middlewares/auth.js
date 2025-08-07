import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; // _id and role available here

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};