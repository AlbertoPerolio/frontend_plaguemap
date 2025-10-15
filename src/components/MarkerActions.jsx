import React from "react";

const MarkerActions = ({ marker, user, onEdit, onDelete, onApprove }) => {
  if (!user) {
    return null;
  }

  // Compara la clave del usuario con la clave foránea del marcador
  const canModify = user.role === "admin" || user.id_reg === marker.id_reg;

  if (!canModify) {
    return null;
  }

  return (
    <div className="marker-actions">
      {/* Botón EDITAR: Llama a onEdit que espera el evento (e) del padre */}
      <button
        // Ahora el padre (MarkerPopup) se encarga de llamar a e.stopPropagation()
        onClick={onEdit}
      >
        Editar
      </button>

      {/* Botón ELIMINAR: Llama a onDelete que espera el evento (e) del padre */}
      <button
        // Ahora el padre (MarkerPopup) se encarga de llamar a e.stopPropagation()
        onClick={onDelete}
      >
        Eliminar
      </button>

      {/* Botón APROBAR (Solo Admin y Pendiente) */}
      {user.role === "admin" && marker.status === "pendiente" && (
        <button
          // Llama a onApprove que espera el evento (e) del padre
          onClick={onApprove}
        >
          Aprobar
        </button>
      )}
    </div>
  );
};

export default MarkerActions;
