import * as Components from './components'
import regExp from './utils/regExp'
import merge from 'deepmerge'

// Accounts React
class _AccountsReact {

  /* Set custom components */

  style (components) {
    this.components = { ...this.components, ...components }
  }

  /* Configuration */

  configure (config) {
    this.config = merge(this.config, config)
  }

  config = {

    /* Behaviour */

    confirmPassword: true,
    defaultState: 'signIn', // done
    identifyBy: 'EMAIL', // done

    sendVerificationEmail: true, // done
    disableForgotPassword: false, // done
    loginAfterSignup: true, // done
    lowercaseUsername: false,
    enablePasswordChange: false,

    /* Appearance */

    hideSignInLink: false,
    hideSignUpLink: false,
    hideForgotPasswordLink: false,
    hideResendVerificationEmailLink: true,

    validateOnFocusOut: true, // done
    validateOnChange: false, // done

    /* Hooks */

    onSubmitHook: () => {},
    onLogoutHook: () => {},
    onLoginHook: () => {},
    onSignupHook: () => {},
    preSignupHook: () => {},

    /* Redirects */

    redirects: {
      // toSignUp: () => {}
    },

    /* Fields */

    fields: {

      // Login Fields
      signIn: [
        {
          _id: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          re: regExp.Email
        },
        {
          _id: 'password',
          label: 'Password',
          inputType: 'password',
          placeholder: 'Enter your password'
        }
      ],

      // Signup Fields
      signUp: [
        {
          _id: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          re: regExp.Email,
          errStr: 'Please enter a valid email'
        },
        {
          _id: 'password',
          label: 'Password',
          inputType: 'password',
          placeholder: 'Enter your password',
          minLength: 6,
          maxLength: 32,
          errStr: 'Please enter a strong password between 6 and 32 characters'
        },
        {
          _id: 'confirmPassword',
          label: 'Confirm password',
          inputType: 'password',
          placeholder: 'Re-enter your password',
          errStr: 'Password doesn\'t match',
          exclude: true,
          func: (fields, fieldObj, value, model, errorsArray) => {
            // check that passwords match
            const { password } = model
            const { _id, errStr } = fieldObj

            if (typeof password === 'string') {
              if (!value || (value !== password)) {
                errorsArray.push({ _id, errStr })
                return
              }
            } else { // already hashed
              if (!value || !password || (value.digest !== password.digest)) {
                errorsArray.push({ _id, errStr })
                return
              }
            }
            return true
          }
        }
      ],

      // Forgot Password Fields
      forgotPwd: [
        {
          _id: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          re: regExp.Email,
          errStr: 'Please enter a valid email'
        }
      ]
    },

    /* Texts */

    texts: {
      button: {
        signUp: 'Register',
        signIn: 'Login',
        forgotPwd: 'Send Reset Link'
      },
      title: {
        signUp: 'Create Your Account',
        signIn: 'Login',
        forgotPwd: 'Forgot Password'
      },
      links: {
        toSignIn: 'Already have an account? Sign in!',
        toSignUp: 'Don\'t have an account? Register',
        toForgotPwd: 'Forgot your password?',
        toResendVerification: 'Resend email verification'
      },
      forgotPwdSubmitSuccess: 'A password reset link has been sent to your email!', // done
      loginForbiddenMessage: 'There was a problem with your login',   // done
    }
  }

  /* Form's components */

  components = {
    ...Components
  }

  addFields (state, fields) {
    /* Extend default fields */

    try {
      let fieldsArray = this.config.fields[state]
      this.config.fields[state] = fieldsArray.concat(fields)
    } catch (ex) {
      throw new Error(ex)
    }
  }

  /* Server only */

  disableForgotPassword () {
    /* Disable forgotPassword */
    if (this.config.disableForgotPassword && Meteor.isServer) {

      // Override forgotPassword method directly.
      Meteor.server.method_handlers.forgotPassword = () => {
        throw new Meteor.Error('Forgot password is disabled')
      }
    }
  }
}

const AccountsReact = new _AccountsReact()

export default AccountsReact
