import { Link } from "react-router-dom";

function Peringatan() {

  const dataBencana = [
    {
      id: 1,
      jenis: "Gempa Bumi",
      lokasi: "Nagan Raya, Aceh",
      magnitude: "3.5",
      kedalaman: "9 Km",
      waktu: "10 Feb 2026 • 20:13 WIB",
      status: "Dirasakan",
    },
    {
      id: 2,
      jenis: "Gempa Bumi",
      lokasi: "Malang, Jawa Timur",
      magnitude: "5.2",
      kedalaman: "12 Km",
      waktu: "11 Feb 2026 • 14:20 WIB",
      status: "Tsunami",
    },
    {
      id: 3,
      jenis: "Banjir",
      lokasi: "Jakarta",
      magnitude: "-",
      kedalaman: "-",
      waktu: "12 Feb 2026 • 08:00 WIB",
      status: "Waspada",
    }
  ];

  return (
    <div className="peringatan-page">

      <h1 className="peringatan-title">Peringatan Bencana</h1>

      {/* FILTER */}
      <div className="peringatan-filter">
        <button className="aktif">Terkini</button>
        <button>Magnitude ≥ 5.0</button>
        <button>Dirasakan</button>
      </div>

      {/* LIST */}
      <div className="peringatan-list">

        {dataBencana.map((item) => (
          <div key={item.id} className="peringatan-card">

            <div className="peringatan-header">
              <h3>{item.jenis}</h3>
              <span className={`badge ${item.status === "Tsunami" ? "red" : "orange"}`}>
                {item.status}
              </span>
            </div>

            <p className="lokasi">{item.lokasi}</p>
            <p className="waktu">{item.waktu}</p>

            <div className="info-row">
              <span>M {item.magnitude}</span>
              <span>{item.kedalaman}</span>
            </div>

            <Link to={`/detail/${item.id}`} className="detail-btn">
              Lihat Detail →
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Peringatan;