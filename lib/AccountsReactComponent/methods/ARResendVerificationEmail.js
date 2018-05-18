import { Accounts } from 'meteor/accounts-base'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { check } from 'meteor/check'
import AccountsReact from '../../AccountsReact'

// Based on https://github.com/meteor-useraccounts/core/blob/2e8986813b51f321f908d2f6211f6f81f76cd627/lib/server_methods.js#L124
const ARResendVerificationEmail = new ValidatedMethod({
  name: 'ARResendVerificationEmail',
  validate: ({ email }) => {
    /* This validation runs on both client and server */

    if (Meteor.userId()) {
      throw new Meteor.Error('Error', 'Already logged in')
    }

    check(email, String);
  },
  run ({ email }) {
    if (Meteor.isServer) {
      var user = Meteor.users.findOne({ "emails.address": email });

      // Send the standard error back to the client if no user exist with this e-mail
      if (!user) {
        throw new Meteor.Error('UserNotFound', AccountsReact.config.texts.errors.userNotFound);
      }

      try {
        Accounts.sendVerificationEmail(user._id);
      } catch (error) {
        if (error.error === 'disabled') {
          throw error;
        } else {
          // Handle error when email already verified
          // https://github.com/dwinston/send-verification-email-bug
          throw new Meteor.Error('UserAlreadyVerified', AccountsReact.config.texts.errors.userAlreadyVerified);
        }
      }
    }
  }
})

export default ARResendVerificationEmail
