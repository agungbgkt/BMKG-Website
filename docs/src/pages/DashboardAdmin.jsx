import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCloudSun,
  FaTint,
  FaWind,
  FaMicrochip,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./DashboardAdmin.css";

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalSensors: 0,
    averageWater: 0,
    averageRain: 0,
    rainingCount: 0,
    locationCount: 0,
  });

  const [locations, setLocations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    const adminEmails = [
      "petugas@bmkg.go.id",
      "kepala@bmkg.go.id",
    ];

    if (!adminEmails.includes(parsedUser.email)) {
      navigate("/");
      return;
    }

    setUser(parsedUser);

    fetchSensorData(token);

    const interval = setInterval(() => {
      fetchSensorData(token);
    }, 5000);

    return () => clearInterval(interval);

  }, [navigate]);

  const fetchSensorData = async (token) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/flood-sensor/latest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const result = await response.json();

        const data =
          result.latest_data ||
          result.data ||
          result;

        const sensorArray = Array.isArray(data)
          ? data
          : [data];

        setSensorData(sensorArray);

        // =========================
        // SUMMARY CALCULATION
        // =========================
        if (sensorArray.length > 0) {

          const waterSum = sensorArray.reduce(
            (sum, item) =>
              sum + (parseFloat(item.float_state) || 0),
            0
          );

          const rainSum = sensorArray.reduce(
            (sum, item) =>
              sum + (parseFloat(item.rain_analog) || 0),
            0
          );

          const raining = sensorArray.filter(
            (item) => item.is_raining === true
          ).length;

          const uniqueLocations = [
            ...new Set(
              sensorArray.map((item) => item.location)
            ),
          ].filter(Boolean);

          setLocations(uniqueLocations);

          setSummary({
            totalSensors: sensorArray.length,
            averageWater: (
              waterSum / sensorArray.length
            ).toFixed(1),
            averageRain: (
              rainSum / sensorArray.length
            ).toFixed(1),
            rainingCount: raining,
            locationCount: uniqueLocations.length,
          });
        }
      }
    } catch (error) {
      console.error("ERROR FETCH:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        Loading...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>
          <FaTachometerAlt />
          Dashboard Admin
        </h1>

        <p>
          Selamat datang, {user.name} | {user.email}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="summary-cards">

        <div className="card">
          <FaMicrochip className="card-icon" />
          <h3>{summary.totalSensors}</h3>
          <p>Total Pembacaan</p>
        </div>

        <div className="card">
          <FaTint className="card-icon" />
          <h3>{summary.averageWater} cm</h3>
          <p>Rata-rata Ketinggian Air</p>
        </div>

        <div className="card">
          <FaCloudSun className="card-icon" />
          <h3>{summary.averageRain}</h3>
          <p>Rata-rata Curah Hujan</p>
        </div>

        <div className="card">
          <FaWind className="card-icon" />
          <h3>{summary.rainingCount}</h3>
          <p>Sensor Sedang Hujan</p>
        </div>

        {/* 🔥 LOCATION CARD */}
        <div className="card">
          <FaMapMarkerAlt className="card-icon" />
          <h3>{summary.locationCount}</h3>
          <p>Lokasi Aktif</p>
        </div>

      </div>

      {/* LOCATION LIST */}
      <div className="location-box">
        <h3>Lokasi Sensor Aktif</h3>
        <ul>
          {locations.map((loc, i) => (
            <li key={i}>{loc}</li>
          ))}
        </ul>
      </div>

      {/* TABLE */}
      <div className="sensor-table-container">

        <div className="table-header">
          <h2>Data Real-time dari Sensor</h2>
        </div>

        {loading ? (
          <div className="loading-data">
            Loading data sensor...
          </div>
        ) : sensorData.length === 0 ? (
          <div className="loading-data">
            Belum ada data sensor
          </div>
        ) : (
          <table className="sensor-table">

            <thead>
              <tr>
                <th>ID Sensor</th>
                <th>Ketinggian Air</th>
                <th>Rain Analog</th>
                <th>Rain Digital</th>
                <th>Status Hujan</th>
                <th>Cuaca</th>
                <th>Lokasi</th>
                <th>Waktu</th>
              </tr>
            </thead>

            <tbody>
              {sensorData.map((sensor, index) => (
                <tr key={sensor.id || index}>

                  <td>{sensor.sensor_id || "-"}</td>

                  <td>
                    {sensor.float_state !== null
                      ? `${sensor.float_state} cm`
                      : "NO DATA"}
                  </td>

                  <td>{sensor.rain_analog || 0}</td>

                  <td>
                    {sensor.rain_digital ? "HIGH" : "LOW"}
                  </td>

                  <td>{sensor.rain_status || "-"}</td>

                  <td>
                    {sensor.is_raining
                      ? "🌧️ Hujan"
                      : "☀️ Cerah"}
                  </td>

                  <td>
                    {sensor.location ||
                      "Lokasi tidak tersedia"}
                  </td>

                  <td>
                    {new Date(
                      sensor.reading_time
                    ).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}

export default DashboardAdmin;