import AccountsReact from '../../AccountsReact'

/* Extract default settings from AccountsReact */

const getDefaults = function (currentState) {
  return {
    ...AccountsReact.config.texts,
    ...AccountsReact.config,
    fields: AccountsReact.config.fields[currentState]
  }
}

export default getDefaults
