import React, { useState, useEffect } from 'react'

import Login from './components/Login'
import Blog from './components/Blog'
import BlogCreator from './components/BlogCreator'
import Notification from './components/Notification'

import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState('')

  const setupNotification = (message, isError) => {
    setIsError(isError)
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }
  
  useEffect(() => {
    if (!user) { return  }
    try {
      blogService
        .getAll()
        .then(blogs => setBlogs(blogs))
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

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      await blogService.create({ title, author, url })
      setupNotification('blog created successfully', false)
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
          <form onSubmit={handleCreate}>
            <BlogCreator title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} url={url} setUrl={setUrl} />
          </form>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
      </div>
    )
  }
}

export default App