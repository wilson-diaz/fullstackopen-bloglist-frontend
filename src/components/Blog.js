import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, username, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the blog: "${blog.title}"?`)) {
      deleteBlog(blog.id)
    }
  }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlog: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    deleteBlog: PropTypes.func.isRequired
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button className='btnToggler' onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className='blogDetails' style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button className='btnLike' onClick={handleLike}>like</button></p>
        <p>{blog.user.username}</p>
        {username === blog.user.username && <button className='btnDelete' onClick={handleDelete}>delete</button>}
      </div>
    </div>
  )
}

export default Blog