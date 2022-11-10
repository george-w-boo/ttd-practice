import React from "react";

const Alert = ({
  type = "danger",
  textContent = "Something went wrong...",
}) => {
  return <div className={`alert alert-${type}`}>Error: {textContent}</div>;
};

export default Alert;
