import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

// DATA ZONA
const geoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        nama: "Perairan Jakarta",
        cuaca: "Hujan Ringan",
        gelombang: "0.5 m",
        angin: "5 knot",
        arus: "0.8 cm/det",
        status: "Aman"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.6, -6.1],
          [107.0, -6.1],
          [107.0, -6.4],
          [106.6, -6.4],
          [106.6, -6.1]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        nama: "Selat Bali",
        cuaca: "Cerah",
        gelombang: "2.5 m",
        angin: "15 knot",
        arus: "1.5 cm/det",
        status: "Waspada"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [114.8, -8.2],
          [115.4, -8.2],
          [115.4, -8.7],
          [114.8, -8.7],
          [114.8, -8.2]
        ]]
      }
    },
    {
    type: "Feature",
    properties: {
     nama: "Laut Jawa",
     cuaca: "Badai",
     gelombang: "4.0 m",
     angin: "25 knot",
     arus: "2.5 cm/det",
     status: "Bahaya"
  },
  geometry: {
    type: "Polygon",
    coordinates: [[
      [110, -5],
      [111, -5.3],
      [112, -5.1],
      [113, -5.8],
      [113.5, -6.5],
      [112.5, -7],
      [111.5, -6.8],
      [110.5, -6],
      [110, -5]
    ]]
  }
}
    
  ]
};

// WARNA STATUS
const getColor = (status) => {
  if (status === "Aman") return "#22c55e";
  if (status === "Waspada") return "#facc15";
  if (status === "Bahaya") return "#ef4444";
};

function Maritim() {

  const mapRef = useRef();

  const [selected, setSelected] = useState(
    geoData.features[0].properties
  );

  const [search, setSearch] = useState("");

  return (
    <div className="maritim-container">

      {/* HEADER */}
      <div className="maritim-header">
        <h1>Cuaca Maritim</h1>

        <input
          type="text"
          placeholder="Cari wilayah..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="maritim-search"
        />
      </div>

      {/* MAP */}
      <div className="map-wrapper">

        <MapContainer
          center={[-2.5,118]}
          zoom={5}
          whenCreated={(map)=> mapRef.current = map}
          style={{ height:"500px", width:"100%", borderRadius:"15px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

          <GeoJSON
            data={geoData}
            style={(feature)=>({
              color: getColor(feature.properties.status),
              fillColor: getColor(feature.properties.status), // 🔥 WAJIB
              fillOpacity: 0.7, 
            weight: 2
          })}
            onEachFeature={(feature, layer)=>{

              layer.on("mouseover", ()=>{
                layer.setStyle({ fillOpacity: 0.8 });
              });

              layer.on("mouseout", ()=>{
                layer.setStyle({ fillOpacity: 0.5 });
              });

              layer.on("click", ()=>{
                setSelected(feature.properties);

                const coords = feature.geometry.coordinates[0][0];
                mapRef.current.setView([coords[1], coords[0]], 7);
              });

              layer.bindTooltip(feature.properties.nama);
            }}
          />

        </MapContainer>

        {/* CARD */}
        <div className="map-card">

          <span className="card-header">
            28 Mar 2026, 03.00 WIB
          </span>

          <h3 className="card-title">
            {selected.nama}
          </h3>

          <div className="card-cuaca">
            🌧️ {selected.cuaca}
          </div>

          <div className="card-detail">

            <div className="card-row">
              <span>🌊 Gelombang</span>
              <b>{selected.gelombang}</b>
            </div>

            <div className="card-row">
              <span>💨 Angin</span>
              <b>{selected.angin}</b>
            </div>

            <div className="card-row">
              <span>🌊 Arus</span>
              <b>{selected.arus}</b>
            </div>

          </div>

          <p className="status-text" style={{color:getColor(selected.status)}}>
            {selected.status}
          </p>

          <button className="btn-detail">
            Lihat Detail
          </button>

        </div>

      </div>

      {/* LIST */}
      <div className="list-container">
        {geoData.features
          .filter(item =>
            item.properties.nama
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((item,i)=>(
            <div
              key={i}
              className="list-item"
              onClick={()=>{
                setSelected(item.properties);

                const coords = item.geometry.coordinates[0][0];
                mapRef.current.setView([coords[1], coords[0]], 7);
              }}
            >
              🌊 {item.properties.nama}
            </div>
          ))}
      </div>

    </div>
  );
}

export default Maritim;