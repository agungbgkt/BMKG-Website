import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* KIRI */}
        <div className="footer-col">
          <h3>BMKG</h3>

          <h4>KONTAK KAMI</h4>

          <p><FaMapMarkerAlt /> Jl. Angkasa I No.2<br/>Kemayoran, Jakarta Pusat</p>

          <p><FaPhone /> (021) 196</p>

          <p><FaEnvelope /> cc196@bmkg.go.id</p>
        </div>

        {/* DUKUNGAN */}
        <div className="footer-col">
          <h4>DUKUNGAN</h4>
          <ul>
            <li>Informasi Cuaca</li>
            <li>Cuaca Maritim</li>
            <li>Cuaca Penerbangan</li>
            <li>InaTEWS</li>
          </ul>
        </div>

        {/* TAUTAN */}
        <div className="footer-col">
          <h4>TAUTAN</h4>
          <ul>
            <li>STMKG</li>
            <li>Data Online BMKG</li>
            <li>Portal SSO</li>
          </ul>
        </div>

        {/* APP */}
        <div className="footer-col">
          <h4>APLIKASI</h4>
          <div className="app-btn">
            <button>Google Play</button>
            <button>App Store</button>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 - BMKG
      </div>

    </footer>
  );
}

export default Footer;