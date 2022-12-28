const Modal = ({ title, body = "", leftBtnText, rightBtnText }) => {
  return (
    <div
      className="bg-black bg-opacity-50 modal d-block show"
      tabIndex="-1"
      data-testid="modal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {leftBtnText}
            </button>
            <button type="button" className="btn btn-primary">
              {rightBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
