import React from 'react'
import { useSelector } from 'react-redux'

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
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserList