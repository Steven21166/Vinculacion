import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Aside.css";

function Aside() {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/productos/ofertas")
      .then((res) => res.json())
      .then((data) => setOfertas(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 Carrusel + animación
  useEffect(() => {
    if (ofertas.length === 0) return;

    const interval = setInterval(() => {
      setFade(false); // empieza fade out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ofertas.length);
        setFade(true); // fade in
      }, 300); // duración del fade out
    }, 3000);

    return () => clearInterval(interval);
  }, [ofertas]);

  const producto = ofertas[index];

  return (
    <aside className="aside">
      <h3>Ofertas del día</h3>

      {producto ? (
        <div
          className={`oferta-card ${fade ? "fade-in" : "fade-out"}`}
          onClick={() => navigate(`/productos#producto-${producto._id}`)}
          style={{ cursor: "pointer" }}
        >
          <img src={producto.imagen} alt={producto.nombre} />
          <p>{producto.nombre}</p>
        </div>
      ) : (
        <p>No hay ofertas</p>
      )}
    </aside>
  );
}

export default Aside;
