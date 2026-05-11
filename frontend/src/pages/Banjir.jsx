import "./Edukasi.css";
import { Link } from "react-router-dom";

function Banjir() {
  return (
    <div className="banjir-page">
      <div className="banjir-wrapper">

        <div className="banjir-border">

          {/* JUDUL */}
          <h1 className="banjir-title">
            Antisipasi Banjir Saat Musim Hujan
          </h1>

          <hr className="banjir-divider" />

          {/* 2 GAMBAR */}
          <div className="banjir-two-images">
            <img src="/banjir1.jpg" alt="Banjir perkotaan" />
            <img src="/banjir2.jpg" alt="Antisipasi banjir" />
          </div>

          {/* PEMBUKA */}
          <div className="banjir-text-only">

            <p>
              Banjir merupakan salah satu bencana alam yang paling sering
              terjadi di Indonesia, terutama ketika curah hujan meningkat
              pada musim penghujan. Wilayah dengan drainase buruk,
              sungai yang meluap, serta lingkungan yang dipenuhi sampah
              memiliki risiko lebih tinggi mengalami banjir.
            </p>

            <p>
              Dampak banjir tidak hanya merusak rumah dan fasilitas umum,
              tetapi juga dapat mengganggu aktivitas masyarakat,
              menimbulkan penyakit, hingga membahayakan keselamatan jiwa.
              Oleh sebab itu, masyarakat perlu memahami langkah antisipasi
              agar dapat meminimalkan risiko yang terjadi.
            </p>

          </div>

          {/* LANGKAH ANTISIPASI */}
          <div className="banjir-row">

            <div className="banjir-text">

              <h3>Langkah Antisipasi Banjir</h3>

              <ul className="banjir-list">

                <li>
                  Membersihkan saluran air dan selokan secara rutin
                  agar aliran air tidak tersumbat.
                </li>

                <li>
                  Tidak membuang sampah sembarangan ke sungai,
                  drainase, maupun lingkungan sekitar.
                </li>

                <li>
                  Menyimpan dokumen penting dan barang elektronik
                  di tempat yang aman dan lebih tinggi.
                </li>

                <li>
                  Menyiapkan tas siaga bencana berisi obat-obatan,
                  makanan ringan, pakaian, serta senter.
                </li>

                <li>
                  Memantau informasi cuaca dan peringatan dini
                  dari BMKG secara berkala.
                </li>

              </ul>

            </div>

          </div>

          {/* PENJELASAN */}
          <div className="banjir-text-only">

            <p>
              Saat hujan deras berlangsung dalam waktu lama,
              masyarakat yang tinggal di daerah rawan banjir
              perlu meningkatkan kewaspadaan. Jika air mulai naik,
              segera matikan aliran listrik untuk menghindari
              korsleting dan pindah ke lokasi yang lebih aman.
            </p>

            <p>
              Hindari berkendara di jalan yang tergenang karena
              dapat membahayakan keselamatan. Arus air yang deras
              juga dapat menyeret kendaraan maupun pejalan kaki.
              Ikuti arahan petugas dan prioritaskan evakuasi
              anak-anak, lansia, serta kelompok rentan lainnya.
            </p>

            <p>
              Setelah banjir surut, masyarakat dianjurkan
              membersihkan rumah menggunakan air bersih dan
              disinfektan untuk mencegah munculnya penyakit
              seperti diare, leptospirosis, maupun infeksi kulit.
              Pastikan lingkungan tetap bersih agar aktivitas
              dapat kembali berjalan dengan aman dan nyaman.
            </p>

          </div>

          {/* TOMBOL */}
          <div className="banjir-back-section">

            <span className="banjir-back-text">
              Klik tombol di samping untuk kembali ke halaman utama
            </span>

            <Link to="/lainnya" onClick={() => window.scrollTo(0, 0)}>
              <button className="banjir-back-btn">
                Kembali
              </button>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Banjir;