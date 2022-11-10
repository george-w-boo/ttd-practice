import React from "react";

const Alert = ({
  type = "danger",
  textContent = "Something went wrong...",
}) => {
  return (
    <div className={`alert alert-${type}`}>
      {type === "danger" ? "Error: " : ""}
      {textContent}
    </div>
  );
};

export default Alert;
