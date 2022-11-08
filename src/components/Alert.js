import React from "react";

const Alert = ({ type, textContent }) => {
  return <div className={`alert alert-${type}`}>{textContent}</div>;
};

export default Alert;
