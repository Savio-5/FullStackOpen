const router = require('express').Router()

const { Blog } = require('../models/blogModel')
const { User } = require('../models/userModel')

const logger = require('../utils/logger').default

router.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate(
        'user',
        { username: 1, name: 1 }
    )
    res.status(200).json(blogs)
})

router.post('/', async (req, res) => {
    const { title, url, author, likes } = req.body

    if (req.user == null) {
        return res.status(401).json({ error: 'invalid or missing token' })
    }

    if (!title || !url) {
        return res.status(400).json({ error: 'title and url are required' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
        return res.status(400).json({ error: 'No users found in database' })
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes ?? 0,
        user: req.user
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save({ validateModifiedOnly: true })
    res.status(201).json(savedBlog)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    if (req.user == null) {
        return res.status(401).json({ error: 'invalid or missing token' })
    }

    const blog = await Blog.findById(id)

    if (blog?.user?.toString() === req.user?.id.toString()) {
        await Blog.findByIdAndDelete(id)

        const user = await User.findById(req.user.id)
        user.blogs = user.blogs.filter(
            blogId => blogId.toString() !== req.params.id
        )
        await user.save()

        res.status(204).end()
    }
    else {
        res.status(401).json({ error: 'unauthorized access' })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params

    if (req.user == null) {
        return res.status(401).json({ error: 'invalid or missing token' })
    }

    const blogSelected = await Blog.findById(id)

    if (!blogSelected) {
        return res.status(404).json({ error: 'This blog does not exist' })
    }

    if (blogSelected.user?.toString() === req.user?.id.toString()) {
        var result = await Blog.findByIdAndUpdate(
            id, req.body,
            { new: true, runValidators: true, context: 'query' }
        ).populate('user', { username: 1, name: 1 })
        res.status(200).json(result)
    } else {
        res.status(401).json({ error: 'This user cannot modify this blog' })
    }
})

module.exports = router