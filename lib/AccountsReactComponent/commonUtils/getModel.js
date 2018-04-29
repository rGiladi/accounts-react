
/* Generic getModel for the state components */

function getModel () {
  /* Get only form values from state, "this" is binded to the state's class */

  const {
    currentState,
    defaults
  } = this.props

  const stateKeys = Object.keys(this.state)
  const fields = defaults.fields[currentState]
  const model = stateKeys
    .filter(key => fields.find(f => f._id === key)) // Only keys in the defined fields array
    .reduce((obj, key) => { // Create a new object
      obj[key] = this.state[key]
      return obj
    }, {})

  return model
}

export default getModel
