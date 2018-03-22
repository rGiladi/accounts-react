import React, { Component, Fragment } from 'react'
import AccountsReact from '../AccountsReact'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getDefaults, getModel, handleInputChange, redirect } from './commonUtils'
import { changePassword } from './methods'

class ChangePwd extends Component {
  constructor () {
    super()

    this.state = {
      currentState: 'changePwd',
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
      hideForgotPasswordLink
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

        {passwordUpdated && <p>{texts.success.changePwd}</p>}

        {!hideForgotPasswordLink && <a onMouseDown={this.redirectToForgotPwd}>{texts.links.toForgotPwd}</a>}
      </Fragment>
    )
  }

  onSubmit = () => {
    // Validate form
    if (!validateForm(this.getModel(), this)) return

    const { currentPassword, password } = this.getModel()

    // Change password
    changePassword(currentPassword, password, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], passwordUpdated: false })
      } else {
        this.setState({ errors: [], passwordUpdated: true })
        AccountsReact.config.onSubmitHook(this.state.currentState)
      }
    })
  }

  redirectToForgotPwd = () => {
    this.redirect('forgot-password', this.defaults.redirects.toForgotPwd)
  }
}

export default ChangePwd
