import { useState } from "react";
import { FaWind, FaTint, FaCompressArrowsAlt, FaEye } from "react-icons/fa";


function Wilayah() {
  const [kota, setKota] = useState("Banyuwangi");

  return (
    <div className="wilayah-page">

      {/* FILTER */}
      <div className="wilayah-filter">
        <select onChange={(e) => setKota(e.target.value)}>
          <option>Banyuwangi</option>
          <option>Surabaya</option>
          <option>Jakarta</option>
        </select>
      </div>

      {/* HERO */}
      <div className="wilayah-hero">
        <h1>{kota}</h1>
        <h2>30°C</h2>
        <p>Cerah ☀️</p>
      </div>

      {/* INFO */}
      <div className="wilayah-grid">
        <div className="info-card">
          <FaWind />
          <h4>Angin</h4>
          <p>10 km/jam</p>
        </div>

        <div className="info-card">
          <FaTint />
          <h4>Kelembapan</h4>
          <p>70%</p>
        </div>

        <div className="info-card">
          <FaCompressArrowsAlt />
          <h4>Tekanan</h4>
          <p>1012 hPa</p>
        </div>

        <div className="info-card">
          <FaEye />
          <h4>Jarak Pandang</h4>
          <p>10 km</p>
        </div>
      </div>

      {/* GRAFIK */}
      <div className="chart-box">
        <h3>Grafik Suhu</h3>
        <div className="chart">
          {[20, 25, 30, 28, 27].map((val, i) => (
            <div key={i} style={{ height: val * 3 }} className="bar"></div>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="map-box">
        <iframe
          src="https://www.google.com/maps?q=-8.2,114.3&z=10&output=embed"
          width="100%"
          height="300"
          style={{ border: "none", borderRadius: "15px" }}
        />
      </div>

      {/* PERINGATAN */}
      <div className="peringatan-box">
        <h3>⚠️ Peringatan Wilayah</h3>
        <p>Potensi hujan lebat disertai petir.</p>
      </div>

    </div>
  );
}

export default Wilayah;