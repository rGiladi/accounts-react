import React from 'react'
import { Accounts } from 'meteor/accounts-base'
import AccountsReact from '../AccountsReact'

class SocialButtons extends React.Component {

  render () {
    const services = Accounts.oauth.serviceNames()
    const { SubmitField } = AccountsReact.components
    return services && services.map((service, i) => {

      return (
        <SubmitField
          key={i}
          onClick={() => this.loginWith(service)}
          social={service}
        />
      )
    })
  }

  loginWith = service => {
    let _service = service[0].toUpperCase() + service.substr(1)

    if (service === 'meteor-developer') {
      _service = 'MeteorDeveloperAccount'
    }

    const options = AccountsReact.config.oauth[service] || {}
    Meteor['loginWith' + _service](options, err => {
      if (!err) {
        alert('logged In!')
      }
    })
  }
}

export default SocialButtons
