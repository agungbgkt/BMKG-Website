import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCloudSun, FaTemperatureHigh, FaTint, FaWind, FaMicrochip } from "react-icons/fa";
import Navbar from "../components/Navbar";

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalSensors: 0,
    activeSensors: 0,
    averageTemp: 0,
    averageHumidity: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Cek apakah admin
    if (parsedUser.email !== "admin@bmkg.go.id" && parsedUser.role !== "admin") {
      navigate("/");
    }
    
    fetchSensorData();
  }, [navigate]);

  const fetchSensorData = async () => {
    setLoading(true);
    try {
      // Panggil API untuk ambil data sensor
      const response = await fetch("http://localhost:8000/api/sensor-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSensorData(data.data || []);
        
        // Hitung summary
        if (data.data && data.data.length > 0) {
          const tempSum = data.data.reduce((sum, item) => sum + (item.temperature || 0), 0);
          const humidSum = data.data.reduce((sum, item) => sum + (item.humidity || 0), 0);
          
          setSummary({
            totalSensors: data.data.length,
            activeSensors: data.data.filter(item => item.status === "active").length,
            averageTemp: (tempSum / data.data.length).toFixed(1),
            averageHumidity: (humidSum / data.data.length).toFixed(1),
          });
        }
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>
            <FaTachometerAlt /> Dashboard Admin
          </h1>
          <p>Selamat datang, {user.name} | {user.email}</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <FaMicrochip className="card-icon" />
            <h3>{summary.totalSensors}</h3>
            <p>Total Sensor</p>
          </div>
          <div className="card">
            <FaCloudSun className="card-icon" />
            <h3>{summary.activeSensors}</h3>
            <p>Sensor Aktif</p>
          </div>
          <div className="card">
            <FaTemperatureHigh className="card-icon" />
            <h3>{summary.averageTemp}°C</h3>
            <p>Suhu Rata-rata</p>
          </div>
          <div className="card">
            <FaTint className="card-icon" />
            <h3>{summary.averageHumidity}%</h3>
            <p>Kelembaban Rata-rata</p>
          </div>
        </div>

        {/* Tabel Data Sensor */}
        <div className="sensor-table-container">
          <h2>Data Real-time dari Sensor</h2>
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
                {sensorData.length > 0 ? (
                  sensorData.map((sensor) => (
                    <tr key={sensor.id}>
                      <td>{sensor.sensor_id || sensor.id}</td>
                      <td>{sensor.location || "-"}</td>
                      <td>{sensor.temperature || "-"}</td>
                      <td>{sensor.humidity || "-"}</td>
                      <td>{sensor.wind_speed || "-"}</td>
                      <td>
                        <span className={`status-badge ${sensor.status === "active" ? "active" : "inactive"}`}>
                          {sensor.status || "active"}
                        </span>
                      </td>
                      <td>{new Date(sensor.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Belum ada data sensor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardAdmin;