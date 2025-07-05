const mongoose = require('mongoose')
const { MONGODB_URL } = require('../utils/config')
const logger = require('../utils/logger').default

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: {
		type: Number,
		default: 0
	}
})

blogSchema.set('toJSON', {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URL)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

module.exports = { Blog }