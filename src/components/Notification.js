import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const state = useSelector(state => state)

  const style = {
    color: state.isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div className='notification' style={style}>{state.message}</div>
  )
}

export default Notification