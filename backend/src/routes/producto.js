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

router.get("/ofertas", getOfertas);

router
  .route("/")
  .get(getProduct)
  .post(verificarToken, verificarAdmin, addProduct);

router
  .route("/:id")
  .get(getProducto)
  .delete(verificarToken, verificarAdmin, deleteProduct)
  .put(verificarToken, verificarAdmin, updateProduct);

// ✅ Ruta corregida para devolver URL completa
router.post("/upload-image", (req, res) => {
  console.log("ENTRO A /upload-image");

  res.status(200).json({
    mensaje: "Ruta funcionando",
  });
});

module.exports = router;
