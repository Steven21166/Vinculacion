import { useEffect, useState } from "react";
import Carrusel from "./Carrusel";
import { useNavigate } from "react-router-dom";
import "../styles/Inicio.css";

function Inicio() {
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  const irACategoria = (nombre) => {
    navigate(`/productos?categoria=${nombre}`);
  };

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/temporadas")
      .then((res) => res.json())
      .then((data) => setTemporadas(data));
  }, []);

  return (
    <div className="inicio-container">
      <div className="inicio-box">
        <h2>Algo especial para ti</h2>
        <Carrusel />

        {/* 🔥 NUEVA SECCIÓN */}
        <h2>Categorías</h2>

        <div className="categorias-grid">
          {categorias.map((cat) => (
            <div
              key={cat._id}
              className="categoria-card"
              onClick={() => irACategoria(cat.nombre)}
            >
              <img
                src={`https://vipan-backend.onrender.com/uploads/${cat.imagen}`}
                alt={cat.nombre}
              />

              <h3>{cat.nombre}</h3>
            </div>
          ))}
        </div>

        {/* 🔥 TEMPORADAS */}

        {temporadas.length > 0 && (
          <>
            <h2>Temporada</h2>

            {temporadas.map((temp) => (
              <div
                key={temp._id}
                className="temporada-banner"
                style={{
                  backgroundImage: `url(https://vipan-backend.onrender.com${temp.imagen})`,
                }}
              >
                <div className="temporada-overlay">
                  <h2>{temp.nombre}</h2>

                  <p>{temp.descripcion}</p>

                  <button
                    onClick={() => navigate(`/temporada#temporada-${temp._id}`)}
                  >
                    ¡Descúbrelo ya!
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        <h2>Ubicación</h2>

        <div
          className="ubicacion-banner"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/local.png)`,
          }}
        >
          <div className="overlay">
            <button
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/poDK3yGLcdme6AxQ8", // 👈 cambia por tu ubicación real
                  "_blank",
                )
              }
            >
              Encuentranos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
