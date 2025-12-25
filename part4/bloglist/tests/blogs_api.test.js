const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert/strict')
const app = require('../app')

const api = supertest(app)

const { Blog } = require('../models/blogModel')
const { listBlogs } = require('./test_helper.test')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listBlogs)
})

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as JSON and contain the correct amount', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, listBlogs.length)
    })

    test('blog posts have an id property', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert.notStrictEqual(blog.id, undefined)
            assert.notStrictEqual(blog.id, null)
        })
    })

    test('a valid blog can be added', async () => {
        const newBlog = { title: 'New Blog', author: 'John Doe', url: 'https://example.com/new', likes: 10 }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, listBlogs.length + 1)
        assert.ok(response.body.map(b => b.title).includes('New Blog'))
    })

    test('if likes property is missing, it defaults to 0', async () => {
        const newBlog = { title: 'No Likes Blog', author: 'Jane Doe', url: 'https://example.com/no-likes' }

        const response = await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title or url is not added', async () => {
        await api.post('/api/blogs').send({ author: 'Unknown', url: 'https://example.com' }).expect(400)
        await api.post('/api/blogs').send({ title: 'Missing URL', author: 'Unknown' }).expect(400)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, listBlogs.length)
    })
})

describe('deletion and updating of blogs', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

        const blogsAtEnd = await api.get('/api/blogs')
        assert.strictEqual(blogsAtEnd.body.length, listBlogs.length - 1)

        const titles = blogsAtEnd.body.map(b => b.title)
        assert.ok(!titles.includes(blogToDelete.title))
    })

    test('deleting a non-existent blog returns 404', async () => {
        const nonExistentId = '5a422bc61b54a676234d17fd'

        await api.delete(`/api/blogs/${nonExistentId}`).expect(404)
    })

    test('a blog can be updated', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]

        const updatedLikes = blogToUpdate.likes + 1

        const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
            .send({ likes: updatedLikes })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, updatedLikes)
        assert.strictEqual(response.body.title, blogToUpdate.title)
    })

    test('updating a non-existent blog returns 404', async () => {
        const nonExistentId = '5a422bc61b54a676234d17fd'

        await api.put(`/api/blogs/${nonExistentId}`)
            .send({ likes: 100 })
            .expect(404)
    })
})

after(async () => {
    await mongoose.connection.close()
    process.exit(0)
})
