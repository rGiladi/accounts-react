/* eslint key-spacing:0 padded-blocks: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AccountsReact from '../AccountsReact'

class BaseForm extends Component {

  componentDidMount () {
    // We must explicitly rerender recaptcha on every mount
    if (this.props.defaults.showReCaptcha) {
      setTimeout(() => {
        window.grecaptcha.render('recaptcha-container',
        { ...this.defaults.reCaptcha}
        )
      }, 50)
    }
  }

  render () {
    // State specifics
    const {
      currentState,
      values,
      defaults,
      handleInputChange,
      onSubmit,
      errors
    } = this.props

    // Defaults
    const {
      title,
      button,
      fields,
      showReCaptcha
    } = defaults

    // Components
    const {
      FormField,
      InputField,
      SelectField,
      RadioField,
      SubmitField,
      TitleField,
      ErrorsField
    } = AccountsReact.components


    // Global errors
    const globalErrors = errors ? errors.filter(errField => errField._id === '__globals') : []

    return (
      <FormField onSubmit={(e) => e.preventDefault()} className={`ar-${currentState}`}>

        {/* Title  */}
        {title[currentState] && <TitleField text={title[currentState]} />}

        {/* Fields  */}
        {fields.map((f, i) => {

          let Field = InputField // Default to input
          switch (f.type) {
            case 'select': Field = SelectField; break;
            case 'radio':  Field = RadioField;  break;
          }

          const props = {
            key: i,
            values,
            defaults,
            onChange: handleInputChange,
            error: errors ? errors.find((errField) => errField._id === f._id) : [],
            ...f
          }

          if (this.shouldFocusFirstInput(i)) {
            props.focusInput = true
          }

          return React.createElement(Field, props)
        })}

        {showReCaptcha && <div id='recaptcha-container' />}

        {/* Submit Button  */}
        <SubmitField onClick={onSubmit} text={button[currentState]} />

        {/* Errors Message  */}
        <ErrorsField errors={globalErrors} />

      </FormField>
    )
  }

  shouldFocusFirstInput = index => {
    return this.props.defaults.focusFirstInput && index === 0
  }
}

BaseForm.propTypes = {
  currentState: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  defaults: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
}

export default BaseForm
