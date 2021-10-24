import blogService from '../services/blogs'

const sortBlogsByLikes = (blogs) => {
  return blogs.sort((x, y) => y.likes - x.likes)
}

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS': return sortBlogsByLikes(action.data)
  case 'NEW_BLOG': {
    return state.concat({
      ...action.data.newBlog,
      user: { username: action.data.username }
    })
  }
  case 'DELETE_BLOG': {
    return state.filter(b => b.id !== action.data)
  }
  case 'LIKE_BLOG': {
    return sortBlogsByLikes(state.map(b => b.id === action.data ? { ...b, likes: b.likes + 1 } : b))
  }
  case 'ADD_COMMENT': {
    return state.map(b => {
      return b.id === action.data.blogId
        ? {
          ...b,
          comments: b.comments.concat(action.data.comment)
        }
        : b
    })
  }
  default: return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (newBlog, username) => {
  return async dispatch => {
    const response = await blogService.create(newBlog)
    dispatch({
      type: 'NEW_BLOG',
      data: {
        newBlog: response,
        username
      }
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}

export const updateBlog = (newBlog) => {
  return async dispatch => {
    await blogService.update(newBlog)
    dispatch({
      type: 'LIKE_BLOG',
      data: newBlog.id
    })
  }
}

export const addComment = (newComment, blogId) => {
  return async dispatch => {
    const comment = await blogService.addComment(newComment, blogId)
    dispatch({
      type: 'ADD_COMMENT',
      data: {
        comment,
        blogId
      }
    })
  }
}

export default blogReducer