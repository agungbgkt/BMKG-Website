

import { useState } from "react";
import { FaSmile, FaMeh, FaFrown, FaAngry, FaSkull } from "react-icons/fa";

function KualitasUdara(){

const [provinsi,setProvinsi] = useState("Jawa Timur");
const [kota,setKota] = useState("Semua");
const [jam,setJam] = useState("12.00");
const [search,setSearch] = useState("");

/* ================= DATA PROVINSI ================= */

const dataProvinsi = {
"Jawa Timur":["Semua","Surabaya","Malang","Banyuwangi","Jember"],
"Jawa Barat":["Semua","Bandung","Bogor","Bekasi"],
"DKI Jakarta":["Semua","Jakarta Pusat","Jakarta Barat","Jakarta Timur"]
};

/* ================= DATA UDARA ================= */

const dataUdara = [

{ provinsi:"Jawa Timur", kota:"Surabaya", jam:"12.00", nilai:45, status:"Sedang", class:"sedang", icon:<FaMeh/> },
{ provinsi:"Jawa Timur", kota:"Malang", jam:"12.00", nilai:30, status:"Baik", class:"baik", icon:<FaSmile/> },
{ provinsi:"Jawa Timur", kota:"Banyuwangi", jam:"12.00", nilai:80, status:"Tidak Sehat", class:"tidak-sehat", icon:<FaFrown/> },
{ provinsi:"Jawa Timur", kota:"Jember", jam:"12.00", nilai:120, status:"Sangat Tidak Sehat", class:"sangat-tidak-sehat", icon:<FaAngry/> },

{ provinsi:"Jawa Barat", kota:"Bandung", jam:"12.00", nilai:40, status:"Baik", class:"baik", icon:<FaSmile/> },
{ provinsi:"Jawa Barat", kota:"Bogor", jam:"12.00", nilai:70, status:"Tidak Sehat", class:"tidak-sehat", icon:<FaFrown/> },
{ provinsi:"Jawa Barat", kota:"Bekasi", jam:"12.00", nilai:200, status:"Berbahaya", class:"berbahaya", icon:<FaSkull/> },

{ provinsi:"DKI Jakarta", kota:"Jakarta Pusat", jam:"12.00", nilai:180, status:"Sangat Tidak Sehat", class:"sangat-tidak-sehat", icon:<FaAngry/> },
{ provinsi:"DKI Jakarta", kota:"Jakarta Barat", jam:"12.00", nilai:210, status:"Berbahaya", class:"berbahaya", icon:<FaSkull/> },
{ provinsi:"DKI Jakarta", kota:"Jakarta Timur", jam:"12.00", nilai:150, status:"Tidak Sehat", class:"tidak-sehat", icon:<FaFrown/> }

];

/* ================= FILTER ================= */

const hasilUdara = dataUdara.filter((item)=>

item.provinsi === provinsi &&
item.jam === jam &&
(kota === "Semua" || item.kota === kota) &&
item.kota.toLowerCase().includes(search.toLowerCase())

);

/* ================= STATISTIK ================= */

const totalBaik = hasilUdara.filter(x=>x.status==="Baik").length;
const totalSedang = hasilUdara.filter(x=>x.status==="Sedang").length;
const totalBuruk = hasilUdara.filter(x=>x.status==="Berbahaya").length;

return(

<div className="dashboard">

<h1 className="title">
Monitoring Kualitas Udara Indonesia
</h1>

{/* SEARCH */}

<div className="search-box">

<input
type="text"
placeholder="Cari kota..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


{/* FILTER */}

<div className="cuaca-filter">

<select
value={provinsi}
onChange={(e)=>{
setProvinsi(e.target.value)
setKota("Semua")
}}
>

{Object.keys(dataProvinsi).map((item,index)=>(
<option key={index}>{item}</option>
))}

</select>


<select
value={kota}
onChange={(e)=>setKota(e.target.value)}
>

{dataProvinsi[provinsi].map((item,index)=>(
<option key={index}>{item}</option>
))}

</select>


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


{/* STATISTIK */}

<div className="statistik-udara">

<div className="stat-box baik">
<h3>{totalBaik}</h3>
<p>Kota Baik</p>
</div>

<div className="stat-box sedang">
<h3>{totalSedang}</h3>
<p>Kota Sedang</p>
</div>

<div className="stat-box berbahaya">
<h3>{totalBuruk}</h3>
<p>Kota Berbahaya</p>
</div>

</div>


{/* GRID UDARA */}

<div className="udara-grid">

{hasilUdara.map((item,index)=>(

<div key={index} className={`udara-card ${item.class}`}>

<div className="udara-icon">
{item.icon}
</div>

<h3>{item.kota}</h3>

<h2>{item.nilai}</h2>

<p>{item.status}</p>

<div className="aqi-bar">
<div style={{width:`${item.nilai/3}%`}}></div>
</div>

</div>

))}

</div>

</div>

);

}

export default KualitasUdara;
