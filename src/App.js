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
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const state = useSelector(state => state)

  useEffect(() => {
    if (!user) { return  }
    try {
      dispatch(initializeBlogs())
    } catch (ex) {
      dispatch(setNotification(ex.response.data.error, true, 10))
    }
  }, [user, dispatch])

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
  const toggleVisibility = () => {
    newBlogFormRef.current.toggleVisibility()
  }

  if (!user) {
    return (
      <div>
        {state.notification.message && <Notification />}
        <form onSubmit={handleLogin}>
          <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </form>
      </div>
    )
  } else {
    return (
      <div>
        {state.notification.message && <Notification />}
        <h2>blogs</h2>
        <p>{user.username} is logged in
          <button onClick={handleLogout}>
              logout
          </button>
        </p>
        <Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
          <BlogCreator username={user.username} toggleVisibility={toggleVisibility} />
        </Togglable>
        {state.blogs.map(blog =>
          <Blog key={blog.id} blog={blog} username={user.username} />
        )}
      </div>
    )
  }
}

export default App