const router = require('express').Router()

const { Blog } = require('../models/blogModel')

router.get('/blogs', (req, res) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
})

router.post('/blogs', (req, res) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
})

module.exports = router;