import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import SignIn from './signIn'
import SignUp from './signUp'
import ForgotPwd from './forgotPwd'
import ChangePwd from './changePwd'
import ResetPwd from './resetPwd'
import ResendVerification from './resendVerification'
import EnrollAccount from './enrollAccount'
import AccountsReact from '../AccountsReact'
import merge from '../utils/deepmerge'

class AccountsReactComponent extends React.Component {

  state = {
    internalState: '' // If set - it will override state from props
  }

  render () {
    ensureComponentsExist()

    // State priority -> 1.internal 2. provided by route/state prop (from parent component) 3. default state from config
    let state = this.state.internalState || this.props.state
    if (!state) {
      const { mapStateToRoute } = AccountsReact.config
      const route = this.props.route

      if (route) {
        state = Object.keys(mapStateToRoute).find(key => mapStateToRoute[key] === route)
      } else {
        state = AccountsReact.config.defaultState
      }
    }

    let form
    switch (state) {
      case 'signIn':    form = SignIn;    break;
      case 'signUp':    form = SignUp;    break;
      case 'forgotPwd': form = ForgotPwd; break;
      case 'changePwd': form = ChangePwd; break;
      case 'resetPwd':  form = ResetPwd;  break;
      case 'resendVerification': form = ResendVerification;  break;
      case 'enrollAccount': form = EnrollAccount; break;
      default: return null
    }

    const defaults = merge.all([
      AccountsReact.config,
      this.props.config
    ])

    if ((defaults.forbidClientAccountCreation && state === 'signUp') ||
        (defaults.disableForgotPassword && (state === 'forgotPwd' || state === 'resetPwd')) ||
        (!defaults.enablePasswordChange && state === 'changePwd') ||
        (!defaults.sendVerificationEmail && state === 'resendVerification') ||
        (!defaults.enableEnrollAccount && state === 'enrollAccount'))
    {
      return null
    }

    const props = {
      currentState: state,
      changeState: this.changeInternalState,
      history: this.props.history,
      token: this.props.token,
      defaults
    }

    return createElement(form, props)
  }

  changeInternalState = toState => {
    this.setState({ internalState: toState })
  }
}

function ensureComponentsExist () {
  if (!AccountsReact.components) {
    throw new Error('Please ensure you have provided AccountsReact a set of components to use')
  }
}

AccountsReactComponent.defaultProps = {
  config: {}
}

AccountsReactComponent.propTypes = {
  state: PropTypes.string,
  route: PropTypes.string,
  config: PropTypes.object
}

export default AccountsReactComponent
