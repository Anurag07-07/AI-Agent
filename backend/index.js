import { inngest } from './inngest/client.js'
import { onUserSignup, } from './inngest/functions/on-signup.js';
import { onTicketCreated } from './inngest/functions/on-create-ticket.js';
import express from 'express'
import cors from 'cors'
import {serve} from 'inngest/express'
import dotenv from 'dotenv'
import dbConnect from './db/dbConnect.js'
dotenv.config()
import userRoute from './routes/user.js'
import ticketRoutes from './routes/ticket.js'
const app = express()

//Body Parser
app.use(express.json())
app.use('api/auth',userRoute)
app.use('api/tickets',ticketRoutes)

////Inngest Route Working Middleware
app.use(
  "api/inngest",
  serve({
    client:inngest,
    functions:[onUserSignup,onTicketCreated]
  })
)

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
