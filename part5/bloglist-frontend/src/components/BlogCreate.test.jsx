import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import BlogCreate from './BlogCreate'

vi.mock('../services/blogs', () => ({
	default: {
		create: vi.fn((blog) =>
			Promise.resolve({ ...blog, id: 'abc123', user: 'test' })
		)
	}
}))

describe('BlogCreate form tests', () => {
	it('calls event handler with right details when a new blog is created', async () => {
		const mockSetBlogs = vi.fn()
		const mockSetUser = vi.fn()
		const mockNotify = vi.fn()
		const mockOnCreated = vi.fn()
		const mockOnCreate = vi.fn()

		render(
			<BlogCreate
				setBlogs={mockSetBlogs}
				setUser={mockSetUser}
				notify={mockNotify}
				onCreated={mockOnCreated}
				onCreate={mockOnCreate}
				user={{ username: 'test', name: 'Test User' }}
			/>
		)

		await userEvent.type(screen.getByLabelText('title'), 'New blog title')
		await userEvent.type(screen.getByLabelText('author'), 'New author')
		await userEvent.type(screen.getByLabelText('url'), 'http://new-blog-url')
		await act(async () => {
			await userEvent.click(screen.getByText('create'))
		})

		expect(mockOnCreate).toHaveBeenCalledTimes(1)
		expect(mockOnCreate).toHaveBeenCalledWith({
			title: 'New blog title',
			author: 'New author',
			url: 'http://new-blog-url'
		})
		expect(mockSetBlogs).toHaveBeenCalledTimes(1)
		expect(mockNotify).toHaveBeenCalledWith('a new blog New blog title by New author added', 'success')
	})
})
