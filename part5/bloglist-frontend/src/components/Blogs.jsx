import { useRef, useState } from 'react'
import BlogCreate from './BlogCreate'
import Togglable from './Togglable'
import blogService from '../services/blogs'

export const Blog = ({ blog, onLike, onRemove, canRemove }) => {
	const [showDetails, setShowDetails] = useState(false)

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	return (
		<div style={blogStyle} className="blog">
			<div>
				<span className="blogTitleAuthor">{blog.title} {blog.author}</span>
				<button onClick={() => setShowDetails(prev => !prev)}>
					{showDetails ? 'hide' : 'view'}
				</button>
			</div>
			{showDetails && (
				<div className="blogDetails">
					<div className="blogUrl">{blog.url}</div>
					<div className="blogLikes">
						likes {blog.likes}
						<button onClick={() => onLike(blog)}>like</button>
					</div>
					<div>{blog.user?.name}</div>
					{canRemove && (
						<button onClick={() => onRemove(blog)}>remove</button>
					)}
				</div>
			)}
		</div>
	)
}

const Blogs = ({ blogs, user, onLogout, setBlogs, setUser, notify }) => {
	const blogFormRef = useRef()

	const handleCreateToggle = () => {
		blogFormRef.current?.toggleVisibility()
	}

	const handleLike = async (blog) => {
		const userId = blog.user?.id || blog.user?._id || blog.user
		const updatedPayload = {
			user: userId,
			likes: blog.likes + 1,
			author: blog.author,
			title: blog.title,
			url: blog.url
		}

		try {
			const updated = await blogService.update(blog.id, updatedPayload)
			const merged = {
				...updated,
				user: typeof updated.user === 'string' ? blog.user : updated.user
			}
			setBlogs(prev => prev.map(b => b.id === blog.id ? merged : b))
		} catch (error) {
			if (error.response?.status === 401) {
				notify('Session expired. Please login again.', 'error')
				setTimeout(() => {
					window.localStorage.removeItem('bloglist-user')
					setUser(null)
				}, 5000)
			} else {
				notify('Failed to like blog', 'error')
			}
		}
	}

	const handleRemove = async (blog) => {
		const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
		if (!confirmed) return

		try {
			await blogService.remove(blog.id)
			setBlogs(prev => prev.filter(b => b.id !== blog.id))
			notify(`Removed ${blog.title}`, 'success')
		} catch (error) {
			if (error.response?.status === 401) {
				notify('Session expired. Please login again.', 'error')
				setTimeout(() => {
					window.localStorage.removeItem('bloglist-user')
					setUser(null)
				}, 5000)
			} else {
				notify('Failed to remove blog', 'error')
			}
		}
	}

	const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

	return (
		<div>
			<h2>blogs</h2>
			<p>
				{user.name} logged in
				<button onClick={onLogout}>logout</button>
			</p>

			<Togglable buttonLabel="create new blog" ref={blogFormRef}>
				<BlogCreate
					setBlogs={setBlogs}
					setUser={setUser}
					notify={notify}
					onCreated={handleCreateToggle}
					user={user}
				/>
			</Togglable>

			{sortedBlogs.map(blog => (
				<Blog
					key={blog.id}
					blog={blog}
					onLike={handleLike}
					onRemove={handleRemove}
					canRemove={
						blog.user &&
						(blog.user.username === user.username ||
							blog.user.id === user.id ||
							blog.user._id === user.id)
					}
				/>
			))}
		</div>
	)
}

export default Blogs
