import React from 'react'
import PropTypes from 'prop-types'
import AccountsReact from 'meteor/meteoreact:accounts'

class SocialButtons extends React.Component {

  render () {
    const { services } = this.props

    return services && services.map((service, i) => {
      <button key={i} onClick={this.loginWith}>
        {service}
      </button>
    })
  }

  loginWith = service => {
    Meteor[`loginWith${service}`]()
  }
}

SocialButtons.propTypes = {
  services: PropTypes.array.isRequired
}

export default SocialButtons
