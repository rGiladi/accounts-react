import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import regExp from './utils/regExp'
import merge from 'deepmerge'

class _AccountsReact {
  constructor () {
    this._init = false
    this.config = {

      /* -----------------------------
                    Behaviour
         ----------------------------- */

      confirmPassword: true,
      defaultState: 'signIn',
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
        // signIn: '/sign-in'
      },


      /* -----------------------------
                Fields (States)
         ----------------------------- */

      fields: {

        /* Sign In */

        signIn: [
          {
            _id: 'email',
            displayName: 'Email',
            placeholder: 'Enter your email',
            re: regExp.Email
          },
          {
            _id: 'password',
            displayName: 'Password',
            type: 'password',
            placeholder: 'Enter your password'
          }
        ],

        /* Sign Up */

        signUp: [
          {
            _id: 'email',
            displayName: 'Email',
            placeholder: 'Enter your email',
            re: regExp.Email,
            errStr: 'Please enter a valid email'
          },
          {
            _id: 'password',
            displayName: 'Password',
            type: 'password',
            placeholder: 'Enter your password',
            minLength: 6,
            maxLength: 32,
            errStr: 'Please enter a strong password between 6 and 32 characters'
          },
          {
            _id: 'confirmPassword',
            displayName: 'Confirm password',
            type: 'password',
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
              }

              return true
            }
          }
        ],

        /* Forgot Password */

        forgotPwd: [
          {
            _id: 'email',
            displayName: 'Email',
            placeholder: 'Enter your email',
            re: regExp.Email,
            errStr: 'Please enter a valid email'
          }
        ],

        /* Change Password */

        changePwd: [
          {
            _id: 'currentPassword',
            displayName: 'Current password',
            type: 'password',
            placeholder: 'Enter your current password'
          },
          {
            _id: 'password',
            displayName: 'Password',
            type: 'password',
            placeholder: 'Enter a new password',
            minLength: 6,
            maxLength: 32,
            errStr: 'Please enter a strong password between 6 and 32 characters'
          }
        ],

        /* Reset Password */

        resetPwd: [
          {
            _id: 'password',
            displayName: 'New password',
            type: 'password',
            placeholder: 'Enter a new password'
          }
        ]
      },

      /* -----------------------------
                     Texts
         ----------------------------- */

      texts: {
        button: {
          changePwd: 'Update New Password',
          forgotPwd: 'Send Reset Link',
          resetPwd: 'Save New Password',
          signIn: 'Login',
          signUp: 'Register'
        },
        title: {
          changePwd: 'Change Password',
          forgotPwd: 'Forgot Password',
          resetPwd: 'Reset Password',
          signIn: 'Login',
          signUp: 'Create Your Account'
        },
        links: {
          toChangePwd: 'Change your password',
          toForgotPwd: 'Forgot your password?',
          toSignIn: 'Already have an account? Sign in!',
          toSignUp: 'Don\'t have an account? Register',
          toResendVerification: 'Resend email verification'
        },
        info: {
          emailSent: 'An email has been sent to your inbox',
          emailVerified: 'Your email has been verified',
          pwdChanged: 'Your password has been changed',
          pwdReset: 'A password reset link has been sent to your email!',
          pwdSet: 'Password updated!',
          signUpVerifyEmail: 'Successful Registration! Please check your email and follow the instructions',
          verificationEmailSent: 'A new email has been sent to you. If the email doesn\'t show up in your inbox, be sure to check your spam folder.'
        },
        errors: {
          loginForbidden: 'There was a problem with your login',
          captchaVerification: 'There was a problem with the recaptcha verification, please try again'
        },
        forgotPwdSubmitSuccess: 'A password reset link has been sent to your email!',
        loginForbiddenMessage: 'There was a problem with your login'
      },

      showReCaptcha: false,
      reCaptcha: {},
      tempReCaptchaResponse: ''
    }

    this.components = {}
  }

  /* Set custom components */

  style (components) {
    this.components = { ...this.components, ...components }
  }

  /* Configuration */

  configure (config) {
    this.config = merge(this.config, config)

    if (!this._init) {
      this.loadReCaptcha()
      this.setAccountCreationPolicy()
      this.overrideLoginErrors()
      this.disableForgotPassword()
      this.setDenyRules()

      this._init = true
    }
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

  loadReCaptcha () {
    if (this.config.showReCaptcha && Meteor.isClient) {
      /* Register a recaptcha callback */

      window.reCaptchaCallback = res => {
        this.config.tempReCaptchaResponse = res
      }
    }
  }

  setAccountCreationPolicy () {
    try {
      Accounts.config({
        forbidClientAccountCreation: this.config.forbidClientAccountCreation
      })
    } catch (ex) {
      //
    }
  }

  /* Server only */

  overrideLoginErrors () {
    if (this.config.overrideLoginErrors && Meteor.isServer) {
      Accounts.validateLoginAttempt(attempt => {
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
        update () { return true },
        remove () { return true },
        insert () { return true }
      })
    }
  }
}

const AccountsReact = new _AccountsReact()

Meteor.startup(() => {
  const prefix = 'meteoreact:accounts-'
  const components =
    Package[prefix + 'unstyled'] ||
    Package[prefix + 'semantic']

  AccountsReact.style(components)
})

export default AccountsReact
