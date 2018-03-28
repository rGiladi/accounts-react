
// Generic getModel for the state components

const getModel = function () {
  /* Get only form values from state, "this" is binded to the state's class */

  const stateKeys = Object.keys(this.state)
  const model = stateKeys
    .filter(key => this.defaults.fields.find(f => f._id === key)) // Only keys in the defined fields array
    .reduce((obj, key) => { // Create a new object
      obj[key] = this.state[key]
      return obj
    }, {})

  return model
}

export default getModel
