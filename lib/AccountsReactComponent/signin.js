import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { login } from './methods'
import SocialButtons from './socialButtons'

class SignIn extends Component {
  constructor () {
    super()
    this.state = {
      currentState: 'signIn',
      errors: []
    }

    this.defaults =          getDefaults(this.state.currentState)
    this.getModel =          getModel.bind(this)
    this.redirect =          redirect.bind(this)
    this.handleInputChange = handleInputChange.bind(this)
  }

  render () {
    const {
      texts,
      hideSignUpLink,
      hideForgotPasswordLink
    } = this.defaults

    const {
      currentState,
      errors
    } = this.state

    const model = this.getModel()

    return (
      <Fragment>
        <BaseForm
          currentState={currentState}
          values={model}
          defaults={this.defaults}
          handleInputChange={this.handleInputChange}
          onSubmit={this.onSubmit}
          errors={errors}
        />

        <SocialButtons />

        {!hideSignUpLink && <a href='' onMouseDown={this.redirectToSignUp} style={linkStyle}>{texts.links.toSignUp}</a>}
        {!hideForgotPasswordLink && <a href='' onMouseDown={this.redirectToForgotPwd} style={linkStyle}>{texts.links.toForgotPwd}</a>}
      </Fragment>
    )
  }

  onSubmit = () => {
    /* Login */
    const model = this.getModel()

    // Validate form
    if (!validateForm(model, this)) return

    const { username, email, password } = model

    // Login
    login(username, email, password, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }] })
      }

      this.defaults.onSubmitHook(err, this.state.currentState)
    })
  }

  redirectToSignUp = () => {
    this.redirect('signUp', this.defaults.redirects.toSignUp)
  }

  redirectToForgotPwd = () => {
    this.redirect('forgotPwd', this.defaults.redirects.toForgotPwd)
  }
}

const linkStyle = {
  display: 'block'
}

export default SignIn
