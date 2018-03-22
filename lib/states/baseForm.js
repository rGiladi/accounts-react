/* eslint key-spacing:0 padded-blocks: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AccountsReact from '../AccountsReact'

class BaseForm extends Component {

  componentWillMount () {
    this.defaults = {
      ...AccountsReact.config,
      ...AccountsReact.components,
      ...AccountsReact.config.texts
    }
  }

  render () {
    // State specifics
    const {
      currentState,
      values,
      fields,
      handleInputChange,
      onSubmit,
      errors
    } = this.props

    // Components
    const {
      FormField,
      InputField,
      SelectField,
      RadioField,
      SubmitField,
      TitleField,
      ErrorsField,
      title,
      button
    } = this.defaults

    // Global errors
    const globalErrors = errors ? errors.filter(errField => errField._id === '__globals') : []

    return (
      <FormField onSubmit={(e) => e.preventDefault()}>

        {/* Title  */}
        {title[currentState] && <TitleField text={title[currentState]} />}

        {/* Fields  */}
        {fields.map((f, i) => {
          let Field = InputField // Default to input

          switch (f.fieldType) {
            case 'select': Field = SelectField; break;
            case 'radio':  Field = RadioField;  break;
          }

          const props = {
            key: i,
            onChange: handleInputChange,
            error: errors ? errors.find((errField) => errField._id === f._id) : [],
            values,
            defaults: this.defaults,
            ...f
          }

          if (this.shouldFocusFirstInput(i)) {
            props.focusInput = true
          }

          return React.createElement(Field, props)
        })}

        {/* Submit Button  */}
        <SubmitField onClick={onSubmit} text={button[currentState]} />

        {/* Errors Message  */}
        <ErrorsField errors={globalErrors} />
      </FormField>
    )
  }

  shouldFocusFirstInput = index => {
    return this.defaults.focusFirstInput && index === 0
  }
}

BaseForm.propTypes = {
  currentState: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
}

export default BaseForm
