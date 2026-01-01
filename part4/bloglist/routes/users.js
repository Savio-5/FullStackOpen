const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User } = require('../models/userModel')

const logger = require('../utils/logger').default

router.post('/', async (req, res) => {
    const { username, password, name } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' })
    }
    if (username.length < 3 || password.length < 3) {
        return res.status(400).json({ error: 'username and password must be at least 3 characters long' })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return res.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        passwordHash: passwordHash
    })

    const result = await user.save()
    res.status(201).json(result)
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
        res.status(200).json(users)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'something went wrong' })
    }
})

module.exports = router