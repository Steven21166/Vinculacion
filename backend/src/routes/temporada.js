const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const express = require("express");
const router = express.Router();

const multer = require("multer");

const {
  crearTemporada,
  obtenerTemporadas,
  editarTemporada,
  eliminarTemporada,
} = require("../controller/temporadaController");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "temporadas",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage });

router.post("/", upload.single("imagen"), crearTemporada);

router.get("/", obtenerTemporadas);

router.put("/:id", upload.single("imagen"), editarTemporada);

router.delete("/:id", eliminarTemporada);

module.exports = router;
