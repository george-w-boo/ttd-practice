import React from "react";

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border m-3" role="status" data-testid="spinner">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
