const router = require('express').Router()

const { Blog } = require('../models/blogModel')

const logger = require('../utils/logger')

router.get('/blogs', (req, res) => {
	Blog
		.find({})
		.then(blogs => {
			res.json(blogs)
		}).catch(error => {
			logger.error(error)
		})
})

router.post('/blogs', (req, res) => {
	const blog = new Blog(req.body)

	blog
		.save()
		.then(result => {
			res.status(201).json(result)
		}).catch(error => {
			logger.error(error)
		})
})

module.exports = router