import { test, expect } from '@playwright/test'
import {
	createBlog,
	createBlogViaApi,
	createUser,
	loginViaApi,
	loginWith,
	openBlogDetails,
	resetDb
} from './helper.js'

const primaryUser = {
	name: 'Test User',
	username: 'testuser',
	password: 'LetsT3st'
}

const secondaryUser = {
	name: 'Second User',
	username: 'altuser',
	password: 'secret'
}

test.describe('Blog app', () => {
	test.beforeEach(async ({ page, request }) => {
		await resetDb(request)
		await createUser(request, primaryUser)
		await createUser(request, secondaryUser)
		await page.goto('/')
	})

	test('Login form is shown', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'log in to application' })).toBeVisible()
		await expect(page.getByLabel('username')).toBeVisible()
		await expect(page.getByLabel('password')).toBeVisible()
		await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
	})

	test.describe('Login', () => {
		test('succeeds with correct credentials', async ({ page }) => {
			await loginWith(page, primaryUser.username, primaryUser.password)
			await expect(page.getByText(`${primaryUser.name} logged in`)).toBeVisible()
		})

		test('fails with wrong credentials', async ({ page }) => {
			await loginWith(page, primaryUser.username, 'wrong-password')

			const errorDiv = page.locator('.error')
			await expect(errorDiv).toContainText('wrong username or password')
			await expect(page.getByText(`${primaryUser.name} logged in`)).not.toBeVisible()
		})
	})

	test.describe('When logged in', () => {
		test.beforeEach(async ({ page }) => {
			await loginWith(page, primaryUser.username, primaryUser.password)
		})

		test('a new blog can be created', async ({ page }) => {
			await createBlog(page, {
				title: 'E2E Blog',
				author: 'Playwright',
				url: 'https://example.com/e2e-blog'
			})

			await expect(page.getByText('E2E Blog Playwright')).toBeVisible()
		})

		test('a blog can be liked', async ({ page }) => {
			await createBlog(page, {
				title: 'Likeable Blog',
				author: 'Playwright',
				url: 'https://example.com/likeable-blog'
			})

			const blog = await openBlogDetails(page, 'Likeable Blog')
			await blog.getByRole('button', { name: 'like' }).click()
			await expect(blog.getByText('likes 1')).toBeVisible()
		})

		test('the author can delete a blog', async ({ page }) => {
			await createBlog(page, {
				title: 'Delete Me',
				author: 'Playwright',
				url: 'https://example.com/delete-me'
			})

			const blog = await openBlogDetails(page, 'Delete Me')

			page.on('dialog', async dialog => {
				await dialog.accept()
			})

			await blog.getByRole('button', { name: 'remove' }).click()
			await expect(page.getByText('Delete Me Playwright')).not.toBeVisible()
		})

		test('only the author can see the delete button', async ({ page }) => {
			await createBlog(page, {
				title: 'Private Delete',
				author: 'Playwright',
				url: 'https://example.com/private-delete'
			})

			await page.getByRole('button', { name: 'logout' }).click()
			await loginWith(page, secondaryUser.username, secondaryUser.password)

			const blog = await openBlogDetails(page, 'Private Delete')
			await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
		})

		test.describe('and several blogs exist', () => {
			test.beforeEach(async ({ request }) => {
				const { token } = await loginViaApi(request, {
					username: primaryUser.username,
					password: primaryUser.password
				})

				await createBlogViaApi(request, token, {
					title: 'Least liked',
					author: 'Playwright',
					url: 'https://example.com/least-liked',
					likes: 1
				})
				await createBlogViaApi(request, token, {
					title: 'Most liked',
					author: 'Playwright',
					url: 'https://example.com/most-liked',
					likes: 3
				})
				await createBlogViaApi(request, token, {
					title: 'Middle liked',
					author: 'Playwright',
					url: 'https://example.com/middle-liked',
					likes: 2
				})
			})

			test.beforeEach(async ({ page }) => {
				await page.reload()
			})

			test('blogs are arranged by likes', async ({ page }) => {
				const blogTitles = page.locator('.blogTitleAuthor')

				await expect(blogTitles).toHaveCount(3)
				await expect(blogTitles.nth(0)).toContainText('Most liked')
				await expect(blogTitles.nth(1)).toContainText('Middle liked')
				await expect(blogTitles.nth(2)).toContainText('Least liked')
			})
		})
	})
})
