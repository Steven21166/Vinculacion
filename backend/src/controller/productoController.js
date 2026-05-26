const Producto = require("../models/Producto");
const productoCtrl = {};

productoCtrl.getProduct = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

// ✅ Crear producto con etiqueta si está en oferta
productoCtrl.addProduct = async (req, res) => {
  const { nombre, categoria, precioUnidad, precioCiento, imagen, enOferta } =
    req.body;

  if (!imagen) {
    return res.status(400).json({ mensaje: "Se requiere una imagen" });
  }

  try {
    const isOferta = enOferta === true || enOferta === "true";
    const etiqueta = isOferta ? "🔥 En oferta" : "";

    const newProduct = new Producto({
      nombre,
      categoria,
      precioUnidad,
      precioCiento,
      imagen,
      enOferta: isOferta,
      etiqueta, // ✅ Se asigna o limpia automáticamente
    });

    await newProduct.save();
    res.status(201).json({ message: "Producto creado", producto: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el producto", error: error.message });
  }
};

productoCtrl.getProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el producto", error: error.message });
  }
};

productoCtrl.deleteProduct = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el producto", error: error.message });
  }
};

// ✅ Actualiza etiqueta según enOferta
productoCtrl.updateProduct = async (req, res) => {
  const { nombre, categoria, precioValor, unidadPrecio, imagen, enOferta } =
    req.body;

  try {
    const isOferta = enOferta === true || enOferta === "true";
    const etiqueta = isOferta ? "🔥 En oferta" : "";

    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        categoria,
        precioValor,
        unidadPrecio,
        imagen,
        enOferta: isOferta,
        etiqueta, // ✅ Se actualiza o limpia
      },
      { new: true },
    );

    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", producto });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

productoCtrl.getOfertas = async (req, res) => {
  try {
    const ofertas = await Producto.find({ enOferta: true });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener ofertas",
      error: error.message,
    });
  }
};

module.exports = productoCtrl;
