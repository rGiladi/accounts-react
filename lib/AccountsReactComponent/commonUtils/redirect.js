import AccountsReact from '../../AccountsReact'

/* Redirect to different state after link clicked */

const redirect = function (toState, hook) {
  // *this* is bound to the calling components
  //  Run hook function if set || push state via history || change state internally

  if (hook) {
    hook()
  } else if (this.props.history) {
    this.props.history.push(AccountsReact.config.mapStateToRoute[toState])
  } else {
    this.props.changeState(toState)
  }

  return
}

export default redirect
