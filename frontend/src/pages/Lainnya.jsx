import { Link } from "react-router-dom";

function Lainnya() {
  return (
    <div className="lainnya-page">

      <h1 className="lainnya-title">Lainnya</h1>

      <div className="lainnya-container">

        {/* INFO TERKINI */}
        <div className="lainnya-card">
          <h3>Info Terkini</h3>
          <Link to="/peringatan">Peringatan Cuaca</Link>
          <Link to="/cuaca">Prakiraan Cuaca</Link>
          <Link to="/udara">Kualitas Udara</Link>
        </div>

        {/* BERITA */}
        <div className="lainnya-card">
          <h3>Berita</h3>
          <a href="#">Berita BMKG</a>
          <a href="#">Kegiatan BMKG</a>
          <a href="#">Berita Daerah</a>
        </div>

        {/* EDUKASI */}
        <div className="lainnya-card">
          <h3>Edukasi</h3>
          <a href="#">Tentang Cuaca</a>
          <a href="#">Mitigasi Bencana</a>
          <a href="#">Iklim & Lingkungan</a>
        </div>

        {/* LAYANAN */}
        <div className="lainnya-card">
          <h3>Layanan</h3>
          <a href="#">Data BMKG</a>
          <a href="#">Citra Satelit</a>
          <a href="#">Peta Interaktif</a>
        </div>

      </div>

    </div>
  );
}

export default Lainnya;