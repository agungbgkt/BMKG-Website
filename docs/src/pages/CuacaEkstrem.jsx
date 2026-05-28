import "./Edukasi.css";
import { Link } from "react-router-dom";

function CuacaEkstrem() {
  return (
    <div className="ekstrem-page">
      <div className="ekstrem-wrapper">

        <div className="ekstrem-border">

          {/* JUDUL */}
          <h1 className="ekstrem-title">
            Waspada Cuaca Ekstrem dan Angin Kencang
          </h1>

          <hr className="ekstrem-divider" />

          {/* HERO IMAGE */}
          <div className="ekstrem-hero-image">
            <img src="/ekstrem1.jpg" alt="Cuaca ekstrem" />
          </div>

          {/* 2 KOLOM */}
          <div className="ekstrem-content-grid">

            {/* KIRI */}
            <div className="ekstrem-left">

              <div className="ekstrem-text-box">
                <h3>Apa Itu Cuaca Ekstrem?</h3>

                <p>
                  Cuaca ekstrem merupakan kondisi cuaca yang terjadi
                  secara tidak normal dan berpotensi menimbulkan
                  dampak bagi masyarakat. Fenomena ini dapat berupa
                  hujan deras, petir, angin kencang, puting beliung,
                  hingga perubahan suhu yang drastis.
                </p>

                <p>
                  Perubahan cuaca yang terjadi secara cepat sering
                  menyebabkan gangguan aktivitas, kerusakan fasilitas,
                  pohon tumbang, bahkan bencana hidrometeorologi.
                </p>
              </div>

              <div className="ekstrem-small-image">
                <img src="/ekstrem2.jpg" alt="Hujan deras" />
              </div>

            </div>

            {/* KANAN */}
            <div className="ekstrem-right">

              <div className="ekstrem-text-box">
                <h3>Langkah Menghadapi Cuaca Ekstrem</h3>

                <ul className="ekstrem-list">

                  <li>
                    Memantau prakiraan cuaca dan informasi resmi BMKG.
                  </li>

                  <li>
                    Menghindari area terbuka saat petir dan angin kencang.
                  </li>

                  <li>
                    Menyiapkan perlengkapan darurat di rumah.
                  </li>

                  <li>
                    Mengurangi aktivitas luar ruangan saat cuaca memburuk.
                  </li>

                  <li>
                    Menjaga keselamatan keluarga dan kelompok rentan.
                  </li>

                </ul>
              </div>

              <div className="ekstrem-text-box">
                <h3>Hal yang Perlu Diwaspadai</h3>

                <p>
                  Ketika hujan deras berlangsung cukup lama,
                  masyarakat perlu waspada terhadap potensi
                  banjir dan longsor. Selain itu, kabel listrik
                  yang putus akibat angin kencang juga dapat
                  membahayakan keselamatan.
                </p>

                <p>
                  Setelah cuaca membaik, tetap ikuti informasi
                  resmi dari BMKG dan pihak terkait agar kondisi
                  tetap aman dan terkendali.
                </p>

              </div>

            </div>

          </div>

          {/* TOMBOL */}
          <div className="ekstrem-back-section">

            <span className="ekstrem-back-text">
              Klik tombol di samping untuk kembali ke halaman utama
            </span>

            <Link to="/lainnya" onClick={() => window.scrollTo(0, 0)}>
              <button className="ekstrem-back-btn">
                Kembali
              </button>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CuacaEkstrem;