import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { resetPassword } from './methods'

class ResetPwd extends Component {
  constructor () {
    super()

    this.state = {
      currentState: 'resetPwd',
      passwordUpdated: false,
      errors: []
    }

    this.defaults =          getDefaults(this.state.currentState)
    this.getModel =          getModel.bind(this)
    this.redirect =          redirect.bind(this)
    this.handleInputChange = handleInputChange.bind(this)
  }

  componentWillMount () {
    if (!Meteor.userId()) {
      this.redirect('signin', this.defaults.redirects.toSignIn)
    }
  }

  render () {
    const {
      fields,
      texts,
      hideSignInLink
    } = this.defaults

    const {
      currentState,
      passwordUpdated,
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

        {passwordUpdated && <p>{texts.info.pwdSet}</p>}

        {!hideSignInLink && <a onMouseDown={this.redirectToSignIn}>{texts.links.toSignIn}</a>}
      </Fragment>
    )
  }

  onSubmit = () => {
    // Validate form
    if (!validateForm(this.getModel(), this)) return

    const { password } = this.getModel()

    // Change password
    resetPassword(this.props.token, password, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], passwordUpdated: false })
      } else {
        this.setState({ errors: [], passwordUpdated: true })
      }

      this.defaults.onSubmitHook(err, this.state.currentState)
    })
  }

  redirectToSignIn = () => {
    this.redirect('signin', this.defaults.redirects.toSignIn)
  }
}

export default ResetPwd
