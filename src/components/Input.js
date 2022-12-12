import React from "react";

const Input = ({ id, label, type, onChange, value, helpText }) => {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className={`form-control ${helpText ? "is-invalid" : ""}`}
        id={id}
        type={type}
        onChange={onChange}
        value={value}
        defaultValue={value}
        aria-describedby="usernameHelp"
      />
      {helpText && <span className="invalid-feedback">{helpText}</span>}
    </div>
  );
};

export default Input;
