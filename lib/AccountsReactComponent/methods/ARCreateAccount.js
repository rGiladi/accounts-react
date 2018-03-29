import { Accounts } from 'meteor/accounts-base'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import AccountsReact from '../../AccountsReact'
import validateField from '../../utils/validateField'


const ARCreateAccount = new ValidatedMethod({
  name: 'ARCreateAccount',
  validate: ({ username, email, password, ...profile }) => {
    /* This validation runs on both client and server */

    if (Meteor.userId()) {
      throw new Meteor.Error('Error', 'Already logged in')
    }

    let signupFields = AccountsReact.config.fields.signUp

    // Remove password confirmation if not set
    if (!AccountsReact.config.confirmPassword) {
      signupFields = signupFields.filter(f => f._id !== 'confirmPassword')
    }

    // Check that recaptcha token is included if necessary
    if (AccountsReact.config.showReCaptcha && !profile.tempReCaptchaResponse) {
      throw new Meteor.Error('ReCaptchaError', AccountsReact.config.texts.errors.captchaVerification)
    }

    const newUser = {
      username,
      email,
      password,
      ...profile // Flat profile object so each key:value pair gets validated as a field
    }

    let errors = []
    signupFields.forEach(field => {
      validateField(signupFields, field, newUser[field._id], newUser, errors)
    })

    if (errors.length > 0) {
      throw new Meteor.Error('ARCreateAccount', errors)
    }
  },
  run (newUser) {
    const {
      username,
      email,
      password,
      ...profile
    } = newUser

    const userObject = {
      username,
      email,
      password,
      profile
    }

    // Unnecessary fields (used only for validation)
    delete userObject.profile.passwordConfirmation

    if (!username) {
      delete userObject.username
    } else if (!email) {
      delete userObject.email
    }
    
    // Create the user on the server only!
    if (Meteor.isServer) {
      if (AccountsReact.config.showReCaptcha) {
        const res = HTTP.post('https://www.google.com/recaptcha/api/siteverify', {
          params:  {
            secret: AccountsReact.config.reCaptcha.secretKey || Meteor.settings.reCaptcha.secretKey,
            response: userObject.profile.tempReCaptchaResponse,
            remoteip: this.connection.clientAddress
          }
        }).data

        if (!res.success) {
          throw new Meteor.Error('ReCaptchaError', AccountsReact.config.texts.errors.captchaVerification)
        }

        delete userObject.profile.tempReCaptchaResponse
      }

      const userId = Accounts.createUser(userObject)

      if (!userId) {
        // safety belt. createUser is supposed to throw on error. send 500 error
        // instead of sending a verification email with empty userid.

        /* it was taken directly from useraccounts package */
        throw new Error('createUser failed to insert new user')
      }

      if (userObject.email && AccountsReact.config.sendVerificationEmail) {
        Accounts.sendVerificationEmail(userId, userObject.email)
      }
    }
  }
})

export default ARCreateAccount
