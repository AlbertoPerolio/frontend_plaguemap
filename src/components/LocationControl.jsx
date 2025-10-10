import { useEffect, useCallback } from "react"; // 🛑 IMPORTAR useCallback
import { useMap } from "react-leaflet";
import L from "leaflet";

// 🛑 ACEPTA UNA NUEVA PROP: onLocateReady (para devolver la función de geolocalizar)
function LocationControl({
  setNewMarkerPosition,
  setTemporaryMarker,
  setShowForm,
  onLocateReady, // 🛑 NUEVA PROP
}) {
  const map = useMap(); // 🚀 FUNCIÓN CENTRAL DE GEOLOCALIZACIÓN (MOVEMOS LA LÓGICA AQUÍ)

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      return alert("Geolocalización no soportada");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords; // 1. Mueve el centro del mapa

        map.setView([latitude, longitude], 15); // 2. NOTIFICA AL COMPONENTE PADRE (PlagueMap)

        const newPos = { lat: latitude, lng: longitude };

        if (setNewMarkerPosition) setNewMarkerPosition(newPos);
        if (setTemporaryMarker) setTemporaryMarker([latitude, longitude]);
        if (setShowForm) setShowForm(true);
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        alert(
          "No se pudo obtener la ubicación. Asegúrate de que los servicios de geolocalización estén activados."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, [map, setNewMarkerPosition, setTemporaryMarker, setShowForm]);

  useEffect(() => {
    // 🛑 DEVOLVEMOS LA FUNCIÓN AL PADRE UNA VEZ QUE EL MAPA ESTÁ LISTO
    if (onLocateReady) {
      onLocateReady(handleGeolocate);
    }

    const locateControl = L.control({ position: "topleft" });
    locateControl.onAdd = () => {
      const btn = L.DomUtil.create("button", "btn-locate");
      btn.innerHTML = "📍";

      btn.onclick = handleGeolocate; // 🛑 EL BOTÓN LLAMA A LA NUEVA FUNCIÓN
      return btn;
    };
    locateControl.addTo(map);

    return () => {
      map.removeControl(locateControl);
    };
  }, [map, onLocateReady, handleGeolocate]);

  return null;
}

export default LocationControl;
