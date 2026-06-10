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

// 🔥 PONER AQUÍ
router.post("/upload-image", (req, res) => {
  res.json({
    ok: true,
    mensaje: "upload funcionando",
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
