const User = require('../models/User');
const express = require('express')
const router = express.Router();
const getUserId = require("../auth/utils");

router.get("/favorites", async (req, res) => {
  try{
  	let userId = getUserId(req)
    const user = await User.findById(userId);
    res.status(200).json({favorites:user.favorites});
   }catch(err){
     res.status(401).json({ message : "User not found"})
   }
})


router.put('/favorites', async (req, res) => {
	if(!req.body.favorite){
		res.status(400).json({message: "Item sent is empty"});
	} 
	const userId = getUserId(req);
	const user = await User.update({ _id: userId },{ $set:{ favorites: req.body.favorite}}); //$push if need more then one favorite
	if(!user.nModified){
		res.status(404).json({message: "User not found"});
	}
	console.log(user)
	res.status(201).json({message: "added to favorites"});

});
module.exports = router