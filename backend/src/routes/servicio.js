const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  crearServicio,
  obtenerServicios,
  editarServicio,
  eliminarServicio,
} = require("../controller/servicioController");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "servicios",
    resource_type: "auto",
  }),
});

const upload = multer({ storage });

router.post("/", upload.single("archivo"), crearServicio);

router.get("/", obtenerServicios);
router.put("/:id", upload.single("archivo"), editarServicio);

router.delete("/:id", eliminarServicio);

module.exports = router;
