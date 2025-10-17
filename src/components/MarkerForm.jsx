import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// 🚨 Importar el Modal de Confirmación
import ConfirmationModal from "./ConfirmationModal";

function MarkerForm({
  position,
  onClose,
  onAddMarker,
  onUpdateMarker,
  markerToEdit,
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🚨 Estado para controlar el modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    actionType: null, // 'create' o 'update'
    dataToConfirm: null, // Datos a enviar a la API
  });

  const lat = position ? position.lat : "";
  const lng = position ? position.lng : "";
  const isEditing = !!markerToEdit;

  const opcionesTitulo = [
    "Microbasurales",
    "Terrenos Baldíos",
    "Chatarra",
    "Recipientes con Agua",
    "Acumulación de Agua",
  ];

  useEffect(() => {
    if (markerToEdit) {
      setTitle(markerToEdit.title);
      setDescription(markerToEdit.description);
    } else {
      setTitle("");
      setDescription("");
      setImage(null);
    }
  }, [markerToEdit]);

  // Función que ejecuta la llamada a la API después de la confirmación
  const executeApiAction = async (dataToSubmit) => {
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        // ACTUALIZAR marcador
        await onUpdateMarker(markerToEdit.idplague, dataToSubmit);
      } else {
        // CREAR marcador
        // Se asegura de que haya imagen al crear, según tu lógica original
        if (!image) {
          throw new Error("Por favor, sube una imagen para crear un marcador.");
        }
        await onAddMarker(dataToSubmit);
      }
      onClose(); // Cierra el formulario tras el éxito
    } catch (err) {
      console.error(err);
      setError("Error al guardar el marcador. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
    // Cierra el modal de confirmación
    setConfirmModal({
      isOpen: false,
      message: "",
      actionType: null,
      dataToConfirm: null,
    });
  };

  // Función que prepara y envía los datos al modal
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones previas
    if (!opcionesTitulo.includes(title) || !position) {
      setError(
        "Por favor, selecciona un título válido y una ubicación en el mapa."
      );
      return;
    }
    if (!isEditing && !image) {
      setError("Se requiere una imagen para crear un nuevo reporte.");
      return;
    }

    // 2. Construir los datos para la API (usando FormData por la imagen)
    let dataToSubmit;
    let message;

    if (isEditing) {
      // Editar
      message = "¿Estás seguro de guardar los cambios en este reporte?";

      dataToSubmit = new FormData();
      dataToSubmit.append("title", title);
      dataToSubmit.append("description", description);
      if (image) {
        dataToSubmit.append("image", image);
      }
      // Si no se envía imagen, el backend debe manejar la actualización sin cambiar la imagen.
    } else {
      // Crear
      message =
        "¿Estás seguro de crear este nuevo reporte? Los reportes pasan a estado PENDIENTE.";

      dataToSubmit = new FormData();
      dataToSubmit.append("title", title);
      dataToSubmit.append("description", description);
      dataToSubmit.append("id_reg", user.id_reg);
      dataToSubmit.append("status", "pendiente");
      dataToSubmit.append("lat", lat);
      dataToSubmit.append("lng", lng);
      dataToSubmit.append("image", image);
    }

    // 3. Abrir el modal
    setConfirmModal({
      isOpen: true,
      message: message,
      actionType: isEditing ? "update" : "create",
      dataToConfirm: dataToSubmit, // Guardamos el FormData aquí
    });
  };

  // 🚨 Función llamada por el ConfirmationModal al presionar "Confirmar"
  const handleConfirm = () => {
    if (confirmModal.dataToConfirm) {
      executeApiAction(confirmModal.dataToConfirm);
    }
  };

  // 🚨 Función llamada por el ConfirmationModal al presionar "Cancelar"
  const handleCancel = () => {
    setConfirmModal({
      isOpen: false,
      message: "",
      actionType: null,
      dataToConfirm: null,
    });
  };

  return (
    <div className="marker-form">
      <h3>{isEditing ? "Editar marcador" : "Nuevo marcador"}</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="titulo">Sitio critico</label>
        <select
          id="titulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        >
          <option value="">Seleccione uno de los sitios criticos</option>
          {opcionesTitulo.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>

        <input
          placeholder="Ingrese una Descripción de la zona o de lo que se ve en la imagen"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        {isEditing && !image && (
          <p className="info-text">
            Sube un archivo para reemplazar la imagen actual.
          </p>
        )}

        <p>Latitud: {position ? lat.toFixed(4) : "Selecciona una ubicación"}</p>
        <p>
          Longitud: {position ? lng.toFixed(4) : "Selecciona una ubicación"}
        </p>

        <button type="submit" disabled={loading || !position}>
          {loading ? "Cargando..." : isEditing ? "Guardar cambios" : "Agregar"}
        </button>
        <button type="button" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {/* 🚨 RENDERIZAR EL MODAL */}
      <ConfirmationModal
        message={confirmModal.message}
        isOpen={confirmModal.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default MarkerForm;
