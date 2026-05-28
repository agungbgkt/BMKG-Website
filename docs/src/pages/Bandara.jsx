import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function Bandara() {

  const mapRef = useRef();
  const navigate = useNavigate();

  const dataBandara = [
    {
      id: 0,
      nama: "Soekarno Hatta - Jakarta",
      posisi: [-6.12, 106.65],
      cuaca: "Guntur"
    },
    {
      id: 1,
      nama: "Juanda - Surabaya",
      posisi: [-7.37, 112.78],
      cuaca: "Cerah"
    },
    {
      id: 2,
      nama: "Ngurah Rai - Bali",
      posisi: [-8.74, 115.17],
      cuaca: "Berawan"
    }
  ];

  const [selected, setSelected] = useState(dataBandara[0]);

  return (
    <div className="bandara-container">

      <h1>Cuaca Bandara</h1>

      {/* MAP */}
      <div className="map-wrapper">

        <MapContainer
          center={[-2.5,118]}
          zoom={5}
          whenCreated={(map)=> mapRef.current = map}
          style={{ height:"500px", width:"100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

          {dataBandara.map((item)=>(
            <Marker
              key={item.id}
              position={item.posisi}
              eventHandlers={{
                click: ()=>{
                  setSelected(item);
                  mapRef.current.setView(item.posisi, 7);
                }
              }}
            />
          ))}
        </MapContainer>

        {/* CARD */}
        <div className="map-card">
          <h3>{selected.nama}</h3>
          <p>⛈️ {selected.cuaca}</p>
        </div>

      </div>

      {/* LIST BAWAH */}
      <div className="bandara-list">

        <h2>Banyuwangi</h2>

        {dataBandara.map((item)=>(
          <div
            key={item.id}
            className="bandara-item"
            onClick={()=> navigate(`/bandara-detail/${item.id}`)}
          >
            ✈️ {item.nama}
            <span>→</span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Bandara;