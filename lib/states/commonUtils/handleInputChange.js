import { validateOnChange } from '../../utils/validateField'

// Generic handleInputChange for the state components

const handleInputChange = function (e, _id) {
  // *this* is bound to calling components

  // Check if e is already a string value or an event object
  const value = typeof e === 'string' ? e : e.target.value

  // check that the field has been changed at least once before update/validate
  if (!this.state.hasOwnProperty(_id) && value === '') return

  // if e is a string it means that it's a default value and doesn't need to pass validation
  if (typeof e !== 'string') {
    // will validate only if configured to do so.
    const errors = validateOnChange(e, _id, this.defaults.fields, this.getModel(), [...this.state.errors])

    if (errors) {
      this.setState({ errors })
    }
  }
  this.setState({ [_id]: value })
}

export default handleInputChange
