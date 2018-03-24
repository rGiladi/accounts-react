import React from 'react'
import PropTypes from 'prop-types'

class Button extends React.Component {
  /* Default accounts-react button element */

  render () {
    const { component, onClick, text } = this.props

    if (component) {
      // Append onClick and text props to the custom component
      return React.cloneElement(component, { text, onClick })
    }

    return (
      <button onClick={onClick}>{text}</button>
    )
  }
}

Button.propTypes = {
  component: PropTypes.element,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
