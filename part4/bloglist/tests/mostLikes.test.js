const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listBlogs } = require('./test_helper.test')

describe('most likes ', () => {
	test('who has the largest amount of likes', () => {
		const result = listHelper.mostLikes(listBlogs)
		assert.deepStrictEqual(result, {
			author: 'Edsger W. Dijkstra',
			likes: 17
		})
	})
})