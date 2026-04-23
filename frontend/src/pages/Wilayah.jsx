import { useState } from "react";
import { FaWind, FaTint, FaCompressArrowsAlt, FaEye } from "react-icons/fa";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

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
  const [geoKecamatan, setGeoKecamatan] = useState(null);
  const [geoDesa, setGeoDesa] = useState(null);

  // untuk cache cuaca
  const [cuacaCache, setCuacaCache] = useState({});

  // untuk simpan subtitle
  const [selectedSubtitle, setSelectedSubtitle] = useState("");

  // untuk location
  const formatLocation = (loc) => {
    const title = loc.title || "";
    const subtitle = loc.subtitle || "";

    const parts = [title, ...subtitle.split(",").map(s => s.trim())];

    return {
      main: parts[0],
      sub: parts.slice(1).join(", ")
    };
  };

  // untuk tampilan ketika user nteraksi dengan map
  const [activeKecamatan, setActiveKecamatan] = useState(null);

  // deteksi level
  const detectLevel = (subtitle) => {

    const parts = subtitle.toLowerCase().split(",").map(s => s.trim());
    if (parts.length === 4) return "desa";
    if (parts.length === 3) return "kecamatan";
    if (parts.length === 2) return "kabupaten";
    return "provinsi";
  }
  // ambil data nama wilayah
  const getNamaWilayah = (props) => {
  return (
    props.NAME_4 ||   // 🔥 INI YANG DIPAKAI DI DATA KAMU
    props.NAME_3 ||
    props.NAME_4 ||
    props.WADMKC ||
    props.name ||
    "");
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace("kecamatan", "")
      .replace("kabupaten", "")
      .replace("kota", "")
      .replace("desa", "")
      .replace("kelurahan", "")
      .replace(/\s+/g, "")
      .trim();

  // untuk load GeoJson
  const loadMapData = async (wilayah, level, subtitle) => {
    try {
      const parts = subtitle.toLowerCase().split(",").map(s => s.trim());
      console.log("LEVEL:", level);
      console.log("SUBTITLE:", subtitle);
      console.log("PARTS:", parts);

      const wilayahDipilih = wilayah.toLowerCase();

      // ambil kabupaten
      let kabupaten = parts.find(p =>
        p.includes("kabupaten") || p.includes("kota")
      );

      // fallback kalau tidak ada kata kabupaten/kota
      if (!kabupaten && parts.length >= 2) {
        kabupaten = parts[parts.length - 2];
      }

      if (!kabupaten) {
        console.warn("Tidak ada kabupaten");
        return;
      }

      // bersihkan nama kabupaten
      kabupaten = kabupaten
        .replace("kabupaten", "")
        .replace("kota", "")
        .trim()
        .replace(/\s+/g, "-");

      console.log("KABUPATEN:", kabupaten);

      // fetch file GeoJson
      const kabRes = await fetch(`/maps/jawatimur/${kabupaten}/${kabupaten}.geojson`);
      if (!kabRes.ok) throw new Error("Kabupaten tidak ditemukan");

      const kecRes = await fetch(`/maps/jawatimur/${kabupaten}/kecamatan_${kabupaten}.json`);
      if (!kecRes.ok) throw new Error("Kecamatan tidak ditemukan");

      const desaRes = await fetch(`/maps/jawatimur/${kabupaten}/desa_${kabupaten}.json`);
      if (!desaRes.ok) throw new Error("Desa tidak ditemukan");

      const kabData = await kabRes.json();
      const kecData = await kecRes.json();
      const desaData = await desaRes.json();

      // reset layer
      setGeoData(null);
      setGeoKecamatan(null);
      setGeoDesa(null);

      // clean nama wilayah
      const cleanWilayah = normalize(wilayahDipilih)
        .replace("kecamatan", "")
        .replace("desa", "")
        .trim()
        .toLowerCase();

      // menampilkan map
      // Kabupaten
      if (level === "kabupaten") {
        setGeoData(kabData);
      }
      // Kecamatan
      if (level === "kecamatan") {
        const kecamatanTerpilih = kecData.features.find(f =>
      normalize(getNamaWilayah(f.properties)) === cleanWilayah
      );

      if (!kecamatanTerpilih) {
        console.warn("Kecamatan tidak ditemukan:", cleanWilayah);
        return;
      }

      const kecNama = normalize(getNamaWilayah(kecamatanTerpilih.properties));

      // semua kecamatan tetap ditampilkan (biar bisa diklik)
      setGeoKecamatan(kecData);

      // hanya desa dalam kecamatan aktif
      const desaFiltered = {
        ...desaData,
        features: desaData.features.filter(f =>
          normalize(f.properties.NAME_3 || "") === kecNama)
      };

      // (highlight) kecamatan yang dipilih
      setGeoData({
        type: "FeatureCollection",
        features: [kecamatanTerpilih]
      });

      setGeoDesa(desaFiltered);
      setActiveKecamatan(kecNama);
      }

      // Desa
      if (level === "desa") {
        const desaTerpilih = desaData.features.find(f =>
        normalize(getNamaWilayah(f.properties)) === cleanWilayah
      );

      if (!desaTerpilih) {
        console.warn("Desa tidak ditemukan:", cleanWilayah);
        return;
      }

      const kecNama = normalize(desaTerpilih.properties.NAME_3 || "");

      // SEMUA DESA DALAM KECAMATAN YANG SAMA
      const desaDalamKecamatan = {
        ...desaData,
        features: desaData.features.filter(f =>
          normalize(f.properties.NAME_3 || "") === kecNama)
      };

      // HANYA KECAMATAN ITU
      const kecFiltered = {
        ...kecData,
        features: kecData.features.filter(f =>
          normalize(getNamaWilayah(f.properties)) === kecNama)
      };

      setGeoData({
        type: "FeatureCollection",
        features: [desaTerpilih]
      });

      setGeoDesa(desaDalamKecamatan);
      setGeoKecamatan(kecFiltered);
      setActiveKecamatan(kecNama);
      }

    } catch (err) {
      console.error("gagal load peta", err);
    }
  };
    // untuk interaksi hover di map
    const onEachFeature = (feature, layer) => {
      // const namaWilayah = feature.properties.name || feature.properties.tags?.name || feature.properties.tags?.["name:en"] || "Wilayah";
      const namaWilayahRaw = getNamaWilayah(feature.properties);
      const namaWilayah = normalize(namaWilayahRaw);
      const kecamatanDariDesa = normalize(feature.properties.NAME_3 || "");
      let timeout;

      layer.on({
        mouseover: (e) => {
          clearTimeout(timeout);

          timeout = setTimeout(async () => {
            e.target.setStyle({weight:3, color: "#FF7800", fillOpacity: 0.5});
            const el = e.target.getElement();
            if (el) el.style.cursor = "pointer";

            if(cuacaCache[namaWilayah]){
            const data = cuacaCache[namaWilayah];

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
          }, 300); // delay 300ms
        },
        mouseout: (e) => {
          clearTimeout(timeout);

          e.target.setStyle({weight: 2, color: "#FFD700", fillOpacity: 0.2});
        },
        click: () => {
          if (activeKecamatan) {
            if (kecamatanDariDesa === activeKecamatan) {
              // dalam kecamatan = tampil desa
              loadMapData(namaWilayahRaw, "desa", `${namaWilayahRaw}, ${activeKecamatan}, kabupaten`);
            } else {
              // luar kecamatan = balik ke kecamatan
              loadMapData(kecamatanDariDesa, "kecamatan", `${kecamatanDariDesa}, kabupaten`);
            }
          } else {
              // default = kecamatan
              loadMapData(namaWilayahRaw, "kecamatan", `${namaWilayahRaw}, kabupaten`);
          }
        }
      });
    };

    // untuk call api lokasi berdasarkan id wilayah
    const searchLocation = async (value) => {
     setQuery(value);
    
      if (value.length < 2){
        setResults([]);
        setLoading(false);
        return;
      } try {
        setLoading(true);
        const res = await fetch(`${API}/api/location/search?q=${encodeURIComponent(value)}`,{
        headers: {"ngrok-skip-browser-warning": "true"}
        });
    
        const data = await res.json();

        setResults(Array.isArray(data) ? data : data.data || []);
      } catch (error){
          console.error("Error Search Location:", error);
      } finally {
        setLoading(false);
      };
    };

    function FitBounds({ geoData }) {
      const map = useMap();

      useEffect(() => {
        if (geoData && geoData.features && geoData.features.length > 0) {
          const layer = L.geoJSON(geoData);
          map.fitBounds(layer.getBounds(), {padding: [20, 20], animate: true, duration: 1});
        }
      }, [geoData]);

      return null;
    }

    return (
      <div className="wilayah-page">
        {/* FILTER */}
        <div className="wilayah-filterr" style={{position: "relative", maxWidth: "400px", margin: "40px auto 30px"}}>
          <input 
            type="text"
            placeholder="Cari lokasi..."
            value={query}
            onChange={(e) => searchLocation(e.target.value)}
            onBlur={() => setTimeout(() => setResults([]), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter"){
                const wilayahUtama = query.split(",")[0];
                const fullText = query;
                const level = detectLevel(fullText);
                setKota(wilayahUtama);
                loadMapData(wilayahUtama, level, fullText);
              }
            }}
            style={{width: "100%", padding: "10px", borderRadius: "8px", border: "0.5px solid #ccc"}} />
        
          {loading && (
            <div style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
              Mencari lokasi dicari...
            </div>
          )}
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
                maxHeight: "200px",
                overflowY: "auto"
              }}>
                {results.map((loc, i) => {
                  const formatted = formatLocation(loc);
                  const fullText = `${formatted.main}, ${formatted.sub}`;
                  const level = detectLevel(fullText);
              
                    return(
                      <div
                        key={loc.id || i}
                        style={{padding: "10px", cursor: "pointer", borderBottom: "0.5px solid #eee"}}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                        onMouseDown={() =>{
                          setKota(formatted.main);
                          setQuery(`${formatted.main}, ${formatted.sub}`);
                          setSelectedSubtitle(fullText);

                          setResults([]);
                          loadMapData(formatted.main, level, fullText);
                          console.log("LEVEL FINAL:", level);
                        }}>
                          <strong>{formatted.main}</strong><br/>
                          <small>{formatted.sub}</small>
                      </div>
                    );
                })}
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
      <div className="map-box" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
        <MapContainer center={[-2, 118]} zoom={5} style={{ height: "100%", width: "100%"}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoData && (
            <>
            <FitBounds geoData={geoData} />
            <GeoJSON 
            data={geoData} 
            onEachFeature={onEachFeature}
            style={{color: "#FFD700", weight: 2, fillOpacity: 0.2, fillColor: "#FFD700"}}
            />
            </>
          )}

          {/* tambahan kecamatan */}
          {geoKecamatan && (
            <GeoJSON 
            data={geoKecamatan}
            onEachFeature={onEachFeature}
            style={{color: "black", weight: 1, fillOpacity: 0}}
            />
          )}

          {/* tambahan desa */}
          {geoDesa && (
            <GeoJSON 
            data={geoDesa}
            onEachFeature={onEachFeature}
            style={{color: "white", weight: 0.5, fillOpacity: 0}}
            />
          )}
        </MapContainer>
      </div>


      {/* KETERANGAN */}

      <div className="map-legend">
        <h3>Keterangan Peta</h3>

        <div className="legend-list">
          <div className="legend-item">
            <span className="legend-color kuning"></span>
            <span>Wilayah dipilih</span>
          </div>

          <div className="legend-item">
            <span className="legend-color oren"></span>
            <span>Wilayah aktif</span>
          </div>

          <div className="legend-item">
            <span className="legend-color hitam"></span>
            <span>Batas Kecamatan</span>
          </div>

          <div className="legend-item">
            <span className="legend-color putih"></span>
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