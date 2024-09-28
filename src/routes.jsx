import Home from "./pages/home";
import Contatos from "./pages/Contatos";
import Dmca from "./pages/Dmca";
import Novels from "./pages/Novels";
import NovelsEng from "./pages/NovelsEng";
import Manhuas from "./pages/Manhuas";
import Sobre from "./pages/Sobre";
import SeriesPage from "./pages/SeriesPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="/dmca" element={<Dmca />} />
        <Route path="/novels" element={<Novels />} />
        <Route path="/novelsEng" element={<NovelsEng />} />
        <Route path="/manhuas" element={<Manhuas />} />
        <Route path="/sobrenos" element={<Sobre />} />
        <Route path="/series" element={<SeriesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
