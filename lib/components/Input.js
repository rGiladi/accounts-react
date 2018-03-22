import React from 'react'
import PropTypes from 'prop-types'

class InputField extends React.Component {
  render () {
    const {
      label,
      inputType,
      error
    } = this.props

    return (

      <div>

        <label>{label}</label>

        <br />

        <input onChange={this.handleChange} type={inputType} />

        <br />

        {error && <span style={{ color: 'red' }}>{error.errStr}</span>}

        <br />

      </div>

    )
  }

  handleChange = e => {
    const {
      _id,
      onChange
    } = this.props

    onChange(e, _id)
  }
}

InputField.propTypes = {
  component: PropTypes.element,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
}

InputField.defaultProps = {
  type: 'text'
}

export default InputField
