import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import {
  
  Button,
} from '@material-ui/core'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  //jos tilan 'visible' arvo on 'true', tällä tyylillä määritelty div ei ole näkyvissä, koska displayn arvo on 'none'
  //jos tila on 'false', divin sisältö näkyy, koska sen näkyvyydelle ei aseteta rajoituksia
  const hideWhenVisible = { display: visible ? 'none' : '' }
  //jos tila on 'false', tällä tyylillä määritelty divin sisältö ei ole näkyvissä, koska displayn arvo on 'none'
  //jos tila on 'true', divin sisältö näkyy, koska sen näkyvyydelle ei aseteta rajoituksia
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
      return {
          toggleVisibility
      }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
      <Button variant="contained" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="outlined" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Togglable