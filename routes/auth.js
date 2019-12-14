/*
  @instructor Name:  Ebere.
  @program : WDI 4 Riyadh
*/

const User = require('../models/User');
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const passport = require('passport');
const dotenv = require("dotenv/config");
const getUserId = require("../auth/utils");
const passportHelper = require('../helper/passport')


router.get('/', (request, response, next) => {
  //custom jwt authenticate
  passport.authenticate('jwt', {session: false}, (err, user, info)=>{
      if(err){ return response.status(400).json({ message: err }) }

      if(info !== undefined){
        return response.json({ message: info.message })
      }else{
        User.find({})
        .then((user)=>{
          response.json({ user: user });
        })

      }

      
  })(request, response, next)

  
})

router.get("/allusers", async (req, res) => {
  try{
    const allusers = await User.find();
    allusers.forEach(user => user.password = "");
    res.json({users:allusers});
   }catch(err){
     res.status(401).json({ message : "Somthing happned"})

   }
})


router.post('/register', (request, response)=>{

  let data = {
    firstname: request.body.firstname,
    lastname: request.body.lastname, 
    username: request.body.username,
    password: request.body.password,
    email: request.body.email
  }

  let user = new User(data)
  
  user.save()
  .then(()=> {
    response.status(200).json({ message : "Registered Successfully" })
  })
  .catch(err =>{
    response.status(401).json({ message : "You are not Allowed to Register"})
  })

})

router.patch('/reset', async (request, response)=>{
  passport.authenticate('jwt', {session: false}, async (err, user, info)=>{
      if(err){ return response.status(400).json({ message: err }) }

      if(info !== undefined){
        return response.json({ message: info.message })
      }else{
        if(!user){
          response.status(200).json({ message : "User not found" })
        }
        await user.verifyPassword(request.body.password, user.password, async (err, res) => {
          if(err){
            response.status(401).json({ message : "Something happend"})
          }
          else if(!res){
            response.status(400).json({ message : "Wrong password" })
          }
          else{
                console.log(user, info, err)

            await user.verifyPassword(request.body.newPassword, user.password, async (err, res) => {
              user.password = request.body.newPassword;
              if(err){
                response.status(401).json({ message : "Something happend"})
              }
              else if(res){
                                console.log(user.password, request.body.password)

                response.status(400).json({ message : "Entered new password is the same as old password" })
              }
              else{
                try{
                  await user.save();
                  response.status(200).json({ message : "Password has been reset Successfully" })
                }catch{
                  response.status(401).json({ message : "Something happend"})
                }
              }
            })
          }
        })
      }
  })(request, response)


})

router.post('/login', (request, response) => {

  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
        return response.status(401).json({
            message: info ? info.message : 'Login failed',
            user   : user
        });

    }

   request.login(user, {session: false}, (err) => {
          if (err) {
              return response.status(401).json({message: err});
          }
          // generate a signed json web token with the contents of user object and return it in the response
          user.password = '' //remove password
          console.log(user,"login")
          const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET , { expiresIn: '1d' });
          return response.status(200).json({user, token});
        });
    })(request, response);
   
})


module.exports = router