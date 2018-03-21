/* globals Meteor: true */

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
  Meteor.call('forgotPassword', email, callback)
}
