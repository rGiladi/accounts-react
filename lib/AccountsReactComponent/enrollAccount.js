import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react'
import AccountsReact from "../AccountsReact.js";
import BaseForm from './baseForm'
import { validateForm } from '../utils/'
import { getModel, redirect } from './commonUtils'
import { login, resetPassword } from './methods'

class EnrollAccount extends Component {
  constructor (props) {
    super(props);

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
    const model = this.getModel()

    // Validate form
    if (!validateForm(model, this)) {
      return;
    }

    const {
      token,
      currentState,
      defaults,
    } = this.props;

    const {
      username,
      email,
      password,
      confirmPassword, // dont delete so it doesn't get included in profile object.
      ...profile
    } = model;

    // The user object to insert
    const updatedUser = {
      username,
      email,
      password: password ? Accounts._hashPassword(password) : '',
      ...profile
    };

    const {
      showReCaptcha,
      preSignupHook,
      onSubmitHook,
      loginAfterSignup
    } = defaults;

    // Add recaptcha field
    if (showReCaptcha) {
      updatedUser.tempReCaptchaResponse = AccountsReact.config.tempReCaptchaResponse;
    }

    preSignupHook(password, updatedUser);

    // Change password
    resetPassword(token, password, err => {
      if (err) {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], passwordSet: false })
      } else {
        this.setState({ errors: [], passwordSet: true });

        // TODO update user profile

        if (loginAfterSignup) {
          login(username, email, password, err => {
            if (err) {
              return
            } // ?
          })
        }
      }

      onSubmitHook(err, currentState, updatedUser);
    });
  }
}

export default EnrollAccount
