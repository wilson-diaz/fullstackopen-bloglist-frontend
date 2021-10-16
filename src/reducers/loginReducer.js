import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const loginReducer = (state = null, action ) => {
  switch (action.type) {
  case 'LOGIN': {
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(action.data))
    blogService.setToken(action.data.token)
    return action.data
  }
  case 'SET_USER': return action.data
  case 'LOGOUT': return null
  default: return state
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    let response = null
    try {
      response = await loginService.login(credentials)
    } catch (ex) {
      dispatch(setNotification('error logging in', true, 10))
      return
    }

    dispatch({
      type: 'LOGIN',
      data: response
    })
  }
}

export const setUserFromLocalStorage = () => {
  let user = null
  const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')

  if (loggedUserJSON) {
    user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
  }

  return {
    type: 'SET_USER',
    data: user
  }
}

export const logoutUser = () => {
  window.localStorage.removeItem('loggedBlogUser')
  blogService.setToken(null)
  return {
    type: 'LOGOUT'
  }
}
export default loginReducer