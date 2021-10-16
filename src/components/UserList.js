import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserList = () => {
  const state = useSelector(state => state)

  return (
    <div>
      <h2>users</h2>
      <table>
        <thead>
          <tr>
            <th>username</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {state.users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserList