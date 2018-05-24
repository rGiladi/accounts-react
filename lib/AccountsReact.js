import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import regExp from './utils/regExp'
import merge from './utils/deepmerge'
import './AccountsReactComponent/methods'

class AccountsReact_ {
  constructor () {
    this._init = false
    this.config = {

      /* -----------------------------
                    Behaviour
         ----------------------------- */

      confirmPassword: true,
      defaultState: 'signIn',
      disableForgotPassword: false,
      enablePasswordChange: true,
      enableEnrollAccount: true,
      focusFirstInput: !Meteor.isCordova,
      forbidClientAccountCreation: false,
      lowercaseUsername: false,
      loginAfterSignup: true,
      overrideLoginErrors: true,
      passwordSignupFields: 'EMAIL_ONLY',
      sendVerificationEmail: true,
      setDenyRules: true,
      disableConfigureLoginService: true,

      /* -----------------------------
                  Appearance
         ----------------------------- */

      hideSignInLink: false,
      hideSignUpLink: false,
      showForgotPasswordLink: false,
      showResendVerificationLink: false,
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
        signIn: '/sign-in',
        signUp: '/sign-up',
        forgotPwd: '/forgot-password',
        changePwd: '/change-password',
        resetPwd: '/reset-password/:token',
        resendVerification: '/resend-verification',
        enrollAccount: '/enroll-account/:token',
      },


      /* -----------------------------
                Fields (States)
         ----------------------------- */

      fields: {

        /* Sign In */

        signIn: [
          {
            _id: 'username',
            displayName: 'Username',
            placeholder: 'Enter your username'
          },
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
            placeholder: 'Enter your password',
            autocomplete: 'current-password'
          }
        ],

        /* Sign Up */

        signUp: [
          {
            _id: 'username',
            displayName: 'Username',
            placeholder:'Enter your username',
            minLength: 4,
            maxLength: 22,
            re: regExp.Username,
            errStr: 'Username must be between 4 and 22 characters',
          },
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
            errStr: 'Please enter a strong password between 6 and 32 characters',
            autocomplete: 'new-password'
          },
          {
            _id: 'confirmPassword',
            displayName: 'Confirm password',
            type: 'password',
            placeholder: 'Re-enter your password',
            errStr: 'Password doesn\'t match',
            exclude: true,
            autocomplete: 'new-password',
            func: (fields, fieldObj, value, model, errorsArray) => {
              if (!this.config.confirmPassword) {
                return true
              }

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
            placeholder: 'Enter your current password',
            autocomplete: 'current-password'
          },
          {
            _id: 'password',
            displayName: 'Password',
            type: 'password',
            placeholder: 'Enter a new password',
            minLength: 6,
            maxLength: 32,
            errStr: 'Please enter a strong password between 6 and 32 characters',
            autocomplete: 'new-password'
          }
        ],

        /* Reset Password */

        resetPwd: [
          {
            _id: 'password',
            displayName: 'New password',
            type: 'password',
            placeholder: 'Enter a new password',
            autocomplete: 'new-password'
          }
        ],

        /* Resend email verification */

        resendVerification: [
          {
            _id: 'email',
            displayName: 'Email',
            placeholder: 'Enter your email',
            re: regExp.Email,
            errStr: 'Please enter a valid email'
          }
        ],

        /* Enroll Account */
        enrollAccount: [
          {
            _id: 'password',
            displayName: 'Password',
            type: 'password',
            placeholder: 'Enter your password',
            minLength: 6,
            maxLength: 32,
            errStr: 'Please enter a strong password between 6 and 32 characters',
            autocomplete: 'new-password'
          },
          {
            _id: 'confirmPassword',
            displayName: 'Confirm password',
            type: 'password',
            placeholder: 'Re-enter your password',
            errStr: 'Password doesn\'t match',
            exclude: true,
            autocomplete: 'new-password',
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
          signUp: 'Register',
          resendVerification: 'Send Verification Link',
          enrollAccount: 'Save Password',
        },
        title: {
          changePwd: 'Change Password',
          forgotPwd: 'Forgot Password',
          resetPwd: 'Reset Password',
          signIn: 'Login',
          signUp: 'Create Your Account',
          resendVerification: 'Resend Verification Link',
          enrollAccount: 'Set Your Account Password',
        },
        links: {
          toChangePwd: 'Change your password',
          toResetPwd: 'Reset your password',
          toForgotPwd: 'Forgot your password?',
          toSignIn: 'Already have an account? Sign in!',
          toSignUp: 'Don\'t have an account? Register',
          toResendVerification: 'Verification email lost? Resend'
        },
        info: {
          emailSent: 'An email has been sent to your inbox',
          emailVerified: 'Your email has been verified',
          pwdChanged: 'Your password has been changed',
          pwdReset: 'A password reset link has been sent to your email!',
          pwdSet: 'Password updated!',
          signUpVerifyEmail: 'Successful Registration! Please check your email and follow the instructions',
          verificationEmailSent: 'A new email has been sent to you. If the email doesn\'t show up in your inbox, be sure to check your spam folder.',
          accountEnrolled: 'Your password has been set, you can now login',
        },
        errors: {
          loginForbidden: 'There was a problem with your login',
          captchaVerification: 'There was a problem with the recaptcha verification, please try again',
          userNotFound: 'User not found',
          userAlreadyVerified: 'User already verified!'
        },
        forgotPwdSubmitSuccess: 'A password reset link has been sent to your email!',
        loginForbiddenMessage: 'There was a problem with your login'
      },

      showReCaptcha: false,
      tempReCaptchaResponse: '',
      oauth: {}
    }

    this.components = null
  }

  /* Set custom components */

  style (components, override) {
    // Settings override to true assumes that all components types are defined.
    this.components = override ? components : { ...this.components, ...components }
  }

  /* Configuration */

  configure (config) {
    this.config = merge(this.config, config)

    if (!this._init) {
      this.determineSignupFields()
      this.loadReCaptcha()
      this.setAccountCreationPolicy()
      this.overrideLoginErrors()
      this.disableMethods()
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

  determineSignupFields () {
    const {
      signUp,
      signIn
    } = this.config.fields

    let signupFilteredFields;
    let signinFilteredFields;
    switch (this.config.passwordSignupFields) {
      case 'EMAIL_ONLY':
        signupFilteredFields = signUp.filter(field => field._id !== 'username')
        signinFilteredFields = signIn.filter(field => field._id !== 'username')
        break;
      case 'USERNAME_ONLY':
        signupFilteredFields = signUp.filter(field => field._id !== 'email')
        signinFilteredFields = signIn.filter(field => field._id !== 'email')
        break;
      case 'USERNAME_AND_OPTIONAL_EMAIL':
        signUp.forEach(field => {
          if (field._id === 'email') {
            field.required = false
          }
        })
        signinFilteredFields = signIn.filter(field => field._id !== 'email')
        break
      case 'USERNAME_AND_EMAIL':
        //
        break
      default:
        throw new Error(
          'passwordSignupFields must be set to one of ' +
          '[EMAIL_ONLY, USERNAME_ONLY, USERNAME_AND_OPTIONAL_EMAIL, USERNAME_AND_EMAL]'
        )
    }

    if (signupFilteredFields) {
      this.config.fields.signUp = signupFilteredFields
    }
    if (signinFilteredFields) {
      this.config.fields.signIn = signinFilteredFields
    }
  }

  logout () {
    const { onLogoutHook } = this.config
    if (onLogoutHook) {
      onLogoutHook()
    }
    Meteor.logout()
  }

  loadReCaptcha () {
    if (this.config.showReCaptcha && Meteor.isClient) {
      // load recaptcha script
      const script = document.createElement('script');
      document.body.appendChild(script)
      script.async = true
      script.src = 'https://www.google.com/recaptcha/api.js'

      // Register a recaptcha callback
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

  disableMethods () {
    if (Meteor.isServer) {
      // Override methods directly.
      if (this.config.disableForgotPassword) {
        Meteor.server.method_handlers.forgotPassword = () => {
          throw new Meteor.Error('forgotPassword is disabled')
        }

        Meteor.server.method_handlers.resetPassword = () => {
          throw new Meteor.Error('resetPassword is disabled')
        }
      }

      if (!this.config.enablePasswordChange) {
        Meteor.server.method_handlers.changePassword = () => {
          throw new Meteor.Error('changePassword is disabled')
        }
      }

      if (!this.config.enableEnrollAccount) {
        Meteor.server.method_handlers.enrollAccount = () => {
          throw new Meteor.Error('enrollAccount is disabled')
        }
      }

      if (!this.config.sendVerificationEmail) {
        Meteor.server.method_handlers.verifyEmail = () => {
          throw new Meteor.Error('verifyEmail is disabled')
        }

        Accounts.sendVerificationEmail = () => {
          throw new Meteor.Error('disabled', 'sendVerificationEmail is disabled')
        }
      }

      if (this.config.disableConfigureLoginService) {
        Meteor.server.method_handlers.configureLoginService = () => {
          throw new Meteor.Error('configureLoginService is disabled')
        }
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

const AccountsReact = new AccountsReact_()
Meteor.startup(() => {
  // Automatically use an installed package.
  // Packages must be installed before this package in .meteor/packages

  const prefix = 'meteoreact:accounts-'
  const components =
    Package[prefix + 'unstyled'] ||
    Package[prefix + 'semantic']
    // ...

  AccountsReact.components = components
})

export default AccountsReact
