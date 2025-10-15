import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom/client";
import { Marker } from "react-leaflet";
import MarkerActions from "./MarkerActions";

// Aceptar el prop openImageModal
const MarkerPopup = forwardRef(
  (
    { marker, user, defaultIcon, onEdit, onDelete, onApprove, openImageModal },
    ref
  ) => {
    const markerRef = useRef();
    const rootRef = useRef(null);

    // Expone la función para cerrar el popup
    useImperativeHandle(ref, () => ({
      closePopup() {
        if (markerRef.current) {
          markerRef.current.closePopup();
        }
      },
    }));

    // Detiene la propagación del evento para las acciones del botón
    const handleActionClick = (e, actionCallback, id) => {
      // Detiene que el clic llegue al mapa y dispare el MapClickHandler
      e.stopPropagation();

      // Ejecuta la función principal (onEdit, onDelete, onApprove)
      actionCallback(id);
    };

    useEffect(() => {
      if (markerRef.current) {
        const popupContentNode = document.createElement("div");
        const root = ReactDOM.createRoot(popupContentNode);
        rootRef.current = root;

        root.render(
          <div>
            <b>{marker.title}</b>
            <br />
            {marker.description}
            <br />

            {/*la imagen: Detiene la propagación */}
            {marker.imgurl && (
              <img
                src={marker.imgurl}
                width="200"
                alt="Marcador"
                style={{ cursor: "pointer", maxWidth: "100%", height: "auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal(marker.imgurl);
                }}
              />
            )}

            <p>Estado: {marker.status}</p>
            <p>Latitud: {marker.lat}</p>
            <p>Longitud: {marker.lng}</p>

            <MarkerActions
              marker={marker}
              user={user}
              onEdit={(e) => handleActionClick(e, onEdit, marker.idplague)}
              onDelete={(e) => handleActionClick(e, onDelete, marker.idplague)}
              onApprove={(e) =>
                handleActionClick(e, onApprove, marker.idplague)
              }
            />
          </div>
        );

        markerRef.current.bindPopup(popupContentNode);

        return () => {
          if (rootRef.current) {
            rootRef.current.unmount();
          }
        };
      }
    }, [marker, user, onEdit, onDelete, onApprove, openImageModal]);

    return (
      <Marker
        position={[marker.lat, marker.lng]}
        icon={defaultIcon}
        ref={markerRef}
      />
    );
  }
);

export default MarkerPopup;
