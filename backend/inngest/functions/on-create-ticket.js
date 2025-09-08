import { NonRetriableError } from "inngest";
import ticketModel from "../../models/ticket.model.js";
import { inngest } from "../client.js";
import analyzeTicket from "../../utils/ai.js";
import User from "../../models/user.js";
import { sendMail } from "../../utils/mailer.js";

//When Ticket is created
export const onTicketCreated = inngest.createFunction(
  {id:"on-ticket-create",retries:2},
  {event:'ticket/created'},async({event,step})=>{
    try {
      const {ticketId} = event.data

      const ticket = await step.run('fetch-ticket',async()=>{
        //Fetch the ticket from DB
      const ticketObject = await ticketModel.findById(ticketId)
      if (!ticket) {
        throw new NonRetriableError("Ticket not found")
      }
      return ticketObject
    })

    await step.run("update-ticket-status",async()=>{
      await ticketModel.findByIdAndUpdate(ticket._id,{
        status:"TODO"
      })
    })

    const aiResponse = await  analyzeTicket(ticket)

    const relatedskills = await step.run('ai-processing',async()=>{
      let skills = []
      if (aiResponse) {
        await ticketModel.findByIdAndUpdate(ticket._id,{
          priority:!["low","medium","high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
          helpfulNotes:aiResponse.helpfulNotes,
          status:"IN_PROGRESS",
          realtedSkills:aiResponse.realtedSkills
        })
        skills = aiResponse.realtedSkills
      }
      return skills  
    })
    
    const moderator = await step.run('assign-moderator',async()=>{
      let user = await User.findOne({
        role:'moderator',
        skills:{
          $elemMatch:{
            $regex:relatedskills.join("|"),
            $options:"i"
          }
        }
      })
      if (!user) {
        user = await User.findOne({
          role:"admin"
        })
      }

      await ticketModel.findByIdAndUpdate(ticket._id,{
        assignedTo:user?._id || null
      })

      return user
    })

    await step.run('send-email-notification',async()=>{
      if (moderator) {
        const finalTicket = await ticketModel.findById(ticket._id)
        await sendMail(moderator.email,"Ticket Assigned",`A new ticket is assigned to you ${finalTicket.title}`)
      }
    })

    return {success:true}
    } catch (error) {
      console.log(` Error running the step ${error.message}`);
      return {success:false}
    }
  }
)