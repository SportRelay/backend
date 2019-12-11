const User = require('../models/User');
const express = require('express')
const router = express.Router();
router.get("/", async (req, res) => {
  try{
    const allusers = await User.find();
    allusers.forEach(user => user.password = "");
    res.json({users:allusers});
   }catch(err){
     res.status(401).json({ message : "Somthing happned"})
   }
})
module.exports = router