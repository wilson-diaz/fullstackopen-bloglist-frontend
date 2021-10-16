import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { deleteBlog, updateBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog }) => {
  if (!blog) { return null }

  const dispatch = useDispatch()

  const handleLike = () => {
    dispatch(
      updateBlog({
        ...blog,
        likes: blog.likes + 1
      })
    )
    dispatch(setNotification(`liked blog: "${blog.title}"`, false, 10))
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the blog: "${blog.title}"?`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification(`deleted blog: "${blog.title}"`, false, 10))
    }
  }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
  }

  const currentUser = useSelector(state => state.user.username)

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div className='blogDetails'>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button className='btnLike' onClick={handleLike}>like</button></p>
        <p>added by {blog.user.name}</p>
        {currentUser === blog.user.username && <button className='btnDelete' onClick={handleDelete}>delete</button>}
      </div>
    </div>
  )
}

export default Blog