/* eslint key-spacing:0 padded-blocks: 0 */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import * as Components from './components'
import regExp from './utils/regExp'
import merge from 'deepmerge'

class _AccountsReact {
  constructor () {

    this.config = {

      /* -----------------------------
                    Behaviour
         ----------------------------- */

      confirmPassword: true,
      defaultState: '/sign-in',
      disableForgotPassword: false,
      enablePasswordChange: false,
      focusFirstInput: !Meteor.isCordova,
      forbidClientAccountCreation: false,
      identifyBy: 'EMAIL',
      lowercaseUsername: false,
      loginAfterSignup: true,
      overrideLoginErrors: true,
      sendVerificationEmail: true,
      setDenyRules: true,

      /* -----------------------------
                  Appearance
         ----------------------------- */

      hideSignInLink: false,
      hideSignUpLink: false,
      hideForgotPasswordLink: false,
      showLabels: true,
      showPlaceholders: true,

      /* -----------------------------
            Client Side Validation
         ----------------------------- */

      continuousValidation: false,
      negativeValidation: true,

      /* -----------------------------
                    Hooks
         ----------------------------- */

      onLogoutHook: () => {},
      onLoginHook: () => {},
      onSubmitHook: (errors, state) => {},
      preSignupHook: (password, info) => {},

      /* -----------------------------
                   Redirects
         ----------------------------- */

      redirects: {
        // toSignUp: () => {}
      },


      /* -----------------------------
                    Routes
         ----------------------------- */

      mapStateToRoute: {
        signin: '/sign-in',
        signup: '/sign-up'
      },


      /* -----------------------------
                Fields (States)
         ----------------------------- */

      fields: {

        /* Sign In */

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

        /* Sign Up */

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

        /* Forgot Password */

        forgotPwd: [
          {
            _id: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            re: regExp.Email,
            errStr: 'Please enter a valid email'
          }
        ],

        /* Change Password */

        changePwd: [
          {
            _id: 'currentPassword',
            label: 'Current password',
            inputType: 'password',
            placeholder: 'Enter your current password'
          },
          {
            _id: 'password',
            label: 'Password',
            inputType: 'password',
            placeholder: 'Enter your new password',
            minLength: 6,
            maxLength: 32,
            errStr: 'Please enter a strong password between 6 and 32 characters'
          }
        ],

        /* Reset Password */

        resetPwd: [
          {
            _id: 'password',
            label: 'New password',
            inputType: 'password',
            placeholder: 'Enter a new password'
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
        ]
      },

      /* -----------------------------
                     Texts
         ----------------------------- */

      texts: {
        button: {
          signUp: 'Register',
          signIn: 'Login',
          forgotPwd: 'Send Reset Link',
          changePwd: 'Update New Password',
          resetPwd: 'Save New Password'
        },
        title: {
          signUp: 'Create Your Account',
          signIn: 'Login',
          forgotPwd: 'Forgot Password',
          changePwd: 'Change Password',
          resetPwd: 'Reset Password'
        },
        links: {
          toSignIn: 'Already have an account? Sign in!',
          toSignUp: 'Don\'t have an account? Register',
          toForgotPwd: 'Forgot your password?',
          toChangePwd: 'Change your password',
          toResendVerification: 'Resend email verification'
        },
        success: {
          forgotPwd: 'A password reset link has been sent to your email!',
          changePwd: 'Password updated!',
          resetPwd: 'Password updated!'
        },
        errors: {
          loginForbidden: 'There was a problem with your login'
        },
        forgotPwdSubmitSuccess: 'A password reset link has been sent to your email!',
        loginForbiddenMessage: 'There was a problem with your login'
      },
    }

    this.components = {
      ...Components
    }

    Accounts.config({
      forbidClientAccountCreation: true // Forbid by default so only a custom "createUser" method can be used
    })

    Meteor.users.deny({
      update() { return true; },
      remove() { return true; }
    });
  }

  /* Set custom components */

  style (components) {
    this.components = { ...this.components, ...components }
  }

  /* Configuration */

  configure (config) {
    this.config = merge(this.config, config)

    this.overrideLoginErrors()
    this.disableForgotPassword()
    this.setDenyRules()
  }

  /* Extend default fields */

  addFields (state, fields) {
    try {
      let fieldsArray = this.config.fields[state]
      this.config.fields[state] = fieldsArray.concat(fields)
    } catch (ex) {
      throw new Error(ex)
    }
  }

  logout () {
    this.config.onLogoutHook()
    Meteor.logout()
  }

  setAccountCreationPolicy () {
    if (!this.config.forbidClientAccountCreation) {
      Accounts.config({
        forbidClientAccountCreation: false
      })
    }
  }

  /* Server only */

  overrideLoginErrors () {
    if (this.config.overrideLoginErrors && Meteor.isServer) {
      Accounts.validateLoginAttempt(function (attempt) {
        if (attempt.error) {
          var reason = attempt.error.reason
          if (reason === 'User not found' || reason === 'Incorrect password') {
            throw new Meteor.Error('Login Forbidden', this.config.texts.errors.loginForbidden) // Throw generalized error for failed login attempts
          }
        }
        return attempt.allowed
      })
    }
  }

  disableForgotPassword () {
    if (this.config.disableForgotPassword && Meteor.isServer) {
      Meteor.server.method_handlers.forgotPassword = () => { // Override forgotPassword method directly.
        throw new Meteor.Error('Forgot password is disabled')
      }
    }
  }

  setDenyRules () {
    if (this.config.setDenyRules && Meteor.isServer) {
      Meteor.users.deny({
        update() { return true },
        remove() { return true },
        insert() { return true }
      })
    }
  }
}

const AccountsReact = new _AccountsReact()

export default AccountsReact
