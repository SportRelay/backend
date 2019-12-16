const Post = require('../models/Post');
const User = require('../models/User');
const express = require('express')
const router = express.Router();
const getUserId = require("../auth/utils");
const passport = require('passport');
const passportHelper = require('../helper/passport')


router.get("/", async (req, res) => {
  try{
    const posts = await Post.find();
    res.status(200).json({posts: posts});
   }catch(err){
     res.status(401).json({ message : "Site has no posts..."})
   }
})

router.post("/", async (req, res) => {
	passport.authenticate('jwt', {session: false}, async (err, user, info)=>{
	  if(err){ return res.status(400).json({ message: err }) }

      if(info !== undefined){
        return res.json({ message: info.message })
      }else{
		try{
			const userId = getUserId(req);
			
			let newPost = new Post({
				title: req.body.title,
				body: req.body.body,
				user_id: userId,
				comment: []
			});

			const user = await User.update({ _id: userId },{ $push: {posts: newPost._id}});
			if(!user.nModified){
				res.status(404).json({message: "User not found"});
			}
			let savedPost = await newPost.save();

			res.status(201).json({post: savedPost});
		}catch(err){
			res.status(401).json({ message : err})

		}
	}
  })(req, res)
})
router.put("/comment/:postId", (req, res)  =>{
	passport.authenticate('jwt', {session: false}, async (err, user, info)=>{
	  if(err){ return res.status(400).json({ message: err }) }

      if(info !== undefined){
        return res.json({ message: info.message })
      }else{
		try{
			const userId = getUserId(req);
			const user = await User.findById(userId);
			const post = await Post.update({ _id: req.params.postId },{ $push: {comments: {username: user.username, comment: req.body.comment}}});
			if(!post.nModified){
				res.status(404).json({message: "post not found"});
			}
			res.status(201).json({message: user.username+"'s comment added"});
		}catch(err){
			res.status(401).json({ message : err})

		}
	}
  })(req, res)
})
module.exports = router