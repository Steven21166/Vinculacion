import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Productos.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AgregarProducto from "./AgregarProducto";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Animacion from "./Animacion";

const token = localStorage.getItem("token");
let esAdmin = false;

if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  esAdmin = payload.role === "admin";
}

function Productos() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriaFiltro = queryParams.get("categoria");
  const [productos, setProductos] = useState([]);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [productoEliminar, setProductoEliminar] = useState(null);

  useEffect(() => {
    fetch("https://vipan-backend.onrender.com/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (location.hash && productos.length > 0) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // 🔥 Resaltar tarjeta
          el.classList.add("highlight");

          setTimeout(() => {
            el.classList.remove("highlight");
          }, 2000);
        }
      }, 500);
    }
  }, [location, productos]);

  const handleDelete = async () => {
    if (!productoEliminar) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://vipan-backend.onrender.com/productos/${productoEliminar}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setMostrarEliminar(false);
        setProductoEliminar(null);

        window.location.reload();
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [productoEditar, setProductoEditar] = useState(null);
  const handleEdit = (producto) => {
    setProductoEditar(producto);
  };

  const enviarWhatsApp = (producto) => {
    const numero = "593987103448";

    const mensaje = `Hola, quiero información sobre este producto:
🧁 ${producto.nombre}
💲 Precio: ${producto.precioUnidad || "Consultar"}

📸 Imagen:
${producto.imagen}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  };

  const enviarInstagram = (producto) => {
    const mensaje = `Hola, me interesa este producto:

🧁 ${producto.nombre}
💲 Precio: ${producto.precioUnidad || "Consultar"}

📸 Imagen:
${producto.imagen}`;

    navigator.clipboard.writeText(mensaje);

    window.open("https://instagram.com/vipan_riobamba", "_blank");
  };

  return (
    <div className="productos-container">
      <h2>Productos</h2>

      <div className="productos-grid">
        {productos
          .filter((p) =>
            categoriaFiltro ? p.categoria === categoriaFiltro : true,
          )
          .map((p) => (
            <div key={p._id} id={`producto-${p._id}`} className="producto-card">
              <img src={p.imagen} alt={p.nombre} />

              <h3>{p.nombre}</h3>

              <div>
                {p.precioUnidad && <p>${p.precioUnidad} cada uno</p>}
                {p.precioCiento && <p>${p.precioCiento} el ciento</p>}
              </div>

              {p.enOferta && <span className="oferta">🔥 En oferta</span>}

              {!esAdmin && (
                <div className="botones-contacto">
                  <button
                    className="btn-whatsapp"
                    onClick={() => enviarWhatsApp(p)}
                  >
                    <FaWhatsapp />
                  </button>

                  <button
                    className="btn-instagram"
                    onClick={() => enviarInstagram(p)}
                  >
                    <FaInstagram />
                  </button>
                </div>
              )}

              {esAdmin && (
                <div className="admin-buttons">
                  <button onClick={() => handleEdit(p)}>
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => {
                      setProductoEliminar(p._id);
                      setMostrarEliminar(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* 🔥 MODAL */}
      {productoEditar && (
        <div className="modal" onClick={() => setProductoEditar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AgregarProducto
              productoEditar={productoEditar}
              cerrar={() => setProductoEditar(null)}
            />
          </div>
        </div>
      )}

      {mostrarEliminar && (
        <Animacion
          mensaje="¿Eliminar producto?"
          video="/videos/eliminar.webm"
          mostrarBotones={true}
          cerrar={() => setMostrarEliminar(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default Productos;
