/* eslint key-spacing:0 padded-blocks: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AccountsReact from '../AccountsReact'
import { validateOnChange } from '../utils/validateField'

class BaseForm extends Component {
  constructor (props) {
    super()
    this.handleInputChange = handleInputChange.bind(props.context)
  }

  componentDidMount () {
    // We must explicitly rerender recaptcha on every mount
    if (this.props.showReCaptcha) { // will be available only for signup form.
      let reCaptchaParams = this.props.defaults.reCaptcha || Meteor.settings.public.reCaptcha
      
      setTimeout(() => {
        window.grecaptcha.render('recaptcha-container',
        { ...reCaptchaParams,
          callback: window.reCaptchaCallback
        },
        )
      }, 1)
    }
  }

  render () {
    // State specifics
    const {
      currentState,
      values,
      defaults,
      onSubmit,
      errors
    } = this.props

    // Defaults
    const {
      texts,
      showReCaptcha,
      confirmPassword
    } = defaults

    const _fields = defaults.fields[currentState]
    const fields  = confirmPassword ? fields : _fields.filter(field => field._id !== 'confirmPassword')

    // texts
    const title  = texts.title[currentState]
    const button = texts.button[currentState]

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
        {title && <TitleField text={title} />}

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
            onChange: this.handleInputChange,
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
        <SubmitField onClick={onSubmit} text={button} />

        {/* Errors Message  */}
        <ErrorsField errors={globalErrors} />

      </FormField>
    )
  }

  shouldFocusFirstInput = index => {
    return this.props.defaults.focusFirstInput && index === 0
  }
}

function handleInputChange (e, _id) {
  // *this* is bound to calling components

  // Check if e is already a string value or an event object
  const value = typeof e === 'string' ? e : e.target.value

  if (fieldChangedAtLeastOnce(this.state, _id, value)) return

  const {
    currentState,
    defaults
  } = this.props

  const fields = defaults.fields[currentState]
  // if e is a string it means that it's a default value and doesn't need to pass validation
  if (typeof e !== 'string') {
    const errors = validateOnChange(e, _id, fields, this.getModel(), [...this.state.errors])

    if (errors) {
      this.setState({ errors })
    }
  }
  this.setState({ [_id]: value })
}

function fieldChangedAtLeastOnce (state, _id, value) {
  return !state.hasOwnProperty(_id) && value === ''
}

BaseForm.propTypes = {
  context: PropTypes.object.isRequired,
  currentState: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  defaults: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
}

export default BaseForm
