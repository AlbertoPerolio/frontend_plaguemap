import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

const GeocoderControl = () => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();
    const geocoderControl = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder,
    }).addTo(map);

    geocoderControl.on("markgeocode", function (e) {
      const bbox = e.geocode.bbox;
      const poly = L.polygon([
        [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
        [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
        [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
        [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
      ]).addTo(map);
      map.fitBounds(poly.getBounds());
    });

    return () => {
      map.removeControl(geocoderControl);
    };
  }, [map]);

  return null;
};

export default GeocoderControl;
