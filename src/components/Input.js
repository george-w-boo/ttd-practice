import React from 'react'

const Input = ({id, label, type, onChange, value, helpText }) => {
  return (
    <div className="mb-3">
    <label className="form-label" htmlFor={id}>{label}</label>
    <input
      className="form-control"
      id={id}
      type={type}
      onChange={onChange}
      value={value}
      aria-describedby="usernameHelp"
    />
    <div id="usernameHelp" className="form-text">{helpText}</div>
  </div>
  )
}

export default Input;
