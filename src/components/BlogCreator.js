import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogCreator = ({ toggleVisibility, username }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()

    dispatch(createBlog({ title, author, url }, username))
    dispatch(setNotification('blog created successfully', false, 10))
    toggleVisibility()

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create blog</h2>
      <form onSubmit={handleSubmit}>
        <p>title: <input id="txtTitle" type="text" name="Title" value={title}
          onChange={({ target }) => setTitle(target.value)}/></p>
        <p>author: <input id="txtAuthor" type="text" name="Author" value={author}
          onChange={({ target }) => setAuthor(target.value)}/></p>
        <p>url: <input id="txtUrl" type="text" name="URL" value={url}
          onChange={({ target }) => setUrl(target.value)}/></p>
        <button id='btnCreate' type="submit">create</button>
      </form>
    </>
  )
}

export default BlogCreator