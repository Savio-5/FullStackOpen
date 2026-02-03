import { useState } from 'react'
import blogService from '../services/blogs'

const BlogCreate = ({ setBlogs, setUser, notify, onCreated, user }) => {
  const [blog, setBlog] = useState({ title: '', author: '', url: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const created = await blogService.create(blog)
      const merged = {
        ...created,
        user: typeof created.user === 'string' ? user : created.user
      }

      setBlogs(prev => prev.concat(merged))
      setBlog({ title: '', author: '', url: '' })

      notify(`a new blog ${created.title} by ${created.author} added`, 'success')
      if (onCreated) {
        onCreated()
      }
    } catch (error) {
      if (error.response?.status === 401) {
        notify('Session expired. Please login again.', 'error')
        setTimeout(() => {
          window.localStorage.removeItem('bloglist-user')
          setUser(null)
        }, 5000)
      } else {
        notify('Failed to create blog', 'error')
      }
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title
            <input type="text" name="title" value={blog.title} onChange={({ target }) => setBlog({ ...blog, title: target.value })} />
          </label>
        </div>
        <div>
          <label>
            author
            <input type="text" name="author" value={blog.author} onChange={({ target }) => setBlog({ ...blog, author: target.value })} />
          </label>
        </div>
        <div>
          <label>
            url
            <input type="text" name="url" value={blog.url} onChange={({ target }) => setBlog({ ...blog, url: target.value })} />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogCreate