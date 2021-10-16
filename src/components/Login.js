import React from 'react'
import { useDispatch } from 'react-redux'

import { setNotification } from '../reducers/notificationReducer'
import { loginUser } from '../reducers/loginReducer'
import { useField } from '../hooks'

const Login = () => {
  const dispatch = useDispatch()

  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()

    dispatch(loginUser({ username: username.value, password: password.value }))
    dispatch(setNotification('logged in successfully', false, 10))
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to app</h2>
      <p>username
        <input name='Username' {...username.getInputProps()}/>
      </p>
      <p>password
        <input name='Password' {...password.getInputProps()}/>
      </p>
      <button type="submit">login</button>
    </form>
  )
}

export default Login