import React, { useState, useEffect, useRef } from 'react'

import Login from './components/Login'
import Blog from './components/Blog'
import BlogCreator from './components/BlogCreator'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState('')

  const setupNotification = (message, isError) => {
    setIsError(isError)
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const sortBlogsByLikes = (blogs) => {
    // copy first to avoid mutating state directly
    return [...blogs].sort((x, y) => y.likes - x.likes)
  }

  useEffect(() => {
    if (!user) { return  }
    try {
      blogService
        .getAll()
        .then(blogs => setBlogs(sortBlogsByLikes(blogs)))
        .catch(err => { throw err })
    } catch (ex) {
      setupNotification(ex.response.data.error, true)
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const retUser = JSON.parse(loggedUserJSON)
      setUser(retUser)
      blogService.setToken(retUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const retUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(retUser))
      blogService.setToken(retUser.token)

      setUsername('')
      setPassword('')
      setUser(retUser)

      setupNotification('logged in successfully', false)
    } catch (ex) {
      setupNotification(ex.response.data.error, true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    setupNotification('logged out', false)
    setUser(null)
  }

  // used to reference Togglable parent of the BlogCreator
  const newBlogFormRef = useRef()

  const createBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat({
        ...response,
        user: { username: user.username } // for rendering and allowing deletion
      }))
      setupNotification('blog created successfully', false)
      newBlogFormRef.current.toggleVisibility()
    } catch (ex) {
      setupNotification(ex.response.data.error, true)
    }
  }

  const updateBlog = async (blog) => {
    try {
      const response = await blogService.update(blog)
      setBlogs(sortBlogsByLikes(blogs.map(b => b.id === response.id ? { ...b, likes: response.likes } : b)))
    } catch (ex) {
      setupNotification(ex.response.data.error, true)
    }
  }

  const deleteBlog = async blogId => {
    try {
      await blogService.deleteBlog(blogId)
      setBlogs(blogs.filter(b => b.id !== blogId))
    } catch (ex) {
      setupNotification(ex.response.data.error, true)
    }
  }

  if (!user) {
    return (
      <div>
        {message && <Notification message={message} isError={isError} />}
        <form onSubmit={handleLogin}>
          <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </form>
      </div>
    )
  } else {
    return (
      <div>
        {message && <Notification message={message} isError={isError} />}
        <h2>blogs</h2>
        <p>{user.username} is logged in
          <button onClick={handleLogout}>
              logout
          </button>
        </p>
        <Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
          <BlogCreator createBlog={createBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} username={user.username} deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }
}

export default App