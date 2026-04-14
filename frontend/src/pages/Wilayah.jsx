import { useState, useEffect } from "react";
import { FaWind, FaTint, FaCompressArrowsAlt, FaEye } from "react-icons/fa";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Wilayah() {
  const [kota, setKota] = useState("Banyuwangi");
  const [geoData, setGeoData] = useState(null);
  const [mapCenter, setMapCenter] = useState([-8.2192, 114.3691]);

  // search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // SEARCH API
  // =========================
  const searchLocation = async (value) => {
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/location/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();

      setResults(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error Search Location:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD GEOJSON
  // =========================
  const loadGeoJSON = async (wilayah) => {
    try {
      // sementara masih hardcode Banyuwangi
      const res = await fetch("/geojson/banyuwangi_desa.geojson");
      const data = await res.json();
      setGeoData(data);
    } catch (err) {
      console.error("Gagal load GeoJSON:", err);
    }
  };

  // load awal
  useEffect(() => {
    loadGeoJSON("Banyuwangi");
  }, []);

  // =========================
  // STYLE MAP
  // =========================
  const styleDefault = {
    color: "#3388ff",
    weight: 1,
    fillOpacity: 0.1,
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: "#000",
      fillOpacity: 0.5,
    });
  };

  const resetHighlight = (e) => {
    e.target.setStyle(styleDefault);
  };

  const onEachFeature = (feature, layer) => {
    const nama = feature.properties.name || "Wilayah";

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });

    layer.bindTooltip(`
      <strong>${nama}</strong><br/>
      Cuaca: Cerah ☀️<br/>
      Suhu: 30°C
    `);
  };

  return (
    <div className="wilayah-page">

      {/* SEARCH */}
      <div className="wilayah-filterr" style={{ position: "relative", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={query}
          onChange={(e) => searchLocation(e.target.value)}
          onBlur={() => setTimeout(() => setResults([]), 200)}
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "8px",
            border: "0.5px solid #ccc",
          }}
        />

        {loading && <div style={{ fontSize: "14px" }}>Mencari lokasi...</div>}

        {!loading && results.length > 0 && (
          <div
            style={{
              position: "absolute",
              background: "#fff",
              border: "0.5px solid #ddd",
              width: "80%",
              marginTop: "5px",
              borderRadius: "8px",
              zIndex: 10,
            }}
          >
            {results.map((loc, i) => (
              <div
                key={loc.id || i}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "0.5px solid #eee",
                }}
                onMouseDown={() => {
                  setKota(loc.title);
                  setQuery(`${loc.title}, ${loc.subtitle}`);
                  setResults([]);

                  // pindahin map
                  if (loc.position) {
                    setMapCenter([loc.position.lat, loc.position.lon]);
                  }

                  // load batas wilayah
                  loadGeoJSON(loc.title);
                }}
              >
                <strong>{loc.title}</strong><br />
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
        <div className="info-card"><FaWind /><h4>Angin</h4><p>10 km/jam</p></div>
        <div className="info-card"><FaTint /><h4>Kelembapan</h4><p>70%</p></div>
        <div className="info-card"><FaCompressArrowsAlt /><h4>Tekanan</h4><p>1012 hPa</p></div>
        <div className="info-card"><FaEye /><h4>Jarak Pandang</h4><p>10 km</p></div>
      </div>

      {/* MAP */}
      <div className="map-box">
        <MapContainer
          center={mapCenter}
          zoom={10}
          style={{ height: "300px", borderRadius: "15px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {geoData && (
            <GeoJSON
              data={geoData}
              style={styleDefault}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
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