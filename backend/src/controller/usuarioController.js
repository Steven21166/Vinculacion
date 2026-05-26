const usuarioCtrl = {};
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Obtener todos los usuarios
usuarioCtrl.getUsu = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

// Obtener usuario por ID ✅ id devuelto como string
usuarioCtrl.getUsuario = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json({
    id: usuario._id.toString(),
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    telefono: usuario.telefono,
    edad: usuario.edad,
    correo: usuario.correo,
    username: usuario.username,
    role: usuario.role,
    verificado: usuario.verificado,
    fotoPerfil: usuario.fotoPerfil || null,
  });
};

// Eliminar usuario
usuarioCtrl.deleteUsu = async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
};

// Actualizar usuario
usuarioCtrl.updateUsu = async (req, res) => {
  const { nombre, apellido, correo, telefono, edad } = req.body;
  await Usuario.findByIdAndUpdate(req.params.id, {
    nombre,
    apellido,
    correo,
    telefono,
    edad,
  });
  res.json({ message: "El usuario ha sido actualizado" });
};

// ✅ LOGIN CORREGIDO
usuarioCtrl.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario || usuario.role !== "admin") {
      return res.status(403).json({
        mensaje: "Acceso solo para administrador",
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(), // ⚡ 100% asegurado como string
        nombre: usuario.nombre,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
    );

    res.json({
      token,
      usuario: {
        id: usuario._id.toString(), // ⚡ 100% asegurado como string
        nombre: usuario.nombre,
        role: usuario.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

// Actualizar perfil
usuarioCtrl.updatePerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono, edad } = req.body;
    let fotoPerfil = null;

    if (req.file) {
      fotoPerfil = `/perfiles/${req.file.filename}`;
    }

    const actualizacion = { nombre, apellido, telefono, edad };
    if (fotoPerfil) actualizacion.fotoPerfil = fotoPerfil;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      actualizacion,
      { new: true },
    );

    res.json({
      message: "Perfil actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

module.exports = usuarioCtrl;
