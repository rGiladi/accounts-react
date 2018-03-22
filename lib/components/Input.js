import React from 'react'

const InputField = props => {
  const {
    _id,
    label,
    inputType,
    onChange,
    placeholder,
    focusInput,
    defaults,
    error
  } = props

  return (
    <div>

      {defaults.showLabels && <label>{label}</label>}
      <br />

      <input
        type={inputType}
        onChange={(e) => onChange(e, _id)}
        placeholder={defaults.showPlaceholders ? placeholder : ''}
        autoFocus={focusInput}
      />

      <br />
      {error && <span style={{ color: 'red' }}>{error.errStr}</span>}

      <br />

    </div>
  )
}

export default InputField
