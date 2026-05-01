import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoords(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function LocationPicker({ setCoords }) {
  return (
    <MapContainer
      center={[23.8103, 90.4125]} // default (Dhaka)
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      className="rounded-xl mt-3"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker setCoords={setCoords} />
    </MapContainer>
  );
}

export default LocationPicker;