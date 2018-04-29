import { validateOnChange } from '../../utils/validateField'

/* Define a change handler for fields */

function handleInputChange (e, _id) {
  // *this* is bound to calling components

  // Check if e is already a string value or an event object
  const value = typeof e === 'string' ? e : e.target.value

  if (fieldChangedAtLeastOnce(this.state, _id, value)) return

  const {
    currentState,
    defaults
  } = this.props

  const fields = defaults.fields[currentState]
  // if e is a string it means that it's a default value and doesn't need to pass validation
  if (typeof e !== 'string') {
    const errors = validateOnChange(e, _id, fields, this.getModel(), [...this.state.errors])

    if (errors) {
      this.setState({ errors })
    }
  }
  this.setState({ [_id]: value })
}

function fieldChangedAtLeastOnce (state, _id, value) {
  return !state.hasOwnProperty(_id) && value === ''
}

export default handleInputChange
