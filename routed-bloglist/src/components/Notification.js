import React from 'react'
import { Alert } from '@material-ui/lab'

const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (
    <div className='info'>
    <Alert severity="success">
      {message}
    </Alert>  
    </div>
  )

}

export default Notification