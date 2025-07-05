const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listBlogs } = require('./test_helper.test')

describe('favorite blog', () => {

	test('The blog has the most likes', () => {
		const result = listHelper.favoriteBlog(listBlogs)
		assert.deepStrictEqual(result, {
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12
		})
	})
})