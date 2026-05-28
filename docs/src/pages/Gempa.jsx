import "./Edukasi.css";
import { Link } from "react-router-dom";

function Gempa() {
  return (
    <div className="gempa-page">
      <div className="gempa-wrapper">

        {/* HEADER */}
        <div className="gempa-header">

          <div className="gempa-header-left">
            <p className="gempa-label">
              EDUKASI KEBENCANAAN
            </p>

            <h1 className="gempa-title">
              Mitigasi Gempa Bumi dan
              Langkah Penyelamatan Diri
            </h1>

            <p className="gempa-subtitle">
              Indonesia berada di wilayah cincin api Pasifik yang
              memiliki aktivitas tektonik cukup tinggi sehingga
              masyarakat perlu memahami langkah mitigasi gempa bumi
              sejak dini.
            </p>
          </div>

          <div className="gempa-header-right">
            <img src="/gempa1.jpg" alt="Gempa bumi" />
          </div>

        </div>

        {/* KONTEN MODEL KORAN */}
        <div className="gempa-news-layout">

          {/* KOLOM KIRI */}
          <div className="gempa-column-left">

            <div className="gempa-news-card large">
              <img src="/gempa2.jpg" alt="Mitigasi gempa" />

              <div className="gempa-news-content">

                <h3>
                  Gempa Bumi Dapat Terjadi Tanpa Peringatan
                </h3>

                <p>
                  Gempa bumi terjadi akibat pergerakan lempeng
                  tektonik di dalam bumi yang melepaskan energi
                  secara tiba-tiba. Indonesia menjadi salah satu
                  negara dengan risiko gempa tinggi karena berada
                  di jalur pertemuan tiga lempeng besar dunia.
                </p>

                <p>
                  Oleh sebab itu, masyarakat perlu memahami
                  tindakan penyelamatan diri baik sebelum,
                  saat, maupun setelah gempa terjadi agar dapat
                  meminimalkan risiko korban jiwa.
                </p>

              </div>
            </div>

            <div className="gempa-info-box">

              <h3>
                Langkah Saat Terjadi Gempa
              </h3>

              <ul className="gempa-list">
                <li>
                  Tetap tenang dan jangan panik.
                </li>

                <li>
                  Lindungi kepala menggunakan tangan
                  atau benda yang aman.
                </li>

                <li>
                  Berlindung di bawah meja yang kuat.
                </li>

                <li>
                  Jauhi kaca, lemari, dan benda berat.
                </li>

                <li>
                  Jangan gunakan lift saat gempa.
                </li>

                <li>
                  Segera menuju area terbuka setelah
                  guncangan berhenti.
                </li>
              </ul>

            </div>

          </div>

          {/* KOLOM KANAN */}
          <div className="gempa-column-right">

            <div className="gempa-side-card">

              <img src="/gempa3.jpg" alt="Keselamatan gempa" />

              <div className="gempa-side-content">

                <h4>
                  Pentingnya Tas Siaga Bencana
                </h4>

                <p>
                  Menyiapkan tas siaga bencana dapat membantu
                  masyarakat bertahan dalam kondisi darurat.
                  Isi tas dapat berupa makanan ringan, obat,
                  air minum, senter, dan dokumen penting.
                </p>

              </div>

            </div>

            <div className="gempa-highlight">

              <h3>
                Tips Keselamatan Setelah Gempa
              </h3>

              <p>
                Setelah gempa berhenti, periksa kondisi sekitar
                dan hindari bangunan yang retak atau rusak.
                Ikuti arahan resmi dari BMKG dan BPBD untuk
                mengetahui informasi lanjutan terkait gempa susulan.
              </p>

              <p>
                Pastikan anggota keluarga berada dalam kondisi
                aman serta bantu kelompok rentan seperti
                anak-anak dan lansia apabila diperlukan.
              </p>

            </div>

            <div className="gempa-warning-box">

              <span>⚠ Informasi Penting</span>

              <p>
                Jangan mudah percaya informasi yang belum
                terverifikasi. Selalu pantau informasi resmi
                dari BMKG mengenai potensi gempa susulan
                maupun peringatan dini tsunami.
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="gempa-footer">

          <p>
            Edukasi mitigasi bencana penting dipahami oleh seluruh
            masyarakat agar mampu meningkatkan kesiapsiagaan
            menghadapi bencana alam.
          </p>

          <Link to="/lainnya" onClick={() => window.scrollTo(0, 0)}>
            <button className="gempa-btn">
              Kembali 
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Gempa;