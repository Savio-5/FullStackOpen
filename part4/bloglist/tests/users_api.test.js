const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { User } = require('../models/userModel')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
})

describe('User creation', () => {
    test('fails if username is missing', async () => {
        const newUser = { password: 'secret', name: 'No Username' }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
        assert.ok(response.body.error.includes('username and password are required'))
    })

    test('fails if password is missing', async () => {
        const newUser = { username: 'nouser', name: 'No Password' }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
        assert.ok(response.body.error.includes('username and password are required'))
    })

    test('fails if username is too short', async () => {
        const newUser = { username: 'ab', password: 'secret', name: 'Short Username' }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
        assert.ok(response.body.error.includes('at least 3 characters'))
    })

    test('fails if password is too short', async () => {
        const newUser = { username: 'validuser', password: '12', name: 'Short Password' }
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
        assert.ok(response.body.error.includes('at least 3 characters'))
    })

    test('fails if username is not unique', async () => {
        const newUser = { username: 'uniqueuser', password: 'secret', name: 'First' }
        await api.post('/api/users').send(newUser)
        const response = await api.post('/api/users').send(newUser)
        assert.strictEqual(response.status, 400)
        assert.ok(response.body.error.includes('unique'))
    })
})

after(async () => {
    await mongoose.connection.close()
    process.exit(0)
})