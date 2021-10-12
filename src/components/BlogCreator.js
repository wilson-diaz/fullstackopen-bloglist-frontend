import React from 'react'
import { useDispatch } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks'

const BlogCreator = ({ toggleVisibility, username }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()

    dispatch(createBlog({ title: title.value, author: author.value, url: url.value }, username))
    dispatch(setNotification('blog created successfully', false, 10))
    toggleVisibility();
    [title, author, url].forEach(x => x.resetValue())
  }

  return (
    <>
      <h2>create blog</h2>
      <form onSubmit={handleSubmit}>
        <p>title: <input id="txtTitle" {...title.getInputProps()}/></p>
        <p>author: <input id="txtAuthor" {...author.getInputProps()}/></p>
        <p>url: <input id="txtUrl" {...url.getInputProps()}/></p>
        <button id='btnCreate' type="submit">create</button>
      </form>
    </>
  )
}

export default BlogCreator