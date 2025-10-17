import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate, useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import "../styles/PlagueMap.css";

import socket from "../api/socket";
import ImageModal from "../components/ImageModal";
import ConfirmationModal from "../components/ConfirmationModal";

import GeocoderControl from "../components/GeocoderControl";
import LocationControl from "../components/LocationControl";
import MarkerForm from "../components/MarkerForm";
import MarkerPopup from "../components/MarkerPopup";
import MapClickHandler from "../components/MapClickHandler";

import {
  getMarkersRequest,
  createMarkerRequest,
  updateMarkerRequest,
  deleteMarkerRequest,
  approveMarkerRequest,
} from "../api/markers";

// --- ICONOS PERSONALIZADOS ---
const MARKER_ICON_BASE =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img";

const approvedIcon = L.icon({
  iconUrl: `${MARKER_ICON_BASE}/marker-icon-2x-blue.png`,
  shadowUrl: `${MARKER_ICON_BASE}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pendingIcon = L.icon({
  iconUrl: `${MARKER_ICON_BASE}/marker-icon-2x-yellow.png`,
  shadowUrl: `${MARKER_ICON_BASE}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- CENTRADO DE MAPA DESDE QUERY ---
function MapCenteringLogic({ location }) {
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const latQuery = params.get("lat");
    const lngQuery = params.get("lng");

    if (latQuery && lngQuery) {
      const lat = parseFloat(latQuery);
      const lng = parseFloat(lngQuery);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 15);
        setTimeout(() => {
          navigate(location.pathname, { replace: true, state: location.state });
        }, 100);
      }
    }
  }, [location, map, navigate]);

  return null;
}

