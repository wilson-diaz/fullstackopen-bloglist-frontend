import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) { return  }
    try {
      blogService
        .getAll()
        .then(blogs => setBlogs(blogs))
        .catch(err => { throw err })
    } catch (ex) {
      console.log('error getting blogs', ex)
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const retUser = await loginService.login({ username, password })
      blogService.setToken(retUser.token)
      setUsername('')
      setPassword('')
      setUser(retUser)
    } catch (ex) {
      console.log(ex)
    }
  }

  if (!user) {
    return (
      <div>
        <form onSubmit={handleLogin}>
          <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </form>
      </div>
    ) 
  } else {
    return (
       <div>
          <h2>blogs</h2>
          <p>{user.username} is logged in</p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
      </div>
    )
  }
}

export default App