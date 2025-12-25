const router = require('express').Router()

const { Blog } = require('../models/blogModel')

const logger = require('../utils/logger').default

router.get('/blogs', async (req, res) => {
	try {
		const blogs = await Blog.find({})
		res.status(200).json(blogs)
	} catch (error) {
		logger.error(error)
		res.status(500).send({ error: 'Something went wrong' })
	}
})

router.post('/blogs', async (req, res) => {
    const { title, url } = req.body

    if (!title || !url) {
        return res.status(400).json({ error: 'title and url are required' })
    }

    try {
        const blog = new Blog(req.body)
        const result = await blog.save()
        res.status(201).json(result)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'something went wrong' })
    }
})

router.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: 'blog not found' })
        }
        res.status(204).end()
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'something went wrong' })
    }
})

router.put('/blogs/:id', async (req, res) => {
    const { id } = req.params
    const { likes } = req.body

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { likes },
            { new: true, runValidators: true, context: 'query'  }
        )
        if (!updatedBlog) {
            return res.status(404).json({ error: 'blog not found' })
        }
        res.json(updatedBlog)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'something went wrong' })
    }
})

module.exports = router