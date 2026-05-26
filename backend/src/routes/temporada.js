const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
  crearTemporada,
  obtenerTemporadas,
  editarTemporada,
  eliminarTemporada,
} = require("../controller/temporadaController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/temporada");
  },

  filename: (req, file, cb) => {
    const nombre = Date.now() + path.extname(file.originalname);

    cb(null, nombre);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("imagen"), crearTemporada);

router.get("/", obtenerTemporadas);

router.put("/:id", upload.single("imagen"), editarTemporada);

router.delete("/:id", eliminarTemporada);

module.exports = router;
