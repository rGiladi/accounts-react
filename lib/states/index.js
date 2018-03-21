import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import SignIn from './signin'
import SignUp from './signup'
import ForgotPassword from './forgotPassword'

class AccountsReactComponent extends React.Component {

  state = {
    internalState: '' // If set - it will override state from props
  }

  render () {
    const state = this.state.internalState || this.props.state

    let form
    switch (state) {
      case 'signin':          form = SignIn; break;
      case 'signup':          form = SignUp; break;
      case 'forgot-password': form = ForgotPassword; break;
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
  state: PropTypes.string.isRequired
}

export default AccountsReactComponent
