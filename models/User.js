const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const saltRounds = 10

const userSchema = new Schema({
 email : { type: String, required: true, unique : true},
 username : { type: String, required: true, unique : true},
 password : { type: String, required: true},
 favorites : [{ type: String}]
},{timestamps : true})


userSchema.pre('save',function(next){
    let user = this

    if(user.password && user.isModified('password')){
        
      bcrypt.hash(user.password, saltRounds, (err, hash)=>{
        if(err){ return next()}

        user.password = hash
        next()
      })
    }

})


userSchema.methods.verifyPassword = (plainPassword, hashedPassword, cb) => {

 bcrypt.compare(plainPassword, hashedPassword, (err, response) => {
   if(err) { 
     return cb(err) 
   }
   return cb(null, response)
 })
}

const User = mongoose.model('User', userSchema)
module.exports = User