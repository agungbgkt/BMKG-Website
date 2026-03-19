import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar/Navbar";
import Topbar from "./component/Topbar/Topbar";

import Dashboard from "./pages/Dashboard";
import Peta from "./pages/Peta";
import Peringatan from "./pages/Peringatan";
import Lainnya from "./pages/Lainnya";
import Cuaca from "./pages/Cuaca";
import KualitasUdara from "./pages/KualitasUdara";
import DetailPeringatan from "./pages/DetailPeringatan";

function App() {
  return (
    <BrowserRouter>

      <Topbar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/peta" element={<Peta />} />
        <Route path="/peringatan" element={<Peringatan />} />
        <Route path="/lainnya" element={<Lainnya />} />
        <Route path="/cuaca" element={<Cuaca />} />
        <Route path="/Udara" element={<KualitasUdara />} />
        <Route path="/detail/:id" element={<DetailPeringatan />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;