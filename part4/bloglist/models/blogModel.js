const mongoose = require('mongoose')
const { MONGODB_URL } = require('../utils/config')
const logger = require('../utils/logger')

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
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