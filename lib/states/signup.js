import React, { Component, Fragment } from 'react'
import AccountsReact from '../AccountsReact'
import BaseForm from './baseForm'
import { validateForm, hashPassword } from '../utils'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { createUser, login } from './methods'

class SignUp extends Component {
  constructor () {
    super()

    this.state = {
      currentState: 'signUp',
      errors: []
    }

    this.getModel =          getModel.bind(this)
    this.redirect =          redirect.bind(this)
    this.handleInputChange = handleInputChange.bind(this)
  }

  componentWillMount () {
    // On signup we cant just set defaults as usual,
    // We need to check wheather to include the confirmPassword field or not.

    const { confirmPassword, fields } = AccountsReact.config
    const { currentState } = this.state
    const _fields = fields[currentState]

    this.defaults = {
      ...getDefaults(currentState),
      // filter confirmPassword if not needed
      fields: !confirmPassword ? _fields.filter(f => f._id !== 'confirmPassword') : _fields
    }
  }

  render () {
    const {
      texts,
      hideSignInLink
    } = this.defaults

    const {
      currentState,
      errors
    } = this.state

    return (
      <Fragment>
        <BaseForm
          currentState={currentState}
          values={this.getModel()}
          fields={this.defaults.fields}
          handleInputChange={this.handleInputChange}
          onSubmit={this.onSubmit}
          errors={errors}
          showReCaptcha={this.defaults.showReCaptcha}
        />

        {!hideSignInLink && <a onMouseDown={this.redirectToSignIn}>{texts.links.toSignIn}</a>}
      </Fragment>
    )
  }

  onSubmit = () => {
    const model = this.getModel()
    // Validate form
    if (!validateForm(model, this)) { return }

    const { username, email, password, confirmPassword, ...profile } = this.getModel()
    // The user object to insert
    const newUser = {
      username,
      email,
      password: password ? hashPassword(password) : '',
      ...profile
    }

    // If confirmPassword is true
    if (this.defaults.confirmPassword && confirmPassword) {
      // hash the confirmation password so it can be validated against the original
      newUser.confirmPassword = hashPassword(confirmPassword)
    }

    // Add recaptcha field
    if (this.defaults.showReCaptcha) {
      newUser.tempReCaptchaResponse = AccountsReact.config.tempReCaptchaResponse
    }

    this.defaults.preSignupHook(password, newUser)

    createUser(newUser, err => {
      if (err) {
        // validation errors suppose to be inside an array, if string then its a different error
        if (typeof err.reason !== 'string') {
          this.setState({ errors: err.reason })
        } else {
          this.setState({ errors: [{ _id: '__globals', errStr: err.reason }] })
        }
      } else if (this.defaults.loginAfterSignup) {
        const { password } = this.getModel()
        const { username, email } = newUser

        login(username, email, password, err => {
          if (err) { return } // ?
        })
      }

      this.defaults.onSubmitHook(err, this.state.currentState)
    })
  }

  redirectToSignIn = () => {
    this.redirect('signIn', this.defaults.redirects.toSignIn)
  }
}

export default SignUp
