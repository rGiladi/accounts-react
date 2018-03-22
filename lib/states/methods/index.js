/* globals Meteor: true */
import { Accounts } from 'meteor/accounts-base'

// Create user
export const createUser = (newUser, callback) => {
  Meteor.call('createUser', newUser, callback)
}

// Login
export const login = (username, email, password, callback) => {
  Meteor.loginWithPassword(username || email, password, callback)
}

// Forgot password
export const forgotPassword = (email, callback) => {
  Accounts.forgotPassword({ email }, callback)
}

// Change password
export const changePassword = (oldPassword, newPassword, callback) => {
  Accounts.changePassword(oldPassword, newPassword, callback)
}
