const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()

const { PORT, MONGODB_URL }= require('./utils/config')
const { getTokenFrom, userExtractor, errorHandler } = require('./utils/middleware')
const logger = require('./utils/logger').default

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URL)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.json())

app.use(getTokenFrom)
app.use(userExtractor)

app.use('/api/blogs', require('./routes/blogs'))
app.use('/api/users', require('./routes/users'))
app.use('/api/login', require('./routes/login'))

app.use(errorHandler)

app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`)
})

module.exports = app