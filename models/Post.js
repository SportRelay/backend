const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
	title: { type: String, required: true},
	body: {type: String, required: true},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	comments: [{type: String}]
},{timestamps : true})

module.exports = Post = mongoose.model('Post', PostSchema)