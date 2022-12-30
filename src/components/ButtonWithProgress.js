import React from "react";

function ButtonWithProgress({ isDisabled, isLoading, onClick, text }) {
  return (
    <button
      className="btn btn-primary"
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm" role="status"></span>
      )}
      {text}
    </button>
  );
}

export default ButtonWithProgress;
