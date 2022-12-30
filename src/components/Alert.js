import React from "react";
import { useAsyncError } from "react-router-dom";

const Alert = ({
  type = "danger",
  textContent = "Something went wrong...",
}) => {
  const error = useAsyncError();
  if (error?.response?.data.message) textContent = error.response.data.message;

  return (
    <div className={`alert alert-${type}`}>
      {type === "danger" ? "Error: " : ""}
      {textContent}
    </div>
  );
};

export default Alert;
