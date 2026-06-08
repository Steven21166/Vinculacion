import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Carrusel.css";

function Carrusel() {
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const items = [
    ...categorias.map((c) => ({
      ...c,
      tipo: "categoria",
    })),

    ...temporadas.map((t) => ({
      ...t,
      tipo: "temporada",
    })),
  ];

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/temporadas")
      .then((res) => res.json())
      .then((data) => setTemporadas(data));
  }, []);

  // 👉 Auto cambio
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  const siguiente = () => {
    setIndex(index === items.length - 1 ? 0 : index + 1);
  };

  const anterior = () => {
    setIndex(index === 0 ? items.length - 1 : index - 1);
  };

  const handleClick = (item) => {
    if (item.tipo === "categoria") {
      navigate(`/productos?categoria=${item.nombre}`);
    } else {
      navigate("/temporada");
    }
  };

  if (items.length === 0) return null;

  const item = items[index];

  return (
    <div className="slider">
      {/* Flecha izquierda */}
      <button className="btn left" onClick={anterior}>
        ◀
      </button>

      <div className="slide" onClick={() => handleClick(item)}>
        <img
          src={
            item.tipo === "categoria"
              ? `https://vipan-backend.onrender.com/uploads/${item.imagen}`
              : `https://vipan-backend.onrender.com${item.imagen}`
          }
          alt={item.nombre}
        />

        <div className="overlay">{item.nombre}</div>
      </div>

      {/* Flecha derecha */}
      <button className="btn right" onClick={siguiente}>
        ▶
      </button>
    </div>
  );
}

export default Carrusel;
