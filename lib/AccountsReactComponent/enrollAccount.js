import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getModel, redirect } from './commonUtils'
import { resetPassword } from './methods'

class EnrollAccount extends Component {
  constructor () {
    super()

    this.state = {
      passwordSet: false,
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
      texts
    } = defaults

    const {
      passwordSet,
      errors
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

        {passwordSet && <p>{texts.info.accountEnrolled}</p>}

      </Fragment>
    )
  }

  onSubmit = () => {
    // Validate form
    if (!validateForm(this.getModel(), this)) return

    const { password, confirmPassword } = this.getModel()

    // Change password
    resetPassword(this.props.token, password, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], passwordSet: false })
      } else {
        this.setState({ errors: [], passwordSet: true })
      }

      this.props.defaults.onSubmitHook(err, this.props.currentState)
    })
  }
}

export default EnrollAccount
