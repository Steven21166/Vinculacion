import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import "../styles/AgregarProducto.css";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import Animacion from "./Animacion";

function AgregarProducto({ productoEditar, cerrar }) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precioUnidad: "",
    precioCiento: "",
    imagen: "",
    enOferta: false,
  });

  const obtenerCategorias = async () => {
    try {
      const res = await fetch("https://vipan-backend.onrender.com/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [imagenPreview, setImagenPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [imagenCategoria, setImagenCategoria] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [nombreEditar, setNombreEditar] = useState("");
  const [imagenEditar, setImagenEditar] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);

  useEffect(() => {
    if (productoEditar) {
      setForm({
        nombre: productoEditar.nombre || "",
        categoria: productoEditar.categoria || "",
        precioUnidad: productoEditar.precioUnidad || "",
        precioCiento: productoEditar.precioCiento || "",
        imagen: productoEditar.imagen || "",
        enOferta: productoEditar.enOferta || false,
      });

      if (productoEditar.imagen) {
        setImagenPreview(productoEditar.imagen);
      }
    }
  }, [productoEditar]);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      console.log(
        "Tamaño original:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.9,
      };

      const compressedFile = await imageCompression(file, options);

      console.log(
        "Tamaño comprimido:",
        (compressedFile.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      const preview = URL.createObjectURL(compressedFile);
      setImagenPreview(preview);

      const formData = new FormData();
      formData.append("imagen", compressedFile);

      const res = await fetch(
        "https://vipan-backend.onrender.com/productos/upload-image",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      console.log("Respuesta upload:", data);

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          imagen: data.imageUrl,
        }));
      } else {
        alert(data.error || "Error al subir imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar imagen");
    }
  };

  // 🔥 CREAR PRODUCTO
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM ENVIADO:", form);

    const token = localStorage.getItem("token");

    try {
      const url = productoEditar
        ? `https://vipan-backend.onrender.com/productos/${productoEditar._id}`
        : "https://vipan-backend.onrender.com/productos";

      const method = productoEditar ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        setMostrarAnimacion(true);

        setTimeout(() => {
          if (cerrar) cerrar();
          window.location.reload();
        }, 5000);
      } else {
        alert(data.mensaje || "Error");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar");
    }
  };

  const handleAgregarCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    const formData = new FormData();
    formData.append("nombre", nuevaCategoria);
    formData.append("imagen", imagenCategoria);

    await fetch("https://vipan-backend.onrender.com/categorias", {
      method: "POST",
      body: formData, // 👈 CLAVE
    });

    setNuevaCategoria("");
    setImagenCategoria(null);
    obtenerCategorias();
  };

  const handleEditarCategoria = async (id) => {
    if (!nombreEditar.trim()) return;

    const formData = new FormData();
    formData.append("nombre", nombreEditar);

    if (imagenEditar) {
      formData.append("imagen", imagenEditar);
    }

    const res = await fetch(
      `https://vipan-backend.onrender.com/categorias/${id}`,
      {
        method: "PUT",
        body: formData,
      },
    );

    if (!res.ok) return;

    const categoriaActualizada = await res.json();

    const nuevasCategorias = categorias.map((cat) =>
      cat._id === id ? categoriaActualizada : cat,
    );

    setCategorias(nuevasCategorias);

    // 🔥 LIMPIEZA
    setCategoriaEditar(null);
    setNombreEditar("");
    setImagenEditar(null);

    // 🔥 CERRAR MODAL DE EDICIÓN
    setMostrarModalEditar(false);
  };

  const eliminarCategoria = async () => {
    if (!categoriaEliminar) return;

    await fetch(
      `https://vipan-backend.onrender.com/categorias/${categoriaEliminar}`,
      {
        method: "DELETE",
      },
    );

    obtenerCategorias();

    setMostrarEliminar(false);
    setCategoriaEliminar(null);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>{productoEditar ? "Editar Producto" : "Agregar Producto"}</h2>

        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <div className="categoria-row">
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setMostrarModal(true)}
            className="btn-agregar"
          >
            + Nueva
          </button>
        </div>

        <div className="row">
          <input
            name="precioUnidad"
            type="number"
            placeholder="Precio por unidad"
            value={form.precioUnidad || ""}
            onChange={handleChange}
          />

          <input
            name="precioCiento"
            type="number"
            placeholder="Precio por ciento"
            value={form.precioCiento || ""}
            onChange={handleChange}
          />
        </div>

        {/* 🔥 IMAGEN */}
        <input type="file" accept="image/*" onChange={handleImagenChange} />

        {/* Mostrar preview */}
        {imagenPreview && <img src={imagenPreview} alt="preview" width="120" />}

        {/* 🔥 OFERTA */}
        <label>
          <input
            type="checkbox"
            name="enOferta"
            checked={form.enOferta}
            onChange={handleChange}
          />
          En oferta
        </label>

        <button type="submit">Guardar Producto</button>
      </form>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Gestionar Categorías</h3>

            {/* CREAR */}
            <input
              placeholder="Nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => setImagenCategoria(e.target.files[0])}
            />

            <button onClick={handleAgregarCategoria}>Guardar Categorías</button>

            <hr />

            {/* LISTA */}
            <ul className="lista-categorias">
              {categorias.map((cat) => (
                <li key={cat._id} className="item-categoria">
                  {categoriaEditar === cat._id ? (
                    <>
                      <input
                        value={nombreEditar}
                        onChange={(e) => setNombreEditar(e.target.value)}
                      />

                      <input
                        type="file"
                        onChange={(e) => setImagenEditar(e.target.files[0])}
                      />

                      <button
                        onClick={() => handleEditarCategoria(cat._id)}
                        className="btn-icon guardar"
                      >
                        <FaSave />
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{cat.nombre}</span>

                      <div className="acciones">
                        <button
                          onClick={() => {
                            setCategoriaSeleccionada(cat);
                            setNombreEditar(cat.nombre);
                            setMostrarModalEditar(true);
                          }}
                          className="btn-icon editar"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => {
                            setCategoriaEliminar(cat._id);
                            setMostrarEliminar(true);
                          }}
                          className="btn-icon eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {mostrarModalEditar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Categoría</h3>

            <input
              value={nombreEditar}
              onChange={(e) => setNombreEditar(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setImagenEditar(e.target.files[0])}
            />

            {/* 🔥 preview actual */}
            {categoriaSeleccionada?.imagen && !imagenEditar && (
              <img
                src={categoriaSeleccionada.imagen}
                alt="Vista previa"
                width="100"
              />
            )}

            {/* 🔥 preview nueva */}
            {imagenEditar && (
              <img
                src={URL.createObjectURL(imagenEditar)}
                alt="Vista previa"
                width="100"
              />
            )}

            <button
              onClick={() => handleEditarCategoria(categoriaSeleccionada._id)}
            >
              Guardar cambios
            </button>

            <button onClick={() => setMostrarModalEditar(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrarAnimacion && (
        <Animacion
          video={
            productoEditar
              ? "/videos/PRODUCTOEDITAR.webm"
              : "/videos/PRODUCTOagregado.webm"
          }
        />
      )}

      {mostrarEliminar && (
        <Animacion
          mensaje="¿Eliminar categoría?"
          video="/videos/eliminar.webm"
          mostrarBotones={true}
          cerrar={() => setMostrarEliminar(false)}
          onConfirm={eliminarCategoria}
        />
      )}
    </div>
  );
}

export default AgregarProducto;
