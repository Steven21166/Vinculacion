import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navegacion.css";
import Animacion from "../components/Animacion";
import GoogleTranslate from "./GoogleTranslate";

function Navegacion() {
  const token = localStorage.getItem("token");
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [video, setVideo] = useState("");
  const [temporadas, setTemporadas] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      setVideo("/videos/CERRARSESION.webm");
      setMostrarAnimacion(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  };

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/temporadas")
      .then((res) => res.json())
      .then((data) => setTemporadas(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <nav className="nav">
      <h1
        className="logo-container"
        onClick={() => {
          if (!token) {
            window.location.href = "/login";
          }
        }}
      >
        <img src="/logo_vipan.png" alt="logo" className="logo" />
        Pasteleria "VIPAN"
      </h1>

      <div className="nav-right">
        <button
          className="hamburger"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuAbierto ? "active" : ""}`}>
          <li>
            <Link to="/">Inicio</Link>
          </li>

          <li>
            <Link to="/productos">Productos</Link>
          </li>

          {/* 🔥 Si NO hay token */}
          {!token && (
            <>
              <li>
                <Link to="/servicios">Servicios</Link>
              </li>
            </>
          )}

          {/* 🔥 TEMPORADA (admin SIEMPRE, cliente solo si hay datos) */}
          {(token || temporadas.length > 0) && (
            <li>
              <Link to="/temporada">Temporada</Link>
            </li>
          )}

          {/* 🔥 Si SÍ hay token */}
          {token && (
            <>
              <li>
                <Link to="/admin/productos">Añadir Producto</Link>
              </li>

              <li>
                <Link to="/admin/servicios">Servicios</Link>
              </li>

              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                Cerrar Sesión
              </li>
            </>
          )}
        </ul>
        <div className="traductor-li">
          <GoogleTranslate />
        </div>
      </div>
      {mostrarAnimacion && (
        <Animacion video={video} cerrar={() => setMostrarAnimacion(false)} />
      )}
    </nav>
  );
}

export default Navegacion;
