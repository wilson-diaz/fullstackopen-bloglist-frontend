const initialState = {
  message: null,
  isError: null,
  prevId: null
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'SET_NEW': {
    clearTimeout(state.prevId)
    return {
      message: action.data.message,
      isError: action.data.isError,
      prevId: action.data.prevId
    }
  }
  case 'CLEAR': return initialState
  default: return initialState
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR'
  }
}

export const setNotification = (message, isError, seconds) => {
  return async dispatch => {
    const clearId = setTimeout(() => {
      dispatch(clearNotification())
    }, (seconds * 1000))
    dispatch({
      type: 'SET_NEW',
      data: {
        message,
        isError,
        clearId
      }
    })
  }
}

export default notificationReducer