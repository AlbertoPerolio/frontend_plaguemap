import { useMapEvents } from "react-leaflet";

function MarkerClickHandler({
  user,
  setShowForm,
  setNewMarkerPosition,
  setTemporaryMarker,
}) {
  useMapEvents({
    click(e) {
      if (user && (user.role === "user" || user.role === "admin")) {
        setNewMarkerPosition(e.latlng);
        setTemporaryMarker(e.latlng);
        setShowForm(true);
      }
    },
  });
  return null;
}

export default MarkerClickHandler;
