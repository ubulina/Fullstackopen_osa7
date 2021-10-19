import React from 'react'
import { Alert } from '@material-ui/lab'

const Errorinfo = ({ errorMessage }) => {

    if (errorMessage === null) {
        return null
      }

      return (
        <div className='error'>
        <Alert severity="error">
          {errorMessage}
        </Alert>  
        </div>
      )


}


export default Errorinfo