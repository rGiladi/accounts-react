import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { forgotPassword } from './methods'

class ForgotPassword extends Component {
  constructor () {
    super()

    this.state = {
      currentState: 'forgotPwd',
      emailSent: false,
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
      hideSignInLink
    } = this.defaults

    const {
      currentState,
      errors,
      emailSent
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

        {emailSent && <p>{texts.info.emailSent}</p>}

        {!hideSignInLink && <a href='' onMouseDown={this.redirectToSignIn}>{texts.links.toSignIn}</a>}
      </Fragment>
    )
  }

  onSubmit = () => {
    // Validate form
    if (!validateForm(this.getModel(), this)) return

    // Send password reset link
    forgotPassword({ email: this.state.email }, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], emailSent: false })
      } else {
        this.setState({ errors: [], emailSent: true })
      }

      this.defaults.onSubmitHook(err, this.state.currentState)
    })
  }

  redirectToSignIn = () => {
    this.redirect('signIn', this.defaults.redirects.toSignIn)
  }
}

export default ForgotPassword
