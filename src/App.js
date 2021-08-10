import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import BlogCreator from './components/BlogCreator'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!user) { return  }
    try {
      blogService
        .getAll()
        .then(blogs => setBlogs(blogs))
        .catch(err => { throw err })
    } catch (ex) {
      console.error('error getting blogs', ex)
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
    } catch (ex) {
      console.error('error logging in', ex)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      const response = await blogService.create({ title, author, url })
      console.log(response.data)
    } catch (ex) {
      console.error('error creating blog', ex)
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
          <p>{user.username} is logged in 
            <button onClick={() => window.localStorage.removeItem('loggedBlogUser')}>
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