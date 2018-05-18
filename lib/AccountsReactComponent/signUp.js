import React, { Component, Fragment } from 'react'
import { Accounts } from 'meteor/accounts-base'
import AccountsReact from '../AccountsReact'
import BaseForm from './baseForm'
import { validateForm } from '../utils'
import { getModel, redirect } from './commonUtils'
import { createUser, login } from './methods'

class SignUp extends Component {
  constructor () {
    super()
    this.state = {
      errors: [],
      signUpSuccessful: false
    }

    this.getModel = getModel.bind(this)
    this.redirect = redirect.bind(this)
  }

  render () {
    const {
      currentState,
      defaults
    } = this.props

    const {
      texts,
      hideSignInLink,
      showReCaptcha,
      sendVerificationEmail
    } = defaults

    const {
      signUpSuccessful
    } = this.state

    return (
      <Fragment>
        <BaseForm
          context={this}
          currentState={currentState}
          values={this.getModel()}
          defaults={defaults}
          onSubmit={this.onSubmit}
          errors={this.state.errors}
          showReCaptcha={showReCaptcha}
        />

        {signUpSuccessful && sendVerificationEmail && <p>{texts.info.signUpVerifyEmail}</p>}

        {!hideSignInLink && (
          <a className='signIn-link' onMouseDown={this.redirectToSignIn} style={linkStyle} href=''>
            {texts.links.toSignIn}
          </a>
        )}
      </Fragment>
    )
  }

  onSubmit = () => {
    const model = this.getModel()
    // Validate form
    if (!validateForm(model, this)) { return }

    const {
      username,
      email,
      password,
      confirmPassword, // dont delete so it doesn't get included in profile object.
      ...profile
    } = this.getModel()

    // The user object to insert
    const newUser = {
      username,
      email,
      password: password ? Accounts._hashPassword(password) : '',
      ...profile
    }

    const {
      showReCaptcha,
      preSignupHook,
      onSubmitHook,
      loginAfterSignup
    } = this.props.defaults

    // Add recaptcha field
    if (showReCaptcha) {
      newUser.tempReCaptchaResponse = AccountsReact.config.tempReCaptchaResponse
    }

    preSignupHook(password, newUser)

    createUser(newUser, err => {
      if (err) {
        // validation errors suppose to be inside an array, if string then its a different error
        if (typeof err.reason !== 'string') {
          this.setState({ errors: err.reason })
        } else {
          this.setState({ errors: [{ _id: '__globals', errStr: err.reason }] })
        }
      } else {
        this.setState({ signUpSuccessful: true })

        if (loginAfterSignup) {
          const { password } = this.getModel()
          const { username, email } = newUser

          login(username, email, password, err => {
            if (err) { return } // ?
          })
        }
      }

      onSubmitHook(err, this.props.currentState)
    })
  }

  redirectToSignIn = () => {
    this.redirect('signIn', this.props.defaults.redirects.toSignIn)
  }
}

const linkStyle = {
  display: 'block'
}

export default SignUp
