const _ = require('lodash')

const dummy = (blogs) => {
	if (blogs.length === 0) return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
	const favorite = blogs.reduce((prev, current) => {
		return (prev.likes > current.likes) ? prev : current
	})
	return {
		title: favorite.title,
		author: favorite.author,
		likes: favorite.likes
	}
}

const mostBlogs = (blogs) => {
	const blogsAuthor = blogs.map(blogs => blogs.author)

	let mode =
        _.chain(blogsAuthor).countBy().entries().maxBy(_.last).thru(_.head).value()

	let count = 0

	blogsAuthor.forEach(element => {
		if (element === mode) {
			count ++
		}
	})

	return {
		author: mode,
		blogs: count,
	}
}

const mostLikes = (blogs) => {
	const groupedBlogs = _.groupBy(blogs, 'author')
	const countedAuthors = _.map(groupedBlogs, (arr) => {
		return {
			author: arr[0].author,
			likes: _.sumBy(arr, 'likes'),
		}

	})
	const maxLikesAuthor = _.maxBy(countedAuthors, (a) => a.likes)
	const authorName = _.head(_.values(maxLikesAuthor))

	return {
		author: authorName,
		likes: maxLikesAuthor.likes
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}