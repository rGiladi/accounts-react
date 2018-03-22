
/* Redirect to different state after link clicked */

const redirect = function (toState, hook) {
  // *this* is bound to the calling components
  // Push state via history || run hook function if set || change state internally

  if (this.props.history) {
    this.props.changeState(toState)
    this.props.history.push(toState)
  } else if (hook) {
    hook()
  } else {
    this.props.changeState(toState)
  }
}

export default redirect
