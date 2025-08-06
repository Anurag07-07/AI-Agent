import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dbConnect from './db/dbConnect.js'
dotenv.config()


const app = express()

//Body Parser
app.use(express.json())

//Cors
app.use(cors())

//Database Connected
dbConnect()


//PORT
const PORT = process.env.PORT || 3000

//Server Listen
app.listen(PORT,()=>{
  console.log(`Server started ate PORT ${PORT}`);
})
