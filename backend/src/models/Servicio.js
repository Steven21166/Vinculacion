const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },

  archivo: {
    type: String,
    required: true,
  },

  tipo: {
    type: String,
    enum: ["imagen", "video"],
    required: true,
  },
});

module.exports = mongoose.model("Servicio", servicioSchema);
