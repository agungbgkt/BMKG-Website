import { useParams } from "react-router-dom";

function BandaraDetail() {

  const { id } = useParams();

  if (!id) {
    return <h2>Data tidak ditemukan</h2>;
  }

  const data = {
    nama: "Soekarno Hatta",
    cuaca: "Guntur",
    jarak: "8.0 km",
    embun: "24 °C",
    tekanan: "1010 hPa",
    angin: "Tenang km/jam",
    arah: "Timur"
  };

  return (
    <div style={{padding:"20px"}}>
      <h1>Detail Bandara ID: {id}</h1>
      <h2>{data.nama}</h2>
      <p>{data.cuaca}</p>
    </div>
  );
}

export default BandaraDetail;