import userService from '../services/users'

const userReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS': return action.data
  default: return state
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    const response = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: response
    })
  }
}

export default userReducer