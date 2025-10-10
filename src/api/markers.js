import axios from "./axios";

// Peticiones de marcadores (usa cookie httpOnly, no token manual)
export const getMarkersRequest = () => axios.get("/markers");
export const createMarkerRequest = (markerData) =>
  axios.post("/markers", markerData);
export const updateMarkerRequest = (markerId, markerData) =>
  axios.put(`/markers/${markerId}`, markerData);
export const approveMarkerRequest = (markerId) =>
  axios.put(`/markers/${markerId}/approve`);
export const deleteMarkerRequest = (markerId) =>
  axios.delete(`/markers/${markerId}`);
