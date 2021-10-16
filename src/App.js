import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'

import Login from './components/Login'
import Blog from './components/Blog'
import BlogCreator from './components/BlogCreator'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserList from './components/UserList'
import User from './components/User'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { setUserFromLocalStorage, logoutUser } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const state = useSelector(state => state)

  useEffect(() => {
    if (!state.user) { return  }
    try {
      dispatch(initializeBlogs())
      dispatch(initializeUsers())
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

  const match = useRouteMatch('/users/:id')
  const userToView = match
    ? state.users.find(user => user.id === match.params.id)
    : null

  const linkStyle = {
    padding: 5
  }

  return (
    <>
      {state.notification.message && <Notification />}
      <div>
        <Link style={linkStyle} to='/'>home</Link>
        <Link style={linkStyle} to='/blogs'>blogs</Link>
        <Link style={linkStyle} to='/users'>users</Link>
      </div>

      <p>{state.user.username} is logged in
        <button onClick={handleLogout}>
              logout
        </button>
      </p>

      <Switch>
        <Route path='/users/:id'>
          <User user={userToView} />
        </Route>
        <Route path='/users'>
          <UserList />
        </Route>
        <Route path={['/', '/blogs']}>
          <h2>blogs</h2>
          <Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
            <BlogCreator username={state.user.username} toggleVisibility={toggleVisibility} />
          </Togglable>
          {state.blogs.map(blog =>
            <Blog key={blog.id} blog={blog} username={state.user.username} />
          )}
        </Route>
      </Switch>
    </>
  )
}

export default App