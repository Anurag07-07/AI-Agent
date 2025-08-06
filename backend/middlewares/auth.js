import jwt from 'jsonwebtoken'

export const auth = (req,res,next)=>{
  const token = req.headers.authorization.split(" ")[1]
  if (!token) {
    return res.status(401).json({
      error:"Access Denied"
    })
  }

  const decoded = jwt.verify(token,process.env.JWT_SECRET)

  req.user = decoded
  next()
  try {
    
  } catch (error) {
    res.status(401).json({
      error:`Invlaid Token`
    })
  }
}