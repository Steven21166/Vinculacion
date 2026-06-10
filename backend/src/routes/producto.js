const { Router } = require("express");
const router = Router();

const {
  getProduct,
  addProduct,
  getProducto,
  deleteProduct,
  updateProduct,
  getOfertas,
} = require("../controller/productoController");

const { verificarToken, verificarAdmin } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

console.log("=================================");
console.log("RUTA PRODUCTOS NUEVA CARGADA");
console.log("=================================");

router.get("/ofertas", getOfertas);

// 🔥 PONER AQUÍ
router.post("/upload-image", upload.single("imagen"), (req, res) => {
  console.log("UPLOAD RECIBIDO");

  if (!req.file) {
    return res.status(400).json({
      error: "No se recibió archivo",
    });
  }

  console.log(req.file);

  res.json({
    imageUrl: req.file.path,
  });
});

router.use((err, req, res, next) => {
  console.error("ERROR UPLOAD:");
  console.error(err);

  res.status(500).json({
    error: err.message,
  });
});

router
  .route("/")
  .get(getProduct)
  .post(verificarToken, verificarAdmin, addProduct);

router
  .route("/:id")
  .get(getProducto)
  .delete(verificarToken, verificarAdmin, deleteProduct)
  .put(verificarToken, verificarAdmin, updateProduct);

module.exports = router;
