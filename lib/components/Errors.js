import React from 'react'
import PropTypes from 'prop-types'

const Errors = ({ errors }) => {
  return errors.map((err, i) => (
    <span
      key={i}
      style={{ color: 'red', marginBottom: '10px', display: 'block' }}>

      {err.errStr}

    </span>
  ))
}

Errors.propTypes = {
  errors: PropTypes.array.isRequired
}

export default Errors
