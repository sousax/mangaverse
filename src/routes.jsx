import Layout from "./components/Layout";
import Home from "./pages/home";
import Contatos from "./pages/Contatos";
import Dmca from "./pages/Dmca";
import Novels from "./pages/Novels";
import NovelsEng from "./pages/NovelsEng";
import Catalogo from "./pages/Catalogo";
import Reader from "./pages/Reader";
import Sobre from "./pages/Sobre";
import SeriesPage from "./pages/SeriesPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/dmca" element={<Dmca />} />
          <Route path="/novels" element={<Novels />} />
          <Route path="/novelsEng" element={<NovelsEng />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/manhuas" element={<Navigate to="/catalogo" replace />} />
          <Route path="/sobrenos" element={<Sobre />} />
          <Route path="/series/:id" element={<SeriesPage />} />
          <Route path="/ler/:id" element={<Reader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
