const express = require("express");
const router = express.Router();

// 🔒 Middlewares (DESACTIVADOS TEMPORALMENTE)
const { verificarToken } = require("../middlewares/auth");
const { uploadPerfiles } = require("../middlewares/upload");

const usuarioController = require("../controller/usuarioController");

router.get("/:id", verificarToken, usuarioController.getUsuario);

router.put(
  "/perfil/:id",
  verificarToken,
  uploadPerfiles.single("fotoPerfil"),
  usuarioController.updatePerfil,
);

module.exports = router;
