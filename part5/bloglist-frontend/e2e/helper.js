export const resetDb = async (request) => {
	await request.post('http://localhost:3001/api/testing/reset')
}

export const createUser = async (request, user) => {
	await request.post('http://localhost:3001/api/users', {
		data: user
	})
}

export const loginWith = async (page, username, password) => {
	await page.getByRole('button', { name: 'login' }).click()
	await page.getByLabel('username').fill(username)
	await page.getByLabel('password').fill(password)
	await page.getByRole('button', { name: 'login' }).click()
}

export const createBlog = async (page, blog) => {
	await page.getByRole('button', { name: 'create new blog' }).click()
	await page.getByLabel('title').fill(blog.title)
	await page.getByLabel('author').fill(blog.author)
	await page.getByLabel('url').fill(blog.url)
	await page.getByRole('button', { name: 'create' }).click()
	await page.getByText(`${blog.title} ${blog.author}`).waitFor()
}

export const createBlogViaApi = async (request, token, blog) => {
	await request.post('http://localhost:3001/api/blogs', {
		data: blog,
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
}

export const loginViaApi = async (request, credentials) => {
	const response = await request.post('http://localhost:3001/api/login', {
		data: credentials
	})

	return await response.json()
}

export const openBlogDetails = async (page, title) => {
	const blog = page.locator('.blog').filter({ hasText: title })
	await blog.getByRole('button', { name: 'view' }).click()
	return blog
}
