const { Schema, model } = require("mongoose");

const categoriaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imagen: {
      type: String, // 👈 AGREGA ESTO
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Categoria", categoriaSchema);
