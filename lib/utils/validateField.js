import AccountsReact from '../AccountsReact'
/* Validate fields specified in AccountsReact.config */

const validateField = (fields, fieldObj, value, model, errorsArray = []) => {
  const {
    _id,
    required,
    func,
    re,
    minLength,
    maxLength,
    errStr
  } = fieldObj

  // Validate through a function provided by the user
  if (func) {
    return func(fields, fieldObj, value, model, errorsArray)
  }

  // Make sure that a value exists and required is not false to continue validation
  if (!value) {
    if (required === false) {
      // Do nothing
      return true
    } else {
      errorsArray.push({ _id, errStr: errStr || `${_id} is required` })
      return
    }
  }

  // Validate by regular exporession
  if (re && !re.test(value)) {
    errorsArray.push({ _id, errStr: errStr || `${value} is not valid as ${_id}` })
    return
  }

  // Validate min length
  if (minLength && minLength > value.length) {
    errorsArray.push({ _id, errStr: errStr || `${_id} length must be at least ${minLength} characters` })
    return
  }

  // Validate max length
  if (maxLength && maxLength < value.length) {
    errorsArray.push({ _id, errStr: errStr || `${_id} length must be no more than ${maxLength} characters` })
    return
  }

  return true
}

/* Validate fields on change events when validateOnChange or validateOnFocusOut are set to true */

const validateOnChange = (e, _id, fields, model, errors) => {
  const { type, target } = e
  const { continuousValidation, negativeValidation } = AccountsReact.config

  // Check the conditions match settings
  if ((type === 'blur' && negativeValidation) || (type === 'change' && continuousValidation)) {
    const fieldObj = fields.find(f => f._id === _id)

    if (!validateField(fields, fieldObj, target.value, model, errors)) {
      return errors
    } else {
      // Make sure error object for the field doesn't stay after it is valid
      return errors.filter(err => err._id !== _id)
    }
  }
}

export {
  validateField as default,
  validateOnChange
}
