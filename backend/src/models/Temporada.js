const mongoose = require("mongoose");

const temporadaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },

  descripcion: {
    type: String,
    required: true,
  },

  imagen: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Temporada", temporadaSchema);
