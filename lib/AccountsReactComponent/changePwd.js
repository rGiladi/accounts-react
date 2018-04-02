import React, { Component, Fragment } from 'react'
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getModel, redirect } from './commonUtils'
import { changePassword } from './methods'

class ChangePwd extends Component {
  constructor () {
    super()

    this.state = {
      passwordUpdated: false,
      errors: []
    }

    this.getModel = getModel.bind(this)
    this.redirect = redirect.bind(this)
  }

  componentWillMount () {
    if (!Meteor.userId()) {
      this.redirect('signin', this.props.defaults.redirects.toSignIn)
    }
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
          context={this}
          currentState={currentState}
          values={model}
          defaults={defaults}
          onSubmit={this.onSubmit}
          errors={errors}
        />

        {passwordUpdated && <p>{texts.info.pwdChanged}</p>}

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
      }

      this.props.defaults.onSubmitHook(err, this.props.currentState)
    })
  }
}

export default ChangePwd
