import { useParams, Link } from "react-router-dom";

function DetailPeringatan() {

  const { id } = useParams();

  const dataBencana = {
    1: {
      jenis: "Gempa Bumi",
      lokasi: "Nagan Raya",
      magnitude: "3.5",
      kedalaman: "9 Km",
      koordinat: "4.46 LU - 96.51 BT",
      status: "Gempa Dirasakan",
      lat: 4.46,
      lng: 96.51,
    },
    2: {
      jenis: "Banjir",
      lokasi: "Jakarta",
      magnitude: "-",
      kedalaman: "-",
      koordinat: "-",
      status: "Waspada",
      lat: -6.2,
      lng: 106.8,
    }
  };

  const data = dataBencana[id];

  if (!data) return <h2>Data tidak ditemukan</h2>;

  return (
    <div className="detail-page">

      <h1>{data.jenis}</h1>

      <iframe
        src={`https://www.google.com/maps?q=${data.lat},${data.lng}&z=6&output=embed`}
        width="100%"
        height="400"
        style={{ border: "none", borderRadius: "15px" }}
      />

      <div className="detail-card">
        <span className="badge orange">{data.status}</span>

        <p>Lokasi: {data.lokasi}</p>
        <p>Magnitude: {data.magnitude}</p>
        <p>Kedalaman: {data.kedalaman}</p>
        <p>Koordinat: {data.koordinat}</p>

        <Link to="/" className="lihat">← Kembali</Link>
      </div>

    </div>
  );
}

export default DetailPeringatan;