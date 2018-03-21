import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import AccountsReact from '../../AccountsReact'
import validateField from '../../utils/validateField'

// By default accounts creation is allowed only on the server

const ARCreateAccount = new ValidatedMethod({
  name: 'ARCreateAccount',
  validate: (newUser) => {
    /* This validation runs on both client and server */

    if (Meteor.userId()) {
      throw new Meteor.Error('Error', 'Already logged in')
    }

    const {
      fields,
      confirmPassword
    } = AccountsReact.config

    let signupFields = fields.signUp

    // Remove password confirmation if not set
    if (!confirmPassword) {
      signupFields = signupFields.filter(f => f._id !== 'confirmPassword')
    }

    let errors = []
    signupFields.forEach(field => {
      validateField(signupFields, field, newUser[field._id], newUser, errors)
    })

    // Throw exception if errors were found
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

    const { identifyBy, sendVerificationEmail } = AccountsReact.config

    switch (identifyBy) {
      case 'USERNAME':
        delete userObject.email
        break

      case 'EMAIL':
        delete userObject.username
        break

      default:
        // USERNAME_AND_EMAIL
    }

    // Create the user on the server only!
    if (Meteor.isServer) {
      const userId = Accounts.createUser(userObject)

      if (!userId) {
        // safety belt. createUser is supposed to throw on error. send 500 error
        // instead of sending a verification email with empty userid.

        /* it was taken directly from useraccounts package */
        throw new Error('createUser failed to insert new user')
      }

      // Send email
      if (userObject.email && sendVerificationEmail) {
        Accounts.sendVerificationEmail(userId, userObject.email)
      }
    }
  }
})

export default ARCreateAccount
