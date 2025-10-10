import React from "react";
import "../styles/ImageModal.css"; // 🚨 Necesitarás este archivo CSS

const ImageModal = ({ imageUrl, onClose }) => {
  // Si no hay URL de imagen, no renderiza nada
  if (!imageUrl) return null;

  return (
    // El overlay (fondo oscuro)
    <div className="modal-overlay" onClick={onClose}>
      {/* El contenido del modal, evita que el clic en la imagen cierre el modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Ampliada" className="modal-image" />

        {/* Botón de cerrar */}
        <button className="modal-close" onClick={onClose}>
          &times; {/* Símbolo "x" de cierre */}
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
