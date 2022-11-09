import React from "react";

const Spinner = () => {
  console.log("spinner");
  return (
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
