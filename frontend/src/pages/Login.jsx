import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Format data untuk x-www-form-urlencoded
      const formBody = new URLSearchParams({
        email: formData.email,
        password: formData.password
      });

      const response = await fetch(`http://localhost:8000/api/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan data user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login berhasil!");
        // navigate("/dashboard");
        const adminEmails = ["petugas@bmkg.go.id", "kepala@bmkg.go.id"];
        const isAdmin = adminEmails.includes(data.user.email);

        if(isAdmin) {
          window.location.href = "/admin/dashboard";
        } else{
           window.location.href = "/";
        }
      } else {
        setError(data.message || "Login gagal");
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
          <h2>Login Pegawai BMKG</h2>
          <p>Khusus Pegawai BMKG</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email BMKG"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

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

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Belum punya akun? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;