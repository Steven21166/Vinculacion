const Temporada = require("../models/Temporada");

const crearTemporada = async (req, res) => {
  try {
    const nuevaTemporada = new Temporada({
      nombre: req.body.nombre,

      descripcion: req.body.descripcion,

      imagen: req.file ? `/temporada/${req.file.filename}` : "",
    });

    await nuevaTemporada.save();

    res.status(201).json(nuevaTemporada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const obtenerTemporadas = async (req, res) => {
  try {
    const temporadas = await Temporada.find().sort({
      createdAt: -1,
    });

    res.json(temporadas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const editarTemporada = async (req, res) => {
  try {
    const temporada = await Temporada.findById(req.params.id);

    if (!temporada) {
      return res.status(404).json({ mensaje: "Temporada no encontrada" });
    }

    temporada.nombre = req.body.nombre || temporada.nombre;

    temporada.descripcion = req.body.descripcion || temporada.descripcion;

    if (req.file) {
      temporada.imagen = `/temporada/${req.file.filename}`;
    }

    await temporada.save();

    res.json(temporada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const eliminarTemporada = async (req, res) => {
  try {
    await Temporada.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Temporada eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearTemporada,
  obtenerTemporadas,
  editarTemporada,
  eliminarTemporada,
};
