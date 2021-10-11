import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Login from './components/Login'
import Blog from './components/Blog'
import BlogCreator from './components/BlogCreator'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import loginService from './services/login'
import blogService from './services/blogs'

import { setNotification } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch()
  const state = useSelector(state => state)

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
      dispatch(setNotification(ex.response.data.error, true, 10))
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

      dispatch(setNotification('logged in successfully', false, 10))
    } catch (ex) {
      dispatch(setNotification(ex.response.data.error, true, 10))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    dispatch(setNotification('logged out', false, 10))
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
      dispatch(setNotification('blog created successfully', false, 10))
      newBlogFormRef.current.toggleVisibility()
    } catch (ex) {
      dispatch(setNotification(ex.response.data.error, true, 10))
    }
  }

  const updateBlog = async (blog) => {
    try {
      const response = await blogService.update(blog)
      setBlogs(sortBlogsByLikes(blogs.map(b => b.id === response.id ? { ...b, likes: response.likes } : b)))
    } catch (ex) {
      dispatch(setNotification(ex.response.data.error, true, 10))
    }
  }

  const deleteBlog = async blogId => {
    try {
      await blogService.deleteBlog(blogId)
      setBlogs(blogs.filter(b => b.id !== blogId))
    } catch (ex) {
      dispatch(setNotification(ex.response.data.error, true, 10))
    }
  }

  if (!user) {
    return (
      <div>
        {state.message && <Notification />}
        <form onSubmit={handleLogin}>
          <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </form>
      </div>
    )
  } else {
    return (
      <div>
        {state.message && <Notification />}
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