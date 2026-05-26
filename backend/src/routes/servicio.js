const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
  crearServicio,
  obtenerServicios,
  editarServicio,
  eliminarServicio,
} = require("../controller/servicioController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/servicios");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("archivo"), crearServicio);

router.get("/", obtenerServicios);
router.put("/:id", upload.single("archivo"), editarServicio);

router.delete("/:id", eliminarServicio);

module.exports = router;
