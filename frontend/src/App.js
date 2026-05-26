import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navegacion from "./components/Navegacion";
import Login from "./components/Login";
import AgregarProducto from "./components/AgregarProducto";
import Productos from "./components/Productos";
import Aside from "./components/Aside";
import Footer from "./components/Footer";
import Inicio from "./components/Inicio";
import Servicios from "./components/Servicios";
import Temporada from "./components/Temporada";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navegacion />

        <div className="main-layout">
          {/* CONTENIDO DINÁMICO */}
          <div className="contenido">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/servicios" element={<Servicios />} />
              <Route path="/temporada" element={<Temporada />} />
              <Route path="/admin/productos" element={<AgregarProducto />} />
            </Routes>
          </div>

          {/* ASIDE SIEMPRE VISIBLE */}
          <Aside />
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
