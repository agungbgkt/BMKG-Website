import { useState, useEffect } from "react";
import { FaDownload, FaFilter, FaSync } from "react-icons/fa";
import Navbar from "../components/Navbar";

function DataSensor() {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    location: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/sensor-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSensorData(data.data || []);
        setFilteredData(data.data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = [...sensorData];
    
    if (filter.location) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(filter.location.toLowerCase())
      );
    }
    
    if (filter.status) {
      filtered = filtered.filter(item => item.status === filter.status);
    }
    
    if (filter.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= new Date(filter.dateFrom)
      );
    }
    
    if (filter.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) <= new Date(filter.dateTo)
      );
    }
    
    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    const headers = ["ID Sensor", "Lokasi", "Suhu", "Kelembaban", "Kecepatan Angin", "Status", "Waktu"];
    const rows = filteredData.map(item => [
      item.sensor_id,
      item.location,
      item.temperature,
      item.humidity,
      item.wind_speed,
      item.status,
      new Date(item.created_at).toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor-data-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="data-sensor-page">
        <div className="page-header">
          <h1>Data Sensor</h1>
          <div className="header-actions">
            <button onClick={fetchSensorData} className="btn-refresh">
              <FaSync /> Refresh
            </button>
            <button onClick={exportToCSV} className="btn-export">
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <h3><FaFilter /> Filter Data</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Lokasi"
              value={filter.location}
              onChange={(e) => setFilter({...filter, location: e.target.value})}
            />
            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
            <input
              type="date"
              placeholder="Dari Tanggal"
              value={filter.dateFrom}
              onChange={(e) => setFilter({...filter, dateFrom: e.target.value})}
            />
            <input
              type="date"
              placeholder="Sampai Tanggal"
              value={filter.dateTo}
              onChange={(e) => setFilter({...filter, dateTo: e.target.value})}
            />
            <button onClick={handleFilter} className="btn-apply">Terapkan Filter</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="sensor-table-container">
          {loading ? (
            <p>Loading data sensor...</p>
          ) : (
            <table className="sensor-table">
              <thead>
                <tr>
                  <th>ID Sensor</th>
                  <th>Lokasi</th>
                  <th>Suhu (°C)</th>
                  <th>Kelembaban (%)</th>
                  <th>Kecepatan Angin (m/s)</th>
                  <th>Status</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sensor) => (
                  <tr key={sensor.id}>
                    <td>{sensor.sensor_id}</td>
                    <td>{sensor.location || "-"}</td>
                    <td>{sensor.temperature || "-"}</td>
                    <td>{sensor.humidity || "-"}</td>
                    <td>{sensor.wind_speed || "-"}</td>
                    <td>
                      <span className={`status-badge ${sensor.status}`}>
                        {sensor.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td>{new Date(sensor.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default DataSensor;