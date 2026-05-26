const Servicio = require("../models/Servicio");

const crearServicio = async (req, res) => {
  try {
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({
        mensaje: "Debe subir un archivo",
      });
    }

    const tipo = archivo.mimetype.startsWith("video") ? "video" : "imagen";

    const nuevoServicio = new Servicio({
      titulo: req.body.titulo,
      archivo: `/uploads/servicios/${archivo.filename}`,
      tipo,
    });

    await nuevoServicio.save();

    res.json(nuevoServicio);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al crear servicio",
    });
  }
};

const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();

    res.json(servicios);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener servicios",
    });
  }
};

const editarServicio = async (req, res) => {
  try {
    const datosActualizar = {
      titulo: req.body.titulo,
    };

    if (req.file) {
      const tipo = req.file.mimetype.startsWith("video") ? "video" : "imagen";

      datosActualizar.archivo = `/uploads/servicios/${req.file.filename}`;

      datosActualizar.tipo = tipo;
    }

    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true },
    );

    res.json(servicio);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al editar servicio",
    });
  }
};

const eliminarServicio = async (req, res) => {
  try {
    await Servicio.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Servicio eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar",
    });
  }
};

module.exports = {
  crearServicio,
  obtenerServicios,
  editarServicio,
  eliminarServicio,
};
