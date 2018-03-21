import React, { Component, Fragment } from 'react'
import AccountsReact from '../AccountsReact'
import BaseForm from './baseForm'
import { validateForm } from '../utils'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { login } from './methods'

class SignIn extends Component {
  constructor () {
    super()

    this.state = {
      errors: [],
      currentState: 'signIn'
    }

    this.defaults = getDefaults(this.state.currentState)
    this.getModel = getModel.bind(this)
    this.handleInputChange = handleInputChange.bind(this)
    this.redirect = redirect.bind(this)
  }

  render () {
    const {
      fields,
      texts
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

          <a onMouseDown={this.redirectToSignUp}>{texts.links.toSignUp}</a>
          <a onMouseDown={this.redirectToForgotPwd}>{texts.links.toForgotPwd}</a>
        </Fragment>
    )
  }

  onSubmit = (e) => {
    /* Login */
    const model = this.getModel()

    // Validate form
    if (!validateForm(model, this)) return

    const { username, email, password } = model

    // Login
    login(username, email, password, err => {
      if (err) {
        const {
          loginForbiddenMessage
        } = this.defaults

        if (err.error === 'too-many-requests') {
          // DDP Rate Limiter error
          this.setState({ errors: [{ _id: '__globals', errStr: err.reason }] })
        } else {
          // Generic login error
          const loginForbiddenError = { _id: '__globals', errStr: loginForbiddenMessage }
          this.setState({ errors: [loginForbiddenError] })
        }
      } else {
        this.defaults.onLoginHook(true)
      }
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
