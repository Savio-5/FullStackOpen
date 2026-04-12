const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models/userModel')
const { SECRET } = require('../utils/config')

router.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET, {
        expiresIn: 60 * 60
    })

    res.status(200).send({ token, username: user.username, name: user.name, id: user.id })
})

module.exports = router