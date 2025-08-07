import dotenv from 'dotenv';
dotenv.config(); 
import { Inngest } from 'inngest';

export const inngest = new Inngest({ 
  id: "ticketing-system", 
  name: "Myapp", 
  eventKey: process.env.INNGEST_EVENT_KEY 
});

console.log("INNGEST_EVENT_KEY:", `${process.env.INNGEST_EVENT_KEY}`);