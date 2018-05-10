import './setup'

Meteor.startup(() => {
  /* Load tests only after meteor's startup to ensure the package has been entirley loaded */
  require('./_client/forms')
})
