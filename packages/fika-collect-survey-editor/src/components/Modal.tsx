import React from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        zIndex: 2000,
      }}
      tabIndex={-1}
    >
      <div
        className="modal-dialog"
        style={{
          minWidth: 300,
          maxWidth: 500,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-content bg-dark text-light">
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title mb-0">
              {title}
            </h2>
            {onClose && (
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={(event) => {
                  event.preventDefault();
                  onClose();
                }}
                aria-label="Close"
              />
            )}
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
