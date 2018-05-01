import './setup'

Meteor.startup(() => {
  /* Load tests only after meteor's startup to ensure the package has loaded entirley */
  require('./_client/forms')
})
