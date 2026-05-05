import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaUserShield, FaIdCard } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeId: "",
    position: "",
    workUnit: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateBMKGEmail = (email) => {
    // Hanya email dari domain BMKG yang valid
    const bmkgDomains = ["bmkg.go.id", "bmkg.id"];
    const emailDomain = email.split("@")[1];
    return bmkgDomains.includes(emailDomain);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    // Validasi email BMKG
    if (!validateBMKGEmail(formData.email)) {
      setError("Hanya email BMKG (xxx@bmkg.go.id) yang dapat mendaftar");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      } else {
        setError(data.message || "Registrasi gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <FaUserShield className="auth-icon" />
          <h2>Registrasi Pegawai BMKG</h2>
          <p>Khusus Pegawai BMKG</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaIdCard className="input-icon" />
            <input
              type="text"
              name="employeeId"
              placeholder="NIP / ID Pegawai"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email BMKG (xxx@bmkg.go.id)"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="form-group">
            <input
              type="text"
              name="position"
              placeholder="Jabatan"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div> */}

          {/* <div className="form-group">
            <input
              type="text"
              name="workUnit"
              placeholder="Unit Kerja"
              value={formData.workUnit}
              onChange={handleChange}
              required
            />
          </div> */}

          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Konfirmasi Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="auth-footer">
          Belum punya akun? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Register;