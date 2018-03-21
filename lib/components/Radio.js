import React from 'react'
import PropTypes from 'prop-types'

class RadioField extends React.Component {

  componentDidMount () {

    const {
      _id,
      options,
      onChange
    } = this.props

    const defaultOption = options.filter(o => o.default)[0]
    if (defaultOption) {

      // let parent know that this field has a default value
      onChange(defaultOption.value, _id)
    }
  }

  render () {

    const {
      _id,
      label,
      options,
      error,
      values
    } = this.props

    return (

      <div>

        <label>{label}</label>

        <br />

        {options.map((option, i) => (

          <React.Fragment key={i}>
            <input
              type='radio'
              value={option.value}
              checked={values[_id] === option.value}
              onChange={this.handleChange}
            />
            <label>{option.text}</label>
            <br />
          </React.Fragment>
        ))}

        <br />

        {error && <span style={{ color: 'red' }}>{error.errStr}</span>}

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

RadioField.propTypes = {
  component: PropTypes.element,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
}

RadioField.defaultProps = {
  type: 'text'
}

export default RadioField
