import { useState, useEffect, useCallback, useRef } from "react";
import { FaWind, FaTint, FaCompressArrowsAlt, FaEye } from "react-icons/fa";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API = import.meta.env.VITE_API_URL;

// Komponen untuk fit bounds
function FitBounds({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (geoData && geoData.features && geoData.features.length > 0) {
      const layer = L.geoJSON(geoData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20], animate: true, duration: 1 });
      }
    }
  }, [geoData, map]);

  return null;
}

function Wilayah() {
  const [kota, setKota] = useState("Banyuwangi");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoData, setGeoData] = useState(null);
  const [geoKecamatan, setGeoKecamatan] = useState(null);
  const [geoDesa, setGeoDesa] = useState(null);
  const [cuacaCache, setCuacaCache] = useState({});
  const [selectedSubtitle, setSelectedSubtitle] = useState("");
  const [selectedAdm4, setSelectedAdm4] = useState(null);
  const [hoveredAdm4, setHoveredAdm4] = useState(null);
  const [cuacaUtama, setCuacaUtama] = useState(null);
  const [activeKecamatan, setActiveKecamatan] = useState(null);
  const [selectedWilayahId, setSelectedWilayahId] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  
  const timeoutRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Format lokasi dari API
  const formatLocation = (loc) => {
    const title = loc.title || "";
    const subtitle = loc.subtitle || "";
    const parts = [title, ...subtitle.split(",").map(s => s.trim())];
    return {
      main: parts[0],
      sub: parts.slice(1).join(", "),
      fullParts: parts
    };
  };

  // Deteksi level administrasi
  const detectLevel = (subtitle) => {
    const parts = subtitle.toLowerCase().split(",").map(s => s.trim());
    if (parts.length >= 4) return "desa";
    if (parts.length >= 3) return "kecamatan";
    if (parts.length >= 2) return "kabupaten";
    return "provinsi";
  };

  // Ambil nama wilayah dari properties
  const getNamaWilayah = (props) => {
    return (
      props.NAME_4 ||
      props.NAME_3 ||
      props.NAME_2 ||
      props.WADMKC ||
      props.name ||
      ""
    );
  };

  // Ambil ID unik untuk wilayah
  const getWilayahId = (props) => {
    return (
      props.adm4 ||
      props.ADM4 ||
      props.id ||
      `${props.NAME_3 || ""}_${props.NAME_2 || ""}`.replace(/\s/g, "_")
    );
  };

  // Normalisasi string untuk perbandingan
  const normalize = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/kecamatan/g, "")
      .replace(/kabupaten/g, "")
      .replace(/kota/g, "")
      .replace(/desa/g, "")
      .replace(/kelurahan/g, "")
      .replace(/\s+/g, "")
      .trim();
  };

  // Load data GeoJSON
  const loadMapData = async (wilayah, level, subtitle, adm4 = null) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    
    try {
      const parts = subtitle.toLowerCase().split(",").map(s => s.trim());
      let kabupaten = parts.find(p => p.includes("kabupaten") || p.includes("kota"));

      if (!kabupaten && parts.length >= 2) {
        kabupaten = parts[parts.length - 2];
      }

      if (!kabupaten) {
        console.warn("Tidak dapat menentukan kabupaten");
        isUpdatingRef.current = false;
        return;
      }

      kabupaten = kabupaten
        .replace(/kabupaten/g, "")
        .replace(/kota/g, "")
        .trim()
        .replace(/\s+/g, "-");

      console.log("Loading map data for:", { wilayah, level, kabupaten, adm4 });

      // Fetch GeoJSON files
      const [kabRes, kecRes, desaRes] = await Promise.all([
        fetch(`/maps/jawatimur/${kabupaten}/${kabupaten}.geojson`),
        fetch(`/maps/jawatimur/${kabupaten}/kecamatan_${kabupaten}.json`),
        fetch(`/maps/jawatimur/${kabupaten}/desa_${kabupaten}.json`)
      ]);

      if (!kabRes.ok || !kecRes.ok || !desaRes.ok) {
        throw new Error("Data peta tidak ditemukan");
      }

      const kabData = await kabRes.json();
      const kecData = await kecRes.json();
      const desaData = await desaRes.json();

      const cleanWilayah = normalize(wilayah);

      // Reset layers
      setGeoData(null);
      setGeoKecamatan(null);
      setGeoDesa(null);
      setActiveKecamatan(null);
      
      // Set selected wilayah ID jika ada
      if (adm4) {
        setSelectedWilayahId(adm4);
        setSelectedAdm4(adm4);
      }

      // Tampilkan berdasarkan level
      if (level === "kabupaten") {
        const kabupatenTerpilih = kabData.features.find(f =>
          normalize(getNamaWilayah(f.properties)) === cleanWilayah
        );
        
        if (kabupatenTerpilih) {
          setGeoData({
            type: "FeatureCollection",
            features: [kabupatenTerpilih]
          });
        } else {
          setGeoData(kabData);
        }
        setGeoKecamatan(kecData);
      } 
      else if (level === "kecamatan") {
        const kecamatanTerpilih = kecData.features.find(f =>
          normalize(getNamaWilayah(f.properties)) === cleanWilayah
        );

        if (!kecamatanTerpilih) {
          console.warn("Kecamatan tidak ditemukan:", cleanWilayah);
          isUpdatingRef.current = false;
          return;
        }

        const kecNama = normalize(getNamaWilayah(kecamatanTerpilih.properties));
        
        const desaFiltered = {
          ...desaData,
          features: desaData.features.filter(f =>
            normalize(f.properties.NAME_3 || "") === kecNama
          )
        };

        setGeoKecamatan(kecData);
        setGeoDesa(desaFiltered);
        setGeoData({
          type: "FeatureCollection",
          features: [kecamatanTerpilih]
        });
        setActiveKecamatan(kecNama);
        
        const kecId = getWilayahId(kecamatanTerpilih.properties);
        if (kecId) setSelectedWilayahId(kecId);
      } 
      else if (level === "desa") {
        const desaTerpilih = desaData.features.find(f =>
          normalize(getNamaWilayah(f.properties)) === cleanWilayah
        );

        if (!desaTerpilih) {
          console.warn("Desa tidak ditemukan:", cleanWilayah);
          isUpdatingRef.current = false;
          return;
        }

        const kecNama = normalize(desaTerpilih.properties.NAME_3 || "");
        
        const desaDalamKecamatan = {
          ...desaData,
          features: desaData.features.filter(f =>
            normalize(f.properties.NAME_3 || "") === kecNama
          )
        };

        const kecFiltered = {
          ...kecData,
          features: kecData.features.filter(f =>
            normalize(getNamaWilayah(f.properties)) === kecNama
          )
        };

        setGeoData({
          type: "FeatureCollection",
          features: [desaTerpilih]
        });
        setGeoDesa(desaDalamKecamatan);
        setGeoKecamatan(kecFiltered);
        setActiveKecamatan(kecNama);
        
        const desaId = getWilayahId(desaTerpilih.properties);
        if (desaId) setSelectedWilayahId(desaId);
      }
    } catch (err) {
      console.error("Gagal load peta:", err);
    } finally {
      isUpdatingRef.current = false;
    }
  };

  // Fetch data cuaca untuk popup
  const fetchWeatherForPopup = useCallback(async (adm4, layer, namaWilayah, level) => {
    if (!adm4) {
      console.warn("No adm4 provided for popup");
      return;
    }
    
    try {
      console.log(`Fetching weather for popup - adm4: ${adm4}, level: ${level}, name: ${namaWilayah}`);
      
      const cached = cuacaCache[adm4];
      if (cached && Date.now() - cached._time < 600000) {
        console.log("Using cached weather data for popup:", cached);
        let displayName = namaWilayah;
        if (level === "desa" && cached.desa) displayName = cached.desa;
        else if (level === "kecamatan" && cached.kecamatan) displayName = cached.kecamatan;
        else if (level === "kabupaten" && cached.kabupaten) displayName = cached.kabupaten;
        
        layer.bindPopup(`
          <div style="min-width: 150px;">
            <strong>${displayName}</strong><br/>
            🌡️ ${cached.suhu || "-"}°C<br/>
            ☁️ ${cached.cuaca || "-"}<br/>
            💨 ${cached.angin || "-"} km/jam ${cached.arah_angin || ""}<br/>
            💧 Kelembapan: ${cached.kelembapan || "-"}%
          </div>
        `).openPopup();
        return;
      }

      const url = `${API}/api/weather/${adm4}`;
      console.log("Fetching weather from:", url);
      
      const res = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      console.log("Weather data received for popup:", data);
      
      if (data.error) throw new Error(data.error);

      setCuacaCache(prev => ({ 
        ...prev, 
        [adm4]: { ...data, _time: Date.now() } 
      }));

      let displayName = namaWilayah;
      if (level === "desa" && data.desa) displayName = data.desa;
      else if (level === "kecamatan" && data.kecamatan) displayName = data.kecamatan;
      else if (level === "kabupaten" && data.kabupaten) displayName = data.kabupaten;

      layer.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${displayName}</strong><br/>
          🌡️ ${data.suhu ?? "-"}°C<br/>
          ☁️ ${data.cuaca ?? "-"}<br/>
          💨 ${data.angin ?? "-"} km/jam ${data.arah_angin || ""}<br/>
          💧 Kelembapan: ${data.kelembapan || "-"}%
        </div>
      `).openPopup();
    } catch (err) {
      console.error("Error fetch weather for popup:", err);
      layer.bindPopup(`<strong>${namaWilayah}</strong><br/>Data cuaca tidak tersedia<br/><small>Error: ${err.message}</small>`).openPopup();
    }
  }, [cuacaCache]);

  // Fetch data cuaca untuk main display
  const fetchWeatherForMain = useCallback(async (adm4, wilayahData, level) => {
    if (!adm4) {
      console.warn("No adm4 provided for main weather");
      setWeatherError("ID Wilayah tidak ditemukan");
      return;
    }
    
    try {
      console.log(`Fetching main weather - adm4: ${adm4}, level: ${level}, name: ${wilayahData}`);
      setWeatherError(null);
      
      const cached = cuacaCache[adm4];
      if (cached && Date.now() - cached._time < 600000) {
        console.log("Using cached weather data for main:", cached);
        setCuacaUtama(cached);
        if (level === "desa" && cached.desa) setKota(cached.desa);
        else if (level === "kecamatan" && cached.kecamatan) setKota(cached.kecamatan);
        else if (level === "kabupaten" && cached.kabupaten) setKota(cached.kabupaten);
        else setKota(wilayahData);
        return;
      }

      const url = `${API}/api/weather/${adm4}`;
      console.log("Fetching main weather from:", url);
      
      const res = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      console.log("Weather data received for main:", data);
      
      if (data.error) throw new Error(data.error);

      setCuacaCache(prev => ({ 
        ...prev, 
        [adm4]: { ...data, _time: Date.now() } 
      }));
      
      setCuacaUtama(data);
      if (level === "desa" && data.desa) setKota(data.desa);
      else if (level === "kecamatan" && data.kecamatan) setKota(data.kecamatan);
      else if (level === "kabupaten" && data.kabupaten) setKota(data.kabupaten);
      else setKota(wilayahData);
    } catch (err) {
      console.error("Error fetch weather main:", err);
      setWeatherError(err.message);
      setCuacaUtama(null);
    }
  }, [cuacaCache]);

  // Style untuk feature berdasarkan status
  const getFeatureStyle = (feature) => {
    const featureId = getWilayahId(feature?.properties);
    const isSelected = featureId && featureId === selectedWilayahId;
    
    if (isSelected) {
      return {
        color: "#FF4500",
        weight: 3,
        fillOpacity: 0.4,
        fillColor: "#FF4500",
        opacity: 1
      };
    } else {
      return {
        color: "#666666",
        weight: 1,
        fillOpacity: 0.1,
        fillColor: "#888888",
        opacity: 0.5
      };
    }
  };

  // Handler untuk interaksi map
  const onEachFeature = useCallback((feature, layer) => {
    const namaWilayahRaw = getNamaWilayah(feature.properties);
    const namaWilayah = namaWilayahRaw || "Wilayah";
    const adm4 = feature.properties.adm4 || feature.properties.ADM4;
    const featureId = getWilayahId(feature.properties);
    
    // Deteksi level feature
    let featureLevel = "desa";
    if (feature.properties.NAME_4) featureLevel = "desa";
    else if (feature.properties.NAME_3) featureLevel = "kecamatan";
    else if (feature.properties.NAME_2) featureLevel = "kabupaten";
    
    console.log(`Feature level detected: ${featureLevel}, adm4: ${adm4}, name: ${namaWilayah}`);
    
    let hoverTimeout = null;

    layer.on({
      mouseenter: (e) => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        
        e.target.setStyle({
          weight: 3,
          color: "#FF7800",
          fillOpacity: 0.3,
          fillColor: "#FF7800"
        });
        
        hoverTimeout = setTimeout(() => {
          if (adm4) {
            setHoveredAdm4(adm4);
            fetchWeatherForPopup(adm4, layer, namaWilayah, featureLevel);
          } else {
            layer.bindPopup(`
              <strong>${namaWilayah}</strong><br/>
              Adm4 ID tidak tersedia
            `).openPopup();
          }
        }, 200);
      },
      mouseleave: (e) => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setHoveredAdm4(null);
        e.target.setStyle(getFeatureStyle(feature));
        layer.closePopup();
      },
      click: async () => {
        console.log("Feature clicked:", { namaWilayah, adm4, featureLevel, featureId });
        
        if (!namaWilayahRaw) return;
        
        if (featureId) {
          setSelectedWilayahId(featureId);
        }
        
        if (adm4) {
          await fetchWeatherForMain(adm4, namaWilayahRaw, featureLevel);
          setSelectedAdm4(adm4);
        } else {
          console.warn("No adm4 found for clicked feature");
          setWeatherError("ID Wilayah tidak tersedia untuk lokasi ini");
        }
        
        // Buat subtitle sesuai level
        let newSubtitle = "";
        if (featureLevel === "desa") {
          newSubtitle = `${namaWilayahRaw}, ${feature.properties.NAME_3 || ""}, ${feature.properties.NAME_2 || ""}, Jawa Timur`;
        } else if (featureLevel === "kecamatan") {
          newSubtitle = `${namaWilayahRaw}, ${feature.properties.NAME_2 || ""}, Jawa Timur`;
        } else {
          newSubtitle = `${namaWilayahRaw}, Jawa Timur`;
        }
        
        setSelectedSubtitle(newSubtitle);
        loadMapData(namaWilayahRaw, featureLevel, newSubtitle, adm4);
      }
    });
  }, [fetchWeatherForPopup, fetchWeatherForMain, getFeatureStyle]);

  // Search location
  const searchLocation = async (value) => {
    setQuery(value);
    
    if (value.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/location/search?q=${encodeURIComponent(value)}`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      
      const data = await res.json();
      console.log("Search results:", data);
      setResults(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error Search Location:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search result click
  const handleSearchResult = (loc) => {
    const formatted = formatLocation(loc);
    const fullText = `${formatted.main}, ${formatted.sub}`;
    const level = detectLevel(fullText);
    
    console.log("Search result clicked:", { loc, formatted, level, adm4: loc.adm4 });
    
    setKota(formatted.main);
    setQuery(`${formatted.main}, ${formatted.sub}`);
    setSelectedSubtitle(fullText);
    setResults([]);
    
    loadMapData(formatted.main, level, fullText, loc.adm4);
    
    if (loc.adm4) {
      fetchWeatherForMain(loc.adm4, formatted.main, level);
    } else {
      console.warn("No adm4 found in search result");
      setWeatherError("Data cuaca tidak tersedia untuk wilayah ini");
    }
  };

  // Handle enter key search
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && query) {
      const wilayahUtama = query.split(",")[0];
      const fullText = query;
      const level = detectLevel(fullText);
      setKota(wilayahUtama);
      loadMapData(wilayahUtama, level, fullText);
      
      const matchedResult = results.find(r => {
        const formatted = formatLocation(r);
        return formatted.main === wilayahUtama;
      });
      
      if (matchedResult && matchedResult.adm4) {
        fetchWeatherForMain(matchedResult.adm4, wilayahUtama, level);
      }
    }
  };

  // Helper untuk menampilkan badge level
  const getLevelBadge = (level) => {
    switch(level) {
      case "desa": return { text: "Desa", color: "#2196F3", icon: "🏘️" };
      case "kecamatan": return { text: "Kecamatan", color: "#FF4500", icon: "🏙️" };
      case "kabupaten": return { text: "Kabupaten", color: "#4CAF50", icon: "🌆" };
      default: return { text: "Wilayah", color: "#666", icon: "📍" };
    }
  };

  return (
    <div className="wilayah-page">
      {/* FILTER */}
      <div className="wilayah-filterr" style={{ position: "relative", maxWidth: "400px", margin: "40px auto 30px" }}>
        <input 
          type="text"
          placeholder="Cari desa, kecamatan, atau kabupaten..."
          value={query}
          onChange={(e) => searchLocation(e.target.value)}
          onBlur={() => setTimeout(() => setResults([]), 200)}
          onKeyDown={handleSearchKeyDown}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "0.5px solid #ccc" }}
        />
      
        {loading && (
          <div style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
            Mencari lokasi...
          </div>
        )}
        
        {!loading && results.length > 0 && (
          <div style={{
            position: "absolute",
            background: "#fff",
            border: "0.5px solid #ddd",
            width: "100%",
            marginTop: "5px",
            borderRadius: "8px",
            zIndex: 10,
            maxHeight: "250px",
            overflowY: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            {results.map((loc, i) => {
              const formatted = formatLocation(loc);
              const fullText = `${formatted.main}, ${formatted.sub}`;
              const level = detectLevel(fullText);
              const badge = getLevelBadge(level);
              
              return (
                <div
                  key={loc.id || i}
                  style={{ 
                    padding: "10px", 
                    cursor: "pointer", 
                    borderBottom: "0.5px solid #eee",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  onMouseDown={() => handleSearchResult(loc)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{formatted.main}</strong>
                    <span style={{ 
                      fontSize: "11px", 
                      padding: "2px 6px", 
                      borderRadius: "12px",
                      backgroundColor: badge.color,
                      color: "white",
                      marginLeft: "8px"
                    }}>
                      {badge.icon} {badge.text}
                    </span>
                  </div>
                  <small style={{ color: "#666" }}>{formatted.sub}</small>
                  {loc.adm4 && <small style={{ display: "block", fontSize: "10px", color: "#999" }}>ID: {loc.adm4}</small>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HERO */}
      <div className="wilayah-hero">
        <h1>{kota}</h1>
        {weatherError && (
          <p style={{ color: "#ff4444", fontSize: "12px" }}>⚠️ {weatherError}</p>
        )}
        <h2>{cuacaUtama?.suhu || "-"}°C</h2>
        <p>{cuacaUtama?.cuaca || "Tidak ada data"} ☀️</p>
        {cuacaUtama && (
          <small style={{ fontSize: "11px", opacity: 0.7 }}>
            Last update: {cuacaUtama._time ? new Date(cuacaUtama._time).toLocaleTimeString() : "N/A"}
          </small>
        )}
      </div>

      {/* INFO */}
      <div className="wilayah-grid">
        <div className="info-card">
          <FaWind />
          <h4>Angin</h4>
          <p>{cuacaUtama?.angin ?? "-"} km/jam {cuacaUtama?.arah_angin || ""}</p>
        </div>
        <div className="info-card">
          <FaTint />
          <h4>Kelembapan</h4>
          <p>{cuacaUtama?.kelembapan ?? "-"}%</p>
        </div>
        <div className="info-card">
          <FaCompressArrowsAlt />
          <h4>Tekanan</h4>
          <p>{cuacaUtama?.cloud_cover ?? "-"}%</p>
        </div>
        <div className="info-card">
          <FaEye />
          <h4>Jarak Pandang</h4>
          <p>{cuacaUtama?.visibilitas_text ?? "-"}</p>
        </div>
      </div>

      {/* MAP */}
      <div className="map-box" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
        <MapContainer center={[-8.2, 114.3]} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {geoData && (
            <>
              <FitBounds geoData={geoData} />
              <GeoJSON 
                key="geoData-layer"
                data={geoData} 
                onEachFeature={onEachFeature}
                style={getFeatureStyle}
              />
            </>
          )}

          {geoKecamatan && (
            <GeoJSON 
              key="kecamatan-layer"
              data={geoKecamatan}
              onEachFeature={onEachFeature}
              style={getFeatureStyle}
            />
          )}

          {geoDesa && (
            <GeoJSON 
              key="desa-layer"
              data={geoDesa}
              onEachFeature={onEachFeature}
              style={getFeatureStyle}
            />
          )}
        </MapContainer>
      </div>

      {/* KETERANGAN */}
      <div className="map-legend">
        <h3>Keterangan Peta</h3>
        <div className="legend-list">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#FF4500", width: "10px", height: "10px", display: "inline-block", borderRadius: "3px" }}></span>
            <span>Wilayah Dipilih (Mencolok)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#FF7800", width: "10px", height: "10px", display: "inline-block", borderRadius: "3px" }}></span>
            <span>Wilayah Hover</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#888888", width: "10px", height: "10px", display: "inline-block", borderRadius: "3px", opacity: "0.3" }}></span>
            <span>Wilayah Lain (Pudar)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "black", width: "10px", height: "10px", display: "inline-block", borderRadius: "3px" }}></span>
            <span>Batas Kecamatan</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "white", width: "10px", height: "10px", display: "inline-block", borderRadius: "3px", border: "1px solid #ccc" }}></span>
            <span>Batas Desa</span>
          </div>
        </div>
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