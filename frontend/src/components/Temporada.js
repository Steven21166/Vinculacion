import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Temporada.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Animacion from "./Animacion";

const token = localStorage.getItem("token");

let esAdmin = false;

if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  esAdmin = payload.role === "admin";
}

function Temporada() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  const [temporadas, setTemporadas] = useState([]);

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const [imagenActual, setImagenActual] = useState("");

  const fileInputRef = useRef(null);

  const location = useLocation();

  // 🔥 MODAL ELIMINAR
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const [temporadaEliminar, setTemporadaEliminar] = useState(null);

  // 🔥 OBTENER TEMPORADAS
  const obtenerTemporadas = async () => {
    try {
      const res = await fetch("http://localhost:4000/temporadas");

      const data = await res.json();

      setTemporadas(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerTemporadas();
  }, []);

  // 🔥 SCROLL AUTOMÁTICO
  useEffect(() => {
    if (location.hash && temporadas.length > 0) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          el.classList.add("highlight");

          setTimeout(() => {
            el.classList.remove("highlight");
          }, 2000);
        }
      }, 500);
    }
  }, [location, temporadas]);

  // 🔥 GUARDAR / EDITAR
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);

    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      let url = "http://localhost:4000/temporadas";

      let method = "POST";

      if (editando) {
        url = `http://localhost:4000/temporadas/${idEditar}`;

        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setNombre("");
        setDescripcion("");
        setImagen(null);

        setEditando(false);
        setIdEditar(null);

        setImagenActual("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        obtenerTemporadas();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 EDITAR
  const editarTemporada = (temporada) => {
    setNombre(temporada.nombre);

    setDescripcion(temporada.descripcion);

    setImagenActual(temporada.imagen);

    setEditando(true);

    setIdEditar(temporada._id);
  };

  // 🔥 ABRIR MODAL ELIMINAR
  const abrirEliminar = (id) => {
    setTemporadaEliminar(id);

    setMostrarEliminar(true);
  };

  // 🔥 ELIMINAR
  const eliminarTemporada = async () => {
    if (!temporadaEliminar) return;

    try {
      await fetch(`http://localhost:4000/temporadas/${temporadaEliminar}`, {
        method: "DELETE",
      });

      setMostrarEliminar(false);

      setTemporadaEliminar(null);

      obtenerTemporadas();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="temporada-container">
      <div className="temporada-box">
        <h2>Temporadas</h2>

        {/* 🔥 FORM ADMIN */}
        {esAdmin && (
          <form className="form-temporada" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setImagen(e.target.files[0])}
              required={!editando}
            />

            {/* 🔥 PREVIEW SOLO EN EDITAR */}
            {editando && imagenActual && (
              <div className="preview-edicion-temporada">
                <p>Imagen actual:</p>

                <img
                  src={`http://localhost:4000${imagenActual}`}
                  alt=""
                  className="preview-temporada"
                />
              </div>
            )}

            <button type="submit">
              {editando ? "Guardar cambios" : "Agregar Temporada"}
            </button>
          </form>
        )}

        {/* 🔥 LISTA */}
        <div className={esAdmin ? "temporadas-grid" : "temporadas-cliente"}>
          {temporadas.map((t) =>
            esAdmin ? (
              <div key={t._id} className="fila-admin-temporada">
                <span>{t.nombre}</span>

                <span>{t.imagen.split("/").pop()}</span>

                <div className="acciones-admin">
                  <button
                    className="btn-editar"
                    onClick={() => editarTemporada(t)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="btn-eliminar"
                    onClick={() => abrirEliminar(t._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={t._id}
                id={`temporada-${t._id}`}
                className="temporada-card"
              >
                <img src={`http://localhost:4000${t.imagen}`} alt={t.nombre} />

                <div className="temporada-info">
                  <h3>{t.nombre}</h3>

                  <p>{t.descripcion}</p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* 🔥 MODAL ELIMINAR */}
        {mostrarEliminar && (
          <Animacion
            mensaje="¿Eliminar temporada?"
            video="/videos/eliminar.webm"
            mostrarBotones={true}
            cerrar={() => setMostrarEliminar(false)}
            onConfirm={eliminarTemporada}
          />
        )}
      </div>
    </div>
  );
}

export default Temporada;
