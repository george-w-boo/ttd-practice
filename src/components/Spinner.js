import React from "react";

const Spinner = () => {
  return (
    <div class="d-flex justify-content-center">
      <div className="spinner-border m-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
