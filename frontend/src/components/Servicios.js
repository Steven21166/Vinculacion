import { useEffect, useRef, useState } from "react";
import "../styles/Servicios.css";
import { FaTrash, FaEdit, FaWhatsapp, FaInstagram } from "react-icons/fa";
import Animacion from "./Animacion";

const token = localStorage.getItem("token");

let esAdmin = false;

if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  esAdmin = payload.role === "admin";
}

function Servicios() {
  const [titulo, setTitulo] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [archivoActual, setArchivoActual] = useState("");
  const fileInputRef = useRef(null);

  const [servicios, setServicios] = useState([]);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [servicioEliminar, setServicioEliminar] = useState(null);

  const obtenerServicios = async () => {
    const res = await fetch("https://api.vipanpasteleria.com/servicios");

    const data = await res.json();

    setServicios(data);
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("titulo", titulo);

    if (archivo) {
      formData.append("archivo", archivo);
    }

    try {
      let url = "https://api.vipanpasteleria.com/servicios";
      let method = "POST";

      if (editando) {
        url = `https://api.vipanpasteleria.com/servicios/${idEditar}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setTitulo("");
        setArchivo(null);

        fileInputRef.current.value = "";

        setEditando(false);
        setIdEditar(null);

        obtenerServicios();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editarServicio = (servicio) => {
    setTitulo(servicio.titulo);

    setArchivoActual(servicio.archivo);

    setEditando(true);

    setIdEditar(servicio._id);
  };

  const eliminarServicio = async () => {
    if (!servicioEliminar) return;

    try {
      await fetch(
        `https://api.vipanpasteleria.com/servicios/${servicioEliminar}`,
        {
          method: "DELETE",
        },
      );

      obtenerServicios();

      setMostrarEliminar(false);
      setServicioEliminar(null);
    } catch (error) {
      console.log(error);
    }
  };

  const enviarWhatsApp = (servicio) => {
    const numero = "593987103448";

    const mensaje = `Hola, quiero información sobre este servicio:

${servicio.titulo}

Archivo:
${servicio.archivo}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  };

  const enviarInstagram = (servicio) => {
    const mensaje = `Hola, me interesa este servicio:

${servicio.titulo}

Archivo:
${servicio.archivo}`;

    navigator.clipboard.writeText(mensaje);

    window.open("https://instagram.com/vipan_riobamba", "_blank");
  };
  return (
    <div className="servicios-container">
      <h2>Servicios</h2>

      {esAdmin && (
        <form className="form-servicio" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setArchivo(e.target.files[0])}
            required={!editando}
          />

          {editando && archivoActual && (
            <div className="preview-edicion">
              <p>
                Archivo actual:
                {archivoActual.split("/").pop()}
              </p>

              {archivoActual.includes(".mp4") ? (
                <video controls className="preview-media">
                  <source src={archivoActual} />
                </video>
              ) : (
                <img src={archivoActual} alt="" className="preview-media" />
              )}
            </div>
          )}

          <button type="submit">Agregar Servicio</button>
        </form>
      )}

      <div className="servicios-lista">
        {servicios.map((s) => (
          <div key={s._id}>
            {esAdmin ? (
              <div className="fila-admin">
                <span>{s.titulo}</span>

                <span>{s.archivo.split("/").pop()}</span>

                <div className="acciones-admin">
                  <button
                    className="btn-editar"
                    onClick={() => editarServicio(s)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="btn-eliminar"
                    onClick={() => {
                      setServicioEliminar(s._id);
                      setMostrarEliminar(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ) : (
              <div className="servicio-cliente">
                <h3>{s.titulo}</h3>

                {s.tipo === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    controls
                    className="media-servicio"
                  >
                    <source src={s.archivo} />
                  </video>
                ) : (
                  <img
                    src={s.archivo}
                    alt={s.titulo}
                    className="media-servicio"
                  />
                )}

                <div className="botones-contacto">
                  <button
                    className="btn-whatsapp"
                    onClick={() => enviarWhatsApp(s)}
                  >
                    <FaWhatsapp />
                  </button>

                  <button
                    className="btn-instagram"
                    onClick={() => enviarInstagram(s)}
                  >
                    <FaInstagram />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {mostrarEliminar && (
        <Animacion
          mensaje="¿Eliminar servicio?"
          video="/videos/eliminar.webm"
          mostrarBotones={true}
          cerrar={() => setMostrarEliminar(false)}
          onConfirm={eliminarServicio}
        />
      )}
    </div>
  );
}

export default Servicios;
