const Categoria = require("../models/Categoria");

const categoriaCtrl = {};

// 🔥 Obtener todas
categoriaCtrl.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// 🔥 Crear categoría
categoriaCtrl.createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: "Nombre requerido" });
    }

    const existe = await Categoria.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ mensaje: "La categoría ya existe" });
    }

    const nueva = new Categoria({
      nombre,
      imagen: req.file ? req.file.filename : null,
    });
    await nueva.save();

    res.json(nueva);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// 🔥 ACTUALIZAR CATEGORIA
categoriaCtrl.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: "Nombre requerido" });
    }

    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    // 🔥 SI VIENE NUEVA IMAGEN, SE ACTUALIZA
    if (req.file) {
      categoria.imagen = req.file.filename;
    }

    categoria.nombre = nombre;

    await categoria.save();

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// 🔥 ELIMINAR CATEGORIA
categoriaCtrl.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminada = await Categoria.findByIdAndDelete(id);

    if (!eliminada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = categoriaCtrl;
