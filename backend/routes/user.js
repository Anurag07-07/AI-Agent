import express from 'express'
import { getUser, Logout, Signin, Signup, updateUser } from '../controllers/user.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/update-user',auth,updateUser)
router.post('/users',auth,getUser)

router.post('/signup',Signup)
router.post('/signin',Signin)
router.post('/logout',Logout)




export default router