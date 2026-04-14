import { useState } from "react";
import { FaWind, FaTint, FaCompressArrowsAlt, FaEye } from "react-icons/fa";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import { useMap } from "react-leaflet";
import L from "leaflet";

const API = import.meta.env.VITE_API_URL;

function Wilayah() {
  const [kota, setKota] = useState("Banyuwangi");

  // untuk search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // untuk map
  const [geoData, setGeoData] = useState(null);
  const [mapCenter, setMapCenter] = useState([-8.2, 114.3]);

  // untuk cache cuaca
  const [cuacaCache, setCuacaCache] = useState({});

  // untuk load GeoJson
  const loadMapData = async (wilayah) => {
    try{
      // example
      const clean = wilayah.toLowerCase().split(",")[0].trim();

      const res = await fetch(`/maps/${clean}.geojson`);
      if(!res.ok) throw new Error("GeoJSON Tidak Ditemukan");

      const data = await res.json();
      setGeoData(data);
      // Default sementara
      setMapCenter([-8.2, 114.3]);

    } catch (err) {
      console.error("gagal load peta", err);
      setGeoData(null);
    }
    console.log("GeoJSON:", data);
  }

  // untuk interaksi hover di map
  const onEachFeature = (feature, layer) => {
    const namaWilayah = feature.properties.name || feature.properties.tags?.name || "Wilayah";

    layer.on({
      mouseover: async(e) => {
        // highlight
        e.target.setStyle({
          weight: 3, color: "#FF7800", fillOpacity: 0.5
        });
        // cek cache
        if(cuacaCache[namaWilayah]){
          layer.bindPopup(`
            <strong>${namaWilayah}</strong><br/>
            Suhu: ${data.suhu || "-"}°C<br/>
            Cuaca: ${data.kondisi || "-"}
            `).openPopup();
            return;
        }

        try{
          const res = await fetch(`${API}/api/cuaca?wilayah=${namaWilayah}`);
          const data = await res.json();

          // simpan ke cache
          setCuacaCache(prev => ({...prev, [namaWilayah]: data}));

          layer.bindPopup(`
            <strong>${namaWilayah}</strong><br/>
            Suhu: ${data.suhu || "-"}°C<br/>
            Cuaca: ${data.kondisi || "-"}
            `).openPopup();
        } catch {
          layer.bindPopup(`<strong>${namaWilayah}</strong><br/>Data tidak tersedia`).openPopup();
        }
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 2, color: "FFD700", fillOpacity: 0.2
        });
      }
    });
  };

  // untuk call api
  const searchLocation = async (value) => {
    setQuery(value);
    
    if (value.length < 2){
      setResults([]);
      setLoading(false);
      return;
    } try {
      setLoading(true);
    const res = await fetch(`${API}/api/location/search?q=${encodeURIComponent(value)}`,{
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });
    
    // console.log("Response status:", res.status);
    const data = await res.json();
    console.log("RESPONSE:", data);

    setResults(Array.isArray(data) ? data : data.data || []);
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
          onKeyDown={(e) => {
            if (e.key === "Enter"){
              const wilayahUtama = query.split(",")[0];
              setKota(wilayahUtama);
              loadMapData(wilayahUtama);
            }
          }}
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
                  key={loc.id || i}
                  style={{padding: "10px", cursor: "pointer", borderBottom: "0.5px solid #eee"}}
                  onMouseDown={() =>{
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
      <div className="map-box" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
        <MapContainer center={[-8.2, 114.3]} zoom={10} style={{ height: "100%", width: "100%"}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && (
            <GeoJSON 
            data={geoData} 
            onEachFeature={onEachFeature}
            style={{color: "FFD700", weight: 2, fillOpacity: 0.2}}
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