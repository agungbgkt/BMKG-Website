import { useState } from "react";
import WeatherCard from "../component/dashboard/WeatherCard";

function Cuaca() {

const [provinsi,setProvinsi] = useState("Jawa Timur");
const [kota,setKota] = useState("Banyuwangi");
const [tanggal,setTanggal] = useState("Hari Ini");
const [jam,setJam] = useState("12.00");

/* ================= DATA PROVINSI ================= */

const dataProvinsi = {
"Jawa Timur": ["Banyuwangi","Jember","Malang","Surabaya"],
"Jawa Barat": ["Bandung","Bogor","Bekasi"],
"DKI Jakarta": ["Jakarta Pusat","Jakarta Barat","Jakarta Timur"]
};

/* ================= DATA CUACA ================= */

const dataCuaca = [

{ provinsi:"Jawa Timur", kota:"Banyuwangi", tanggal:"Hari Ini", jam:"12.00", suhu:30, kondisi:"Cerah"},
{ provinsi:"Jawa Timur", kota:"Jember", tanggal:"Hari Ini", jam:"12.00", suhu:29, kondisi:"Berawan"},
{ provinsi:"Jawa Timur", kota:"Malang", tanggal:"Hari Ini", jam:"12.00", suhu:24, kondisi:"Hujan"},
{ provinsi:"Jawa Timur", kota:"Surabaya", tanggal:"Hari Ini", jam:"12.00", suhu:32, kondisi:"Cerah"},

{ provinsi:"Jawa Barat", kota:"Bandung", tanggal:"Hari Ini", jam:"12.00", suhu:26, kondisi:"Berawan"},
{ provinsi:"Jawa Barat", kota:"Bogor", tanggal:"Hari Ini", jam:"12.00", suhu:25, kondisi:"Hujan"},
{ provinsi:"Jawa Barat", kota:"Bekasi", tanggal:"Hari Ini", jam:"12.00", suhu:31, kondisi:"Cerah"},

{ provinsi:"DKI Jakarta", kota:"Jakarta Pusat", tanggal:"Hari Ini", jam:"12.00", suhu:33, kondisi:"Cerah"},
{ provinsi:"DKI Jakarta", kota:"Jakarta Barat", tanggal:"Hari Ini", jam:"12.00", suhu:32, kondisi:"Petir"},
{ provinsi:"DKI Jakarta", kota:"Jakarta Timur", tanggal:"Hari Ini", jam:"12.00", suhu:31, kondisi:"Berawan"}

];

/* ================= FILTER DATA ================= */

const hasilCuaca = dataCuaca.filter(
(item)=>
item.provinsi===provinsi &&
item.kota===kota &&
item.tanggal===tanggal &&
item.jam===jam
);

return(

<div className="dashboard">

<h1 className="title">
Informasi Cuaca Indonesia
</h1>


{/* ================= FILTER PROVINSI & KOTA ================= */}

<div className="cuaca-filter">

<select
value={provinsi}
onChange={(e)=>{
setProvinsi(e.target.value);
setKota(dataProvinsi[e.target.value][0]);
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

</div>


{/* ================= PILIH TANGGAL ================= */}

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


{/* ================= PILIH JAM ================= */}

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


{/* ================= HASIL CUACA ================= */}

<div className="cuaca-grid">

{hasilCuaca.map((item,index)=>(
<WeatherCard
key={index}
kota={item.kota}
jam={item.jam}
suhu={item.suhu}
kondisi={item.kondisi}
/>
))}

</div>

</div>

);

}

export default Cuaca;
