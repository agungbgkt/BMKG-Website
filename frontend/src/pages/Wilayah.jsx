import { useState } from "react";
import { FaWind, FaTint, FaCompressArrowsAlt, FaEye } from "react-icons/fa";


function Wilayah() {
  const [kota, setKota] = useState("Banyuwangi");

  // untuk search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // untuk call api
  const searchLocation = async (value) => {
    setQuery(value);
    
    if (value.length < 2){
      setResults([]);
      setLoading(false);
      return;
    } try {
      setLoading(true);
    const res = await fetch(`http://localhost:8000/api/location/search?q=${encodeURIComponent(value)}`);
    const data = await res.json();
    setResults(data);
    } catch (error){
      console.error("Error Search Location:", error);
    } finally {
      setLoading(false);
    };
  };

  return (
    <div className="wilayah-page">

      {/* FILTER */}
      <div className="wilayah-filterr" style={{position: "relative", maxWidth: "400px"}}>
        {/* <select onChange={(e) => setKota(e.target.value)}>
          <option>Banyuwangi</option>
          <option>Surabaya</option>
          <option>Jakarta</option>
        </select> */}
        <input 
          type="text"
          placeholder="Cari lokasi..."
          value={query}
          onChange={(e) => searchLocation(e.target.value)}
          onBlur={() => setTimeout(() => setResults([]), 200)}
          style={{width: "80%", padding: "10px", borderRadius: "8px", border: "0.5px solid #ccc"}} />
        
        {loading && (
          <div style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
            Mencari lokasi...
          </div>
        )}
        {!loading && results.length > 0 && (
          <div
            style={{position: "absolute", background: "#fff", border: "0.5px solid #ddd", width: "80%", marginTop: "5px", borderRadius: "8px", zIndex: 10}}>
              {results.map((loc, i) => (
                <div
                  key={loc.id}
                  style={{padding: "10px", cursor: "pointer", borderBottom: "0.5px solid #eee"}}
                  onClick={() =>{
                    setKota(loc.title);
                    setQuery(`${loc.title}, ${loc.subtitle}`);
                    setResults([]);
                  }}>
                    <strong>{loc.title}</strong><br/>
                    <small>{loc.subtitle}</small>
                  </div>
              ))}
          </div>
        )}
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