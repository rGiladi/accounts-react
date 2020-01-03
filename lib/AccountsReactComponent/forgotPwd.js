import React, { Component, Fragment } from 'react'
import { T9n } from 'meteor-accounts-t9n'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getModel, redirect } from './commonUtils'
import { forgotPassword } from './methods'

class ForgotPassword extends Component {
  constructor () {
    super()
    this.state = {
      emailSent: false,
      errors: []
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
      translations,
      texts,
      hideSignInLink
    } = defaults

    const {
      errors,
      emailSent
    } = this.state

    const model = this.getModel()

    return (
      <Fragment>

        <BaseForm
          context={this}
          currentState={currentState}
          values={model}
          defaults={defaults}
          onSubmit={this.onSubmit}
          errors={errors}
        />

        {emailSent && <p className='email-sent'>{texts.forgotPwdSubmitSuccess || T9n.get(translations.forgotPwdSubmitSuccess)}</p>}

        {!hideSignInLink && (
          <a className='signIn-link' onMouseDown={this.redirectToSignIn} href=''>
            {texts.links.toSignIn || T9n.get(translations.links.toSignIn)}
          </a>
        )}
      </Fragment>
    )
  }

  onSubmit = () => {
    // Validate form
    if (!validateForm(this.getModel(), this)) return

    this.sentPasswordResetLink()
  }

  sentPasswordResetLink = () => {
    // Send a reset link to the desired email

    forgotPassword({ email: this.state.email }, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], emailSent: false })
      } else {
        this.setState({ errors: [], emailSent: true })
      }

      this.props.defaults.onSubmitHook(err, this.props.currentState)
    })
  }

  redirectToSignIn = () => {
    this.redirect('signIn', this.props.defaults.redirects.toSignIn)
  }
}

export default ForgotPassword
