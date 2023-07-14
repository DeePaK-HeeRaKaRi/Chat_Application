const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique: true },
  password: { type: String, required: true },
  picture: {
    type: String,
    // default:
    //   "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
},{timeStamps:true});

// means before saving to the db it is encrypt the password
userSchema.pre('save',async function(next){
  // if current password is not modified move to next
  if(!this.isModified){
    next()
  }
  // else generate new password
  // higher the number the password will be strong
  const salt = await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
})


userSchema.methods.matchPassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}
const User=mongoose.model("User",userSchema)
module.exports=User