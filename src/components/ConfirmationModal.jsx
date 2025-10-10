import React from "react";
import "../styles/ConfirmationModal.css"; // Asegúrate de que este archivo CSS existe

function ConfirmationModal({ message, isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  // Maneja la confirmación y cierra el modal
  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Cerrar después de confirmar
  };

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="modal-actions">
          <button
            className="modal-button confirm-button"
            onClick={handleConfirm}
          >
            Confirmar
          </button>
          <button className="modal-button cancel-button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
