import AccountsReact from '../AccountsReact'

export default (globalErrors) => {
  // based on https://github.com/softwarerero/meteor-accounts-t9n/blob/master/t9n/en.coffee

  const { texts } = AccountsReact.config;

  return globalErrors.map(({ _id, errStr }) => {
    let errName = null;

    switch(errStr) {
      // accounts-react
      case 'There was a problem with your login': errName = 'loginForbidden'; break
      case 'User not found': errName = 'userNotFound'; break
      case 'User already verified!': errName = 'userAlreadyVerified'; break
      case 'There was a problem with the recaptcha verification, please try again':
        errName = 'captchaVerification'
        break
      case 'You must verify your email address before you can log in':
        errName = 'verifyEmailBeforeLogin'
        break
      case 'You must login again after password reset':
        errName = 'mustLoginAfterPasswordReset'
        break

      // accounts-base
      case 'Email already exists.': errName = 'emailExists'; break
      case "Email doesn't match the criteria.": errName = 'emailCriteriaFail'; break
      case 'Invalid login token':  errName = 'invalidToken'; break
      case 'Login forbidden': errName = 'loginForbidden'; break
      case 'Service unknown': errName = 'serviceUnknown'; break
      case 'Unrecognized options for login request': errName = 'unrecognizedOptions'; break
      case 'User validation failed': errName = 'userValidation'; break
      case 'Username already exists.': errName = 'usernameExists'; break
      case 'You are not logged in.': errName = 'notLoggedIn'; break
      case "You've been logged out by the server. Please log in again.": errName = 'loggedOut'; break
      case 'Your session has expired. Please log in again.': errName = 'sessionExpired'; break
      case 'Already verified': errName = 'userAlreadyVerified'; break
      case 'Invalid email or username': errName = 'invalidEmailOrUsername'; break
      case 'Internal server error': errName = 'internalError'; break
      case 'undefined': errName = 'undefined'; break

      // accounts-oauth
      case 'No matching login attempt found': errName = 'noMatchingLoginAttempt'; break

      // accounts-password-client
      case 'Password is old. Please reset your password.': errName = 'oldPassword'; break

      // accounts-password
      case 'Incorrect password': errName = 'incorrectPassword'; break
      case 'Invalid email': errName = 'invalidEmail'; break
      case 'Must be logged in': errName = 'mustBeLoggedIn'; break
      case 'Need to set a username or email': errName = 'needToSetUsernameOrEmail'; break
      case 'old password format': errName = 'oldPasswordFormat'; break
      case 'Password may not be empty': errName = 'emptyPassword'; break
      case 'Signups forbidden': errName = 'signUpForbidden'; break
      case 'Token expired': errName = 'tokenExpired'; break
      case 'Token has invalid email address': errName = 'tokenInvalidEmail'; break
      case 'User has no password set': errName = 'noPasswordSet'; break
      // case 'User not found': errName = 'userNotFound'; break // Already checked in accounts-react section above
      case 'Verify email link expired': errName = 'verifyEmailLinkExpired'; break
      case 'Verify email link is for unknown address': errName = 'verifyEmailLinkUnknown'; break
      case 'At least 1 digit, 1 lowercase and 1 uppercase': errName = 'passwordDigitCase'; break
      case 'Please verify your email first. Check the email and follow the link!':
        errName = 'verifyEmailFirst'
        break
      case "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.":
        errName = 'newEmailSent'
        break

      // match
      case 'Match failed': errName = 'matchFailed'; break

      // Misc...
      case 'Error, too many requests. Please slow down. You must wait 1 seconds before trying again.':
        errName = 'tooManyRequests'
        break
      case 'Unknown error': errName = 'unknownError'; break
    }

    return {
      _id,
      errStr: texts.errors[errName] || errStr,
    };
  });
}
