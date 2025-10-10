import axios from "./axios";

// Petición para obtener todos los marcadores (pública)
export const getMarkersRequest = () => axios.get("/markers");

// Petición para crear un nuevo marcador
// Petición para crear un nuevo marcador
export const createMarkerRequest = (markerData) =>
  axios.post("/markers", markerData, { withCredentials: true });

// Petición para actualizar un marcador
export const updateMarkerRequest = (markerId, markerData) =>
  axios.put(`/markers/${markerId}`, markerData, { withCredentials: true });

// Petición para aprobar un marcador (solo admin)
export const approveMarkerRequest = (markerId) =>
  axios.put(`/markers/${markerId}/approve`, {}, { withCredentials: true });

// Petición para eliminar un marcador
export const deleteMarkerRequest = (markerId) =>
  axios.delete(`/markers/${markerId}`, { withCredentials: true });
