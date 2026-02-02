import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ message: null, type: null })

  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    })()
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem('bloglist-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('bloglist-user')
    setUser(null)
  }

  const notify = (msg, type) => {
    setMessage({ message: msg, type })
    setTimeout(() => setMessage({ message: null, type: null }), 5000)
  }

  return (
    <>
      <Notification message={message?.message} type={message?.type} />
      {user
        ? <Blogs blogs={blogs} onLogout={handleLogout} user={user} setBlogs={setBlogs} setUser={setUser} notify={notify} />
        : <LoginForm onLogin={handleLogin} />}
    </>
  )
}

export default App