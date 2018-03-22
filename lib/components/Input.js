import React from 'react'

const InputField = props => {
  const {
    _id,
    label,
    inputType,
    focusInput,
    onChange,
    error
  } = props

  return (
    <div>

      <label>{label}</label>
      <br />
      <input
        type={inputType}
        onChange={(e) => onChange(e, _id)}
        autoFocus={focusInput}
      />
      <br />
      {error && <span style={{ color: 'red' }}>{error.errStr}</span>}
      <br />

    </div>
  )
}

export default InputField
