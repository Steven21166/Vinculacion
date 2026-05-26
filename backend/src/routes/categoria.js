const { Router } = require("express");
const router = Router();

const {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} = require("../controller/categoriaController");

const { upload } = require("../middlewares/upload");

// 🔥 Rutas públicas (o protégelas si quieres)
router.get("/", getCategorias);

router.post(
  "/",
  upload.single("imagen"), // 👈 CLAVE TOTAL
  createCategoria,
);

router.put(
  "/:id",
  upload.single("imagen"), // 👈 IMPORTANTE
  updateCategoria,
);
router.delete("/:id", deleteCategoria);

module.exports = router;
