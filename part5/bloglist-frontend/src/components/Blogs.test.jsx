import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Blog } from './Blogs'
import BlogCreate from './BlogCreate'

vi.mock('../services/blogs', () => ({
	default: {
		create: vi.fn(async (blog) => ({ ...blog, id: 'created-id', user: { username: 'test', name: 'Test' } }))
	}
}))

describe('Blog component', () => {
    it('renders title and author only by default', async () => {
        const blog = {
            title: 'Test title',
            author: 'Test author',
            url: 'http://url',
            likes: 10,
            user: { name: 'Test user' }
        }
        const mockLike = vi.fn()
        const { container } = render(
            <Blog blog={blog} onLike={mockLike} onRemove={() => { }} canRemove={false} />
        )

        expect(container.querySelector('.blogTitleAuthor')).toHaveTextContent('Test title Test author')
        expect(screen.queryByText('http://url')).not.toBeInTheDocument()
        expect(screen.queryByText(/likes\s*10/)).not.toBeInTheDocument()
    })

    it('shows url and likes after clicking view', async () => {
        const blog = {
            title: 'Test title',
            author: 'Test author',
            url: 'http://url',
            likes: 10,
            user: { name: 'Test user' }
        }
        const mockLike = vi.fn()
        render(<Blog blog={blog} onLike={mockLike} onRemove={() => { }} canRemove={false} />)

        await userEvent.click(screen.getByText('view'))
        expect(screen.getByText('http://url')).toBeInTheDocument()
        expect(screen.getByText(/likes 10/)).toBeInTheDocument()
    })

    it('calls onLike twice when like button clicked twice', async () => {
        const blog = {
            title: 'Test title',
            author: 'Test author',
            url: 'http://url',
            likes: 10,
            user: { name: 'Test user' }
        }
        const mockLike = vi.fn()
        render(<Blog blog={blog} onLike={mockLike} onRemove={() => { }} canRemove={false} />)

        await userEvent.click(screen.getByText('view'))
        const likeButton = screen.getByText('like')
        await userEvent.click(likeButton)
        await userEvent.click(likeButton)

        expect(mockLike).toHaveBeenCalledTimes(2)
    })
})

describe('BlogCreate component', () => {
    it('calls onCreate with correct values when a new blog is created', async () => {
        const onCreate = vi.fn()
        const setBlogs = vi.fn()
        render(<BlogCreate setBlogs={setBlogs} setUser={() => { }} notify={() => { }} onCreated={() => { }} onCreate={onCreate} user={{ username: 'test', name: 'Test' }} />)

        await userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'New blog title')
        await userEvent.type(screen.getByRole('textbox', { name: /author/i }), 'Author Name')
        await userEvent.type(screen.getByRole('textbox', { name: /url/i }), 'http://new-blog.com')

        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: /create/i }))
        })

        expect(onCreate).toHaveBeenCalledTimes(1)
        expect(onCreate).toHaveBeenCalledWith({
            title: 'New blog title',
            author: 'Author Name',
            url: 'http://new-blog.com'
        })
    })
})
