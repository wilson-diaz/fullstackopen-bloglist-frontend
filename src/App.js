import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Login from './components/Login'
import Blog from './components/Blog'
import BlogCreator from './components/BlogCreator'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUserFromLocalStorage, logoutUser } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const state = useSelector(state => state)

  useEffect(() => {
    if (!state.user) { return  }
    try {
      dispatch(initializeBlogs())
    } catch (ex) {
      dispatch(setNotification(ex.response.data.error, true, 10))
    }
  }, [state.user, dispatch])

  useEffect(() => {
    dispatch(setUserFromLocalStorage())
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setNotification('logged out', false, 10))
  }

  // used to reference Togglable parent of the BlogCreator
  const newBlogFormRef = useRef()
  const toggleVisibility = () => {
    newBlogFormRef.current.toggleVisibility()
  }

  if (!state.user) {
    return (
      <div>
        {state.notification.message && <Notification />}
        <Login />
      </div>
    )
  }

  return (
    <div>
      {state.notification.message && <Notification />}
      <h2>blogs</h2>
      <p>{state.user.username} is logged in
        <button onClick={handleLogout}>
              logout
        </button>
      </p>
      <Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
        <BlogCreator username={state.user.username} toggleVisibility={toggleVisibility} />
      </Togglable>
      {state.blogs.map(blog =>
        <Blog key={blog.id} blog={blog} username={state.user.username} />
      )}
    </div>
  )
}

export default App