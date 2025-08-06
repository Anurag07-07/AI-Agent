import mongoose from "mongoose";

const User = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    select:false
  },
  role:{
    type:String,
    default:"user",
    enum:["user","moderator","admin"]
  },
  skills:[String],
  createdAt:{
    type:Date,
    default:Date.now()
  }
})

export default mongoose.model('User',User)