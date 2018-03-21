import React from 'react'
import PropTypes from 'prop-types'

class SelectField extends React.Component {

  state = {
    defaultOption: null
  }

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
      this.setState({ defaultOption })
    }
  }

  render () {

    const {
      label,
      options,
      error
    } = this.props

    const { defaultOption } = this.state

    return (

      <div>

        <label>{label}</label>

        <br />

        <select defaultValue={defaultOption ? defaultOption.value : options[0].value} onChange={this.handleChange}>

          {options.map((option, i) => (

            <option key={i} value={option.value}>{option.text}</option>
          ))}

        </select>

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

SelectField.propTypes = {
  component: PropTypes.element,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
}

SelectField.defaultProps = {
  type: 'text'
}

export default SelectField