function PlagueMap() {
  const { user } = useAuth(); // contiene token
  const navigate = useNavigate();
  const location = useLocation();

  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [temporaryMarker, setTemporaryMarker] = useState(null);
  const [editingMarker, setEditingMarker] = useState(null);
  const popupRefs = useRef({});

  const [modalImage, setModalImage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    idplague: null,
    actionType: null,
    message: "",
  });

  const openImageModal = useCallback((imageUrl) => setModalImage(imageUrl), []);
  const closeImageModal = useCallback(() => setModalImage(null), []);

  const getFilteredMarkers = useCallback(
    (allMarkers) =>
      allMarkers.filter((m) =>
        !user
          ? m.status === "aprobado"
          : user.role === "admin"
          ? true
          : m.status === "aprobado" || m.id_reg === user.id_reg
      ),
    [user]
  );

  // --- FETCH MARKERS ---
  const fetchMarkers = useCallback(async () => {
    try {
      const response = await getMarkersRequest();
      setMarkers(response.data);
    } catch (error) {
      console.error("Error al obtener los marcadores:", error);
    }
  }, []);

  const token = user?.token; // token del usuario para todas las llamadas

  const handleGeolocateAndOpenForm = useCallback(() => {
    setEditingMarker(null);
    if (!navigator.geolocation) return alert("Geolocalización no soportada.");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (mapRef.current)
          mapRef.current.setView([newPos.lat, newPos.lng], 15);
        setNewMarkerPosition(newPos);
        setTemporaryMarker([newPos.lat, newPos.lng]);
        setShowForm(true);
      },
      () => {
        alert("No se pudo obtener la ubicación. Haz clic en el mapa.");
        setShowForm(true);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  useEffect(() => {
    const { action, idplague } = location.state || {};
    if (action === "edit" && idplague && markers.length > 0) {
      const markerToEdit = markers.find(
        (m) => Number(m.idplague) === Number(idplague)
      );

      if (markerToEdit) {
        const latToCenter = parseFloat(markerToEdit.lat);
        const lngToCenter = parseFloat(markerToEdit.lng);

        if (mapRef.current && !isNaN(latToCenter) && !isNaN(lngToCenter)) {
          mapRef.current.setView([latToCenter, lngToCenter], 15);
        }

        setEditingMarker(markerToEdit);
        setNewMarkerPosition({ lat: latToCenter, lng: lngToCenter });
        setTemporaryMarker([latToCenter, lngToCenter]);
        setShowForm(true);

        navigate(location.pathname + location.search, {
          replace: true,
          state: {},
        });
      }
    }

    if (action === "create") {
      handleGeolocateAndOpenForm();
      navigate(location.pathname + location.search, {
        replace: true,
        state: {},
      });
    }
  }, [markers, location, navigate, handleGeolocateAndOpenForm]);

  // --- SOCKET.IO ---
  useEffect(() => {
    const handleSocketUpdate = (payload) => {
      setMarkers((prev) => {
        const { action, marker, idplague } = payload;
        const isVisible = marker && getFilteredMarkers([marker]).length > 0;

        if (action === "deleted")
          return prev.filter((m) => m.idplague !== idplague);
        if (!isVisible)
          return prev.filter((m) => m.idplague !== marker?.idplague);

        if (["created", "approved", "updated"].includes(action)) {
          const index = prev.findIndex((m) => m.idplague === marker.idplague);
          if (index > -1) {
            const newMarkers = [...prev];
            newMarkers[index] = marker;
            return newMarkers;
          }
          return [...prev, marker];
        }
        return prev;
      });
    };

    socket.on("plague_report_update", handleSocketUpdate);
    return () => socket.off("plague_report_update", handleSocketUpdate);
  }, [getFilteredMarkers]);

  // --- ACCIONES ---
  const handleAddMarkerFromForm = async (data) => {
    try {
      await createMarkerRequest(data, token);
      setShowForm(false);
      setTemporaryMarker(null);
      fetchMarkers();
    } catch (error) {
      console.error("Error al crear marcador:", error);
    }
  };

  const handleUpdateMarker = async (id, data) => {
    try {
      await updateMarkerRequest(id, data, token);
      setEditingMarker(null);
      setShowForm(false);
      fetchMarkers();
    } catch (error) {
      console.error("Error al actualizar marcador:", error);
    }
  };

  const handleDelete = async (id) => {
    if (popupRefs.current[id]) popupRefs.current[id].closePopup();
    setConfirmModal({
      isOpen: true,
      idplague: id,
      actionType: "delete",
      message:
        "¿Estás seguro de eliminar este reporte? Esta acción es irreversible.",
    });
  };

  const handleApprove = async (id) => {
    if (popupRefs.current[id]) popupRefs.current[id].closePopup();
    setConfirmModal({
      isOpen: true,
      idplague: id,
      actionType: "approve",
      message: "¿Confirmas la aprobación de este reporte?",
    });
  };

  const confirmAction = async () => {
    const { idplague, actionType } = confirmModal;
    try {
      if (actionType === "delete") await deleteMarkerRequest(idplague, token);
      else if (actionType === "approve")
        await approveMarkerRequest(idplague, token);
      fetchMarkers();
    } catch (error) {
      console.error(`Error al ${actionType} marcador:`, error);
    }
    setConfirmModal({
      isOpen: false,
      idplague: null,
      actionType: null,
      message: "",
    });
  };

  const cancelAction = () =>
    setConfirmModal({
      isOpen: false,
      idplague: null,
      actionType: null,
      message: "",
    });

  const handleEdit = (id) => {
    if (popupRefs.current[id]) popupRefs.current[id].closePopup();
    const markerToEdit = markers.find((m) => m.idplague === id);
    if (markerToEdit) {
      setEditingMarker(markerToEdit);
      setNewMarkerPosition({
        lat: parseFloat(markerToEdit.lat),
        lng: parseFloat(markerToEdit.lng),
      });
      setShowForm(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setNewMarkerPosition(null);
    setTemporaryMarker(null);
    setEditingMarker(null);
  };

  return (
    <div className="plague-map-wrapper">
      <MapContainer
        center={[-22.2437, -63.7342]}
        zoom={15}
        className="map"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <MapCenteringLogic location={location} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeocoderControl />
        <LocationControl
          setNewMarkerPosition={setNewMarkerPosition}
          setTemporaryMarker={setTemporaryMarker}
          setShowForm={setShowForm}
        />
        <MapClickHandler
          user={user}
          setShowForm={setShowForm}
          setNewMarkerPosition={setNewMarkerPosition}
          setTemporaryMarker={setTemporaryMarker}
        />

        {temporaryMarker && (
          <Marker position={temporaryMarker} icon={defaultIcon} />
        )}

        {markers
          .filter((m) => getFilteredMarkers([m]).length > 0)
          .map((marker) => (
            <MarkerPopup
              key={marker.idplague}
              marker={marker}
              user={user}
              defaultIcon={
                marker.status === "pendiente" ? pendingIcon : approvedIcon
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              openImageModal={openImageModal}
              ref={(el) => (popupRefs.current[marker.idplague] = el)}
            />
          ))}
      </MapContainer>

      {showForm && (
        <MarkerForm
          position={newMarkerPosition}
          user={user}
          markerToEdit={editingMarker}
          onClose={handleFormClose}
          onAddMarker={handleAddMarkerFromForm}
          onUpdateMarker={handleUpdateMarker}
        />
      )}

      <ImageModal imageUrl={modalImage} onClose={closeImageModal} />

      <ConfirmationModal
        message={confirmModal.message}
        isOpen={confirmModal.isOpen}
        onConfirm={confirmAction}
        onCancel={cancelAction}
      />
    </div>
  );
}

export default PlagueMap;
