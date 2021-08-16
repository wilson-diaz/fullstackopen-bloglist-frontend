import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogCreator = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  BlogCreator.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return (
    <>
      <h2>create blog</h2>
      <form onSubmit={handleSubmit}>
        <p>title: <input type="text" name="Title" value={title}
          onChange={({ target }) => setTitle(target.value)}/></p>
        <p>author: <input type="text" name="Author" value={author}
          onChange={({ target }) => setAuthor(target.value)}/></p>
        <p>url: <input type="text" name="URL" value={url}
          onChange={({ target }) => setUrl(target.value)}/></p>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogCreator