import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import WeatherCard from "../component/dashboard/WeatherCard";
import { FaSmile, FaMeh, FaFrown, FaAngry, FaSkull } from "react-icons/fa";

function Dashboard() {

const sliderRef = useRef(null);
const udaraRef = useRef(null);

/* ================= STATE ================= */

const [filter, setFilter] = useState("All");
const [tanggal, setTanggal] = useState("Hari Ini");
const [jam, setJam] = useState("12.00");

const [statusGempa] = useState("dirasakan");
const [statusBanjir] = useState("waspada");


/* ================= SLIDER CUACA ================= */

const slideLeft = () => {
sliderRef.current.scrollBy({
left: -300,
behavior: "smooth"
});
};

const slideRight = () => {
sliderRef.current.scrollBy({
left: 300,
behavior: "smooth"
});
};

/* ================= SLIDER UDARA ================= */

const slideUdaraLeft = () => {
udaraRef.current.scrollBy({
left: -250,
behavior: "smooth"
});
};

const slideUdaraRight = () => {
udaraRef.current.scrollBy({
left: 250,
behavior: "smooth"
});
};

/* ================= DATA CUACA ================= */

const dataCuaca = [

{ kota:"Banyuwangi", tanggal:"Hari Ini", jam:"12.00", suhu:30, kondisi:"Cerah" },
{ kota:"Jember", tanggal:"Hari Ini", jam:"12.00", suhu:31, kondisi:"Berawan" },
{ kota:"Malang", tanggal:"Hari Ini", jam:"12.00", suhu:28, kondisi:"Hujan" },
{ kota:"Surabaya", tanggal:"Hari Ini", jam:"12.00", suhu:32, kondisi:"Cerah" },

{ kota:"Banyuwangi", tanggal:"Besok", jam:"12.00", suhu:29, kondisi:"Berawan" },
{ kota:"Jember", tanggal:"Besok", jam:"12.00", suhu:30, kondisi:"Cerah" },
{ kota:"Malang", tanggal:"Besok", jam:"12.00", suhu:25, kondisi:"Hujan" },

{ kota:"Banyuwangi", tanggal:"Lusa", jam:"12.00", suhu:27, kondisi:"Hujan" },
{ kota:"Surabaya", tanggal:"Lusa", jam:"12.00", suhu:33, kondisi:"Petir" },

];

/* ================= DATA KUALITAS UDARA ================= */

const dataUdara = [
{ kota:"Banyuwangi", jam:"12.00 WIB", nilai:"05.6", status:"Baik", class:"baik", icon:<FaSmile/> },
{ kota:"Jember", jam:"12.00 WIB", nilai:"45.7", status:"Sedang", class:"sedang", icon:<FaMeh/> },
{ kota:"Malang", jam:"12.00 WIB", nilai:"74.8", status:"Tidak Sehat", class:"tidak-sehat", icon:<FaFrown/> },
{ kota:"Surabaya", jam:"12.00 WIB", nilai:"222.1", status:"Sangat Tidak Sehat", class:"sangat-tidak-sehat", icon:<FaAngry/> },
{ kota:"Jakarta", jam:"12.00 WIB", nilai:"255.9", status:"Berbahaya", class:"berbahaya", icon:<FaSkull/> },
];

/* ================= FILTER CUACA ================= */

const filteredData = dataCuaca.filter((item) => {
  return (
    item.tanggal === tanggal &&
    item.jam === jam &&
    (filter === "All" || item.kondisi === filter)
  );
});

return(

<div className="dashboard">

{/* ================= CUACA ================= */}

<div className="cuaca-section">

<h1 className="title">CUACA</h1>

<div className="icon-group">

 <div
className={`icon-box ${filter==="All"?"active":""}`}
onClick={()=>setFilter("All")}
>
🌍
</div>   

<div
className={`icon-box ${filter==="Cerah"?"active":""}`}
onClick={()=>setFilter("Cerah")}
>
☀️
</div>

<div
className={`icon-box ${filter==="Berawan"?"active":""}`}
onClick={()=>setFilter("Berawan")}
>
☁️
</div>

<div
className={`icon-box ${filter==="Hujan"?"active":""}`}
onClick={()=>setFilter("Hujan")}
>
🌧️
</div>

<div
className={`icon-box ${filter==="Petir"?"active":""}`}
onClick={()=>setFilter("Petir")}
>
⛈️
</div>

</div>

{/* ================= TANGGAL ================= */}

<div className="tanggal-cuaca">

<button
className={tanggal==="Hari Ini" ? "aktif" : ""}
onClick={()=>setTanggal("Hari Ini")}
>
Hari Ini
</button>

<button
className={tanggal==="Besok" ? "aktif" : ""}
onClick={()=>setTanggal("Besok")}
>
Besok
</button>

<button
className={tanggal==="Lusa" ? "aktif" : ""}
onClick={()=>setTanggal("Lusa")}
>
Lusa
</button>

</div>

{/* ================= JAM ================= */}

<div className="jam-cuaca">

<select
value={jam}
onChange={(e)=>setJam(e.target.value)}
>

<option value="09.00">09.00</option>
<option value="12.00">12.00</option>
<option value="15.00">15.00</option>
<option value="18.00">18.00</option>

</select>

</div>

<Link to="/cuaca" className="lihat">
Lihat Selengkapnya →
</Link>

</div>

{/* ================= SLIDER CUACA ================= */}

<div className="slider-wrapper">

<button className="slider-btn" onClick={slideLeft}>
❮
</button>

<div className="weather-slider" ref={sliderRef}>

{filteredData.map((item,index)=>(

<WeatherCard
key={index}
kota={item.kota}
jam={item.jam}
suhu={item.suhu}
kondisi={item.kondisi}
/>

))}

</div>

<button className="slider-btn" onClick={slideRight}>
❯
</button>

</div>


{/* ================= INFORMASI KEBENCANAAN ================= */}

<div className="bencana-section">

<h2 className="bencana-title">
Informasi Kebencanaan Terkini
</h2>

{/* ================= GEMPA ================= */}

<div className="bencana-card">

<div className="bencana-left">

<iframe
title="peta-gempa"
src="https://www.google.com/maps?q=-1.96,138.95&z=6&output=embed"
width="260"
height="200"
style={{border:"none",borderRadius:"10px"}}
/>

</div>

<div className="bencana-right">

<h3>Gempa Bumi</h3>

<p className="tanggal">
24 FEBRUARI 2026, 14:46:50 WIB
</p>

<div className="badge-group">

<span className={`badge ${statusGempa==="dirasakan" ? "orange" : "gray"}`}>
Gempa Dirasakan
</span>

<span className={`badge ${statusGempa==="tsunami" ? "red" : "gray"}`}>
Berpotensi Tsunami
</span>

</div>


<p className="lokasi">
Pusat gempa berada di darat 23 km tenggara Sami
</p>

<div className="gempa-detail">

<div className="detail-box">
<p>Magnitude</p>
<h4>5.7</h4>
</div>

<div className="detail-box">
<p>Kedalaman</p>
<h4>10 Km</h4>
</div>

<div className="detail-box">
<p>Koordinat</p>
<h4>1.96 LS - 138.95 BT</h4>
</div>

</div>

<p className="saran">
<b>Saran BMKG:</b> Hati-hati terhadap gempa bumi susulan yang mungkin terjadi.
</p>

<Link to="/detail/1" className="lihat">
Lihat Selengkapnya →
</Link>

</div>

</div>


<hr className="bencana-divider" />


{/* ================= BANJIR ================= */}

<div className="bencana-card">

<div className="bencana-left">

<iframe
title="peta-banjir"
src="https://www.google.com/maps?q=-6.2088,106.8456&z=10&output=embed"
width="260"
height="200"
style={{border:"none",borderRadius:"10px"}}
/>

</div>

<div className="bencana-right">

<h3>Potensi Banjir</h3>

<p className="tanggal">
24 FEBRUARI 2026, 14:46:50 WIB
</p>

<div className="badge-group">

<span className={`badge ${statusBanjir==="rendah" ? "green" : "gray"}`}>
Rendah
</span>

<span className={`badge ${statusBanjir==="waspada" ? "yellow" : "gray"}`}>
Waspada
</span>

<span className={`badge ${statusBanjir==="siaga" ? "orange" : "gray"}`}>
Siaga
</span>

<span className={`badge ${statusBanjir==="bahaya" ? "red" : "gray"}`}>
Bahaya
</span>

</div>


<p className="lokasi">
Potensi banjir berada di sungai Ciliwung Jakarta
</p>

<div className="gempa-detail">

<div className="detail-box">
<p>Curah Hujan</p>
<h4>77 mm/jam</h4>
</div>

<div className="detail-box">
<p>Ketinggian Air</p>
<h4>120 cm</h4>
</div>

<div className="detail-box">
<p>Status</p>
<h4>Waspada</h4>
</div>

</div>

<p className="saran">
<b>Saran BMKG:</b> Waspada terhadap potensi banjir di wilayah sekitar.
</p>

<Link to="/detail/2" className="lihat">
Lihat Selengkapnya →
</Link>

</div>

</div>

</div>


{/* ================= KUALITAS UDARA ================= */}

<div className="udara-section">

<h2 className="udara-title">
Informasi Kualitas Udara Terkini
</h2>

<div className="slider-wrapper">

<button className="slider-btn" onClick={slideUdaraLeft}>
❮
</button>

<div className="udara-container" ref={udaraRef}>

{dataUdara.map((item,index)=>(

<div key={index} className={`udara-card ${item.class}`}>

<div className="udara-icon">
{item.icon}
</div>

<h3>{item.kota}</h3>
<p>{item.jam}</p>
<h2>{item.nilai}</h2>
<span>{item.status}</span>

</div>

))}

</div>

<button className="slider-btn" onClick={slideUdaraRight}>
❯
</button>

</div>

<Link to="/udara" className="lihat">
Lihat Selengkapnya →
</Link>

</div>


{/* ================= AKSES INFORMASI ================= */}

<div className="berita-section">

  <p className="berita-label">BERITA</p>
  <h2 className="berita-title">Berita Terkini</h2>
  <p className="berita-sub">
    Berita Utama, Kegiatan, dan Daerah Terbaru dari BMKG
  </p>

  <div className="berita-layout">

    {/* KIRI */}
    <div className="berita-kiri">
      <div className="berita-card horizontal">
        
        <div className="berita-text">
          <p className="tanggal">25 FEBRUARI 2026</p>
          <h3>Dukung Kelancaran Mudik Lebaran 2026...</h3>
          <a href="#">Baca Selengkapnya →</a>
        </div>

        <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=60"/>
      
      </div>
    </div>

    {/* KANAN */}
    <div className="berita-kanan">
      <div className="berita-card vertical">

        <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60" />

        <div className="berita-text">
          <p className="tanggal">25 FEBRUARI 2026</p>
          <h3>Optimalkan Pengelolaan Data dan Pemodelan Cuaca...</h3>
          <a href="#">Baca Selengkapnya →</a>
        </div>

      </div>
    </div>

  </div>

</div>

</div>


);

}

export default Dashboard;
