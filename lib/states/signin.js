import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { login } from './methods'

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
      fields,
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
            fields={fields}
            handleInputChange={this.handleInputChange}
            onSubmit={this.onSubmit}
            errors={errors}
          />

          {!hideSignUpLink && <a onMouseDown={this.redirectToSignUp}>{texts.links.toSignUp}</a>}
          {!hideForgotPasswordLink && <a onMouseDown={this.redirectToForgotPwd}>{texts.links.toForgotPwd}</a>}
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
    this.redirect('signup', this.defaults.redirects.toSignUp)
  }

  redirectToForgotPwd = () => {
    this.redirect('forgot-password', this.defaults.redirects.toForgotPwd)
  }
}

export default SignIn
