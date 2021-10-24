import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = newToken => token = `bearer ${newToken}`

const getAll = () => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async blog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const update = async blog => {
  const config = {
    headers: { Authorization: token }
  }
  blog.user = blog.user.id // replace obj with just id
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return response.data
}

const deleteBlog = async blogId => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

const addComment = async (comment, blogId) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, comment, config)
  return response.data
}

export default { getAll, setToken, create, update, deleteBlog, addComment }