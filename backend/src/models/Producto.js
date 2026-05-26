const { Schema, model } = require("mongoose");

const productoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },

    precioUnidad: { type: Number, required: false },
    precioCiento: { type: Number, required: false },

    imagen: { type: String, default: "" }, // URL de la imagen

    // 🔥 Aquí lo agregas
    enOferta: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = model("Producto", productoSchema);
