const mongoose = require('mongoose')
const { MONGODB_URL } = require('../utils/config')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})
  
const Blog = mongoose.model('Blog', blogSchema)

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URL)

module.exports = { Blog }