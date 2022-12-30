import ButtonWithProgress from "./ButtonWithProgress";

const Modal = ({
  title,
  leftBtnText = "No",
  rightBtnText = "Yes",
  onClicLeftBtn,
  onClickRightBtn,
  isLoading = false,
}) => {
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
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClicLeftBtn}
            >
              {leftBtnText}
            </button>
            <ButtonWithProgress
              type="button"
              className="btn btn-primary"
              onClick={onClickRightBtn}
              isLoading={isLoading}
              isDisabled={isLoading}
              text={rightBtnText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
