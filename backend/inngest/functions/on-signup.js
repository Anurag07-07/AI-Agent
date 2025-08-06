import { inngest } from "../client";
import User from '../../models/user'
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer";

export const onUserSignup = inngest.createFunction(
  {id:"on-user-signup",retries:2},
  {event:"user/signup"},
  async({event,step})=>{
    try {
      const {email} = event.data //However envoking the event passed some data so we get email from it
      //Run Step Function to find the user in database
      const user = await step.run("get-user-email",async()=>{
          const userObject = await User.findOne({email})
          if (!userObject) {
            throw new NonRetriableError("User no longer exist in database")  //No Try Again
          }
          return userObject
      })

      await step.run("send-welcome-email",async()=>{
        const subject = `Welcome to the app`
        const message = `Hi,
        \n\n
        Thanks for signing up. We're glad to have you 
        onboard!
        `

        await sendMail(user.email,subject,message)
      })

      return {sucess:true}
    } catch (error) {
      console.log(`Error Running step ${error.message}`);
      return {sucess:false}
    }
  }
)