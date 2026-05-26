const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuarioController");

// 🔐 Login SOLO admin
router.post("/login", usuarioController.login);

module.exports = router;
