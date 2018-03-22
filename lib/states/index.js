import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import SignIn from './signin'
import SignUp from './signup'
import ForgotPwd from './forgotPwd'
import ChangePwd from './changePwd'
import AccountsReact from '../AccountsReact'

class AccountsReactComponent extends React.Component {

  state = {
    internalState: '' // If set - it will override state from props
  }

  render () {
    // State priority -> 1.internal 2. provided by route (or parent component) 3. default state from config
    const state = this.state.internalState || this.props.state || AccountsReact.config.defaultState

    let form
    switch (state.toLowerCase()) {
      case 'signin':          form = SignIn;    break;
      case 'signup':          form = SignUp;    break;
      case 'forgot-password': form = ForgotPwd; break;
      case 'change-password': form = ChangePwd; break;
      default: return null // redirect ?
    }

    const props = {
      changeState: this.changeInternalState,
      history: this.props.history
    }
    return createElement(form, props)
  }

  changeInternalState = toState => {
    this.setState({ internalState: toState })
  }
}

AccountsReactComponent.propTypes = {
  state: PropTypes.string
}

export default AccountsReactComponent
