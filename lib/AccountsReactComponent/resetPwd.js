import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getModel, handleInputChange, redirect } from './commonUtils'
import { resetPassword } from './methods'

class ResetPwd extends Component {
  constructor () {
    super()
    this.state = {
      passwordUpdated: false,
      errors: []
    }

    this.getModel =          getModel.bind(this)
    this.redirect =          redirect.bind(this)
    this.handleInputChange = handleInputChange.bind(this)
  }

  render () {
    const {
      currentState,
      defaults
    } = this.props

    const {
      texts
    } = defaults

    const {
      passwordUpdated,
      errors
    } = this.state

    const model = this.getModel()

    return (
      <Fragment>

        <BaseForm
          currentState={currentState}
          values={model}
          defaults={defaults}
          handleInputChange={this.handleInputChange}
          onSubmit={this.onSubmit}
          errors={errors}
        />

        {passwordUpdated && <p>{texts.info.pwdSet}</p>}

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

      this.props.defaults.onSubmitHook(err, this.props.currentState)
    })
  }
}

export default ResetPwd
