import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar/Navbar";
import Topbar from "./component/Topbar/Topbar";
import Footer from "./component/Footer/Footer";

import Dashboard from "./pages/Dashboard";
import Wilayah from "./pages/Wilayah";
import Peringatan from "./pages/Peringatan";
import Lainnya from "./pages/Lainnya";
import Cuaca from "./pages/Cuaca";
import KualitasUdara from "./pages/KualitasUdara";
import DetailPeringatan from "./pages/DetailPeringatan";
import Berita from "./pages/BeritaDetail";
import Maritim from "./pages/Maritim";
import Bandara from "./pages/Bandara";
import Sektoral from "./pages/Sektoral";
import BandaraDetail from "./pages/BandaraDetail";

function App() {
  return (
    <BrowserRouter>

      <Topbar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wilayah" element={<Wilayah />} />
        <Route path="/peringatan" element={<Peringatan />} />
        <Route path="/lainnya" element={<Lainnya />} />
        <Route path="/cuaca" element={<Cuaca />} />
        <Route path="/Udara" element={<KualitasUdara />} />
        <Route path="/detail/:id" element={<DetailPeringatan />} />
        <Route path="/berita/:id" element={<Berita />} />
        <Route path="/maritim" element={<Maritim/>} />
        <Route path="/bandara" element={<Bandara/>} />
        <Route path="/sektoral" element={<Sektoral/>} />
        <Route path="/bandara-detail/:id" element={<BandaraDetail/>} />
      </Routes>

      <Footer/>

    </BrowserRouter>
  );
}

export default App;