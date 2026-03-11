import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import WeatherCard from "../component/dashboard/WeatherCard";
import { FaSmile, FaMeh, FaFrown, FaAngry, FaSkull } from "react-icons/fa";

function Dashboard() {

const [filter, setFilter] = useState("All");

/* slider */

const sliderRef = useRef(null);

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

/* ================= DATA CUACA ================= */

const dataCuaca = [
{ kota:"Banyuwangi", jam:"11.00 WIB", suhu:30, kondisi:"Cerah" },
{ kota:"Banyuwangi", jam:"12.00 WIB", suhu:31, kondisi:"Cerah" },
{ kota:"Banyuwangi", jam:"13.00 WIB", suhu:28, kondisi:"Berawan" },
{ kota:"Banyuwangi", jam:"14.00 WIB", suhu:26, kondisi:"Hujan" },

{ kota:"Jember", jam:"11.00 WIB", suhu:29, kondisi:"Cerah" },
{ kota:"Jember", jam:"12.00 WIB", suhu:30, kondisi:"Berawan" },
{ kota:"Malang", jam:"13.00 WIB", suhu:24, kondisi:"Hujan" },
{ kota:"Surabaya", jam:"14.00 WIB", suhu:32, kondisi:"Cerah" },
{ kota:"Jakarta", jam:"15.00 WIB", suhu:33, kondisi:"Petir" },
{ kota:"Bandung", jam:"16.00 WIB", suhu:23, kondisi:"Berawan" },
];


/* ================= DATA KUALITAS UDARA ================= */

const dataUdara = [
{ kota:"Banyuwangi", jam:"12.00 WIB", nilai:"05.6", status:"Baik", class:"baik", icon:<FaSmile/> },
{ kota:"Banyuwangi", jam:"12.00 WIB", nilai:"45.7", status:"Sedang", class:"sedang", icon:<FaMeh/> },
{ kota:"Banyuwangi", jam:"12.00 WIB", nilai:"74.8", status:"Tidak Sehat", class:"tidak-sehat", icon:<FaFrown/> },
{ kota:"Banyuwangi", jam:"12.00 WIB", nilai:"222.1", status:"Sangat Tidak Sehat", class:"sangat-tidak-sehat", icon:<FaAngry/> },
{ kota:"Banyuwangi", jam:"12.00 WIB", nilai:"255.9", status:"Berbahaya", class:"berbahaya", icon:<FaSkull/> },
];

/* ================= FILTER CUACA ================= */

const filteredData =
filter === "All"
? dataCuaca
: dataCuaca.filter((item)=>item.kondisi===filter);

return(

<div className="dashboard">

{/* ================= CUACA ================= */}

<div className="cuaca-section">

<h1 className="title">CUACA</h1>

<div className="icon-group">

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

<Link to="/peta" className="lihat">
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


{/* ================= INFORMASI BENCANA ================= */}

<div className="bencana-section">

<h2 className="bencana-title">
Informasi Kebencanaan Terkini
</h2>

{/* GEMPA */}

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

<Link to="/peringatan" className="lihat">
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

<div className="udara-container">

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

<Link to="/lainnya" className="lihat">
Lihat Selengkapnya →
</Link>

</div>


{/* ================= AKSES INFORMASI ================= */}

<div className="akses-section">

<h2 className="akses-title">
Akses Informasi Lainnya
</h2>

<div className="akses-container">

<div className="akses-card">
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"/>
<h3>Informasi Maritim</h3>
</div>

<div className="akses-card">
<img src="https://images.unsplash.com/photo-1493238792000-8113da705763"/>
<h3>Informasi Bandara</h3>
</div>

<div className="akses-card">
<img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"/>
<h3>Informasi Sektoral</h3>
</div>

</div>

</div>

</div>

);
}

export default Dashboard;
