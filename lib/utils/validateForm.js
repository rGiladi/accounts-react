import validateField from './validateField'

// Generic form validation for the state components

const validateForm = (model, context) => {
  let _errors = []

  // Validate login credentials on client, "loginWithPassword" method will validate on server.
  const { fields } = context.defaults
  fields.forEach(field => {
    validateField(fields, field, model[field._id], model, _errors)
  })

  if (_errors.length > 0) {
    context.setState({ errors: _errors })
    return false
  }
  return true
}

export default validateForm
