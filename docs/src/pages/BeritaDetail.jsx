import { useParams, useNavigate } from "react-router-dom";


function BeritaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const dataBerita = [
    {
      id: "1",
      judul: "Dukung Kelancaran Mudik Lebaran 2026",
      isi: "BMKG mendukung kelancaran mudik dengan menyediakan informasi cuaca terkini di seluruh wilayah Indonesia.",
      gambar: "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
    },
    {
      id: "2",
      judul: "Optimalkan Pengelolaan Data Cuaca Nasional",
      isi: "BMKG terus meningkatkan sistem pengolahan data untuk menghasilkan prediksi cuaca yang lebih akurat.",
      gambar: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
    },
    {
      id: "3",
      judul: "Peningkatan Sistem Informasi BMKG",
      isi: "Pengembangan sistem informasi dilakukan untuk meningkatkan pelayanan publik dalam bidang meteorologi.",
      gambar: "https://images.unsplash.com/photo-1495020689067-958852a7765e"
    }
  ];

  const berita = dataBerita.find(item => item.id == id);
  

  if (!berita) {
    return <h1>Berita tidak ditemukan</h1>;
  }

  return (
    <div className="detail-berita">
        
      <button onClick={() => navigate(-1)} className="back-btn"> ← Kembali </button> 
            
      <h1>{berita.judul}</h1>

      <img src={berita.gambar} />

      <p>{berita.isi}</p>

      <h3 style={{marginTop:"40px"}}>Berita Lainnya</h3>

  

<div className="related-berita">
  {dataBerita
    .filter(item => item.id != id && item.kategori === berita.kategori)
    .map(item => (
      <div key={item.id} className="related-card">
        <img src={item.gambar} />

        <h4>{item.judul}</h4>

        <button onClick={() => navigate(`/berita/${item.id}`)}>
          Baca
        </button>
      </div>
  ))}
</div>

    </div>
  );
}

export default BeritaDetail;