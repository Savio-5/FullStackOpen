const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listBlogs } = require('./test_helper.test')

describe('most blogs ', () => {

	test('who has the largest amount of blogs', () => {
		const result = listHelper.mostBlogs(listBlogs)
		assert.deepStrictEqual(result, {
			author: 'Robert C. Martin',
			blogs: 3
		})
	})
})