import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'

import Login from './components/Login'
import BlogCreator from './components/BlogCreator'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { setUserFromLocalStorage, logoutUser } from './reducers/loginReducer'
import BlogList from './components/BlogList'

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

  const userMatch = useRouteMatch('/users/:id')
  const userToView = userMatch
    ? state.users.find(user => user.id === userMatch.params.id)
    : null

  const blogMatch = useRouteMatch('/blogs/:id')
  const blogToView = blogMatch
    ? state.blogs.find(blog => blog.id === blogMatch.params.id)
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
        <span>
          {state.user.name} is logged in
          <button onClick={handleLogout}>
            logout
          </button>
        </span>
      </div>

      <Switch>
        <Route path='/users/:id'>
          <User user={userToView} />
        </Route>
        <Route path='/users'>
          <UserList />
        </Route>
        <Route path='/blogs/:id'>
          <Blog blog={blogToView} />
        </Route>
        <Route path={['/', '/blogs']}>
          <h2>blogs</h2>
          <Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
            <BlogCreator toggleVisibility={toggleVisibility} />
          </Togglable>
          <BlogList />
        </Route>
      </Switch>
    </>
  )
}

export default App