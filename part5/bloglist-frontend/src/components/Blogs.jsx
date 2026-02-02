import BlogCreate from './BlogCreate'

const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
)

const Blogs = ({ blogs, user, onLogout, setBlogs, setUser, notify }) => (
  <div>
    <h2>blogs</h2>
    <p>
      {user.name} logged in
      <button onClick={onLogout}>logout</button>
    </p>

    <BlogCreate setBlogs={setBlogs} setUser={setUser} notify={notify} />

    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)

export default Blogs
