const jwt = require("jsonwebtoken");

// 🔐 Verificar token
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Validar formato Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ mensaje: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardamos datos del token
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// 🛡️ Verificar si es admin
const verificarAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.role !== "admin") {
    return res
      .status(403)
      .json({ mensaje: "Acceso solo para administradores" });
  }

  next();
};

module.exports = {
  verificarToken,
  verificarAdmin,
};
