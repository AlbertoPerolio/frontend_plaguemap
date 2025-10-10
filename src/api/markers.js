import axios from "./axios";

// Petición para obtener todos los marcadores (pública)
export const getMarkersRequest = () => axios.get("/markers");

// Petición para crear un nuevo marcador
export const createMarkerRequest = (markerData, token) =>
  axios.post("/markers", markerData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

// Petición para actualizar un marcador
export const updateMarkerRequest = (markerId, markerData, token) =>
  axios.put(`/markers/${markerId}`, markerData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

// Petición para aprobar un marcador (solo admin)
export const approveMarkerRequest = (markerId, token) =>
  axios.put(
    `/markers/${markerId}/approve`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );

// Petición para eliminar un marcador
export const deleteMarkerRequest = (markerId, token) =>
  axios.delete(`/markers/${markerId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
