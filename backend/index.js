import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dbConnect from './db/dbConnect.js'
dotenv.config()
import userRoute from './routes/user.js'

const app = express()

//Body Parser
app.use(express.json())
app.use('api/auth',userRoute)

//Cors
app.use(cors())

//Database Connected
dbConnect()


//PORT
const PORT = process.env.PORT || 3000

//Server Listen
app.listen(PORT,()=>{
  console.log(`Server started at PORT ${PORT}`);
})
