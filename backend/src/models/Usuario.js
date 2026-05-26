const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new Schema(
  {
    nombre: String,
    apellido: String,
    edad: Number,
    telefono: String,
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    // 🔒 Agregado: nombre de usuario único para login
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // 🔒 Agregado: contraseña del usuario
    password: {
      type: String,
      required: true,
    },
    // 🧑‍💼 Agregado: rol del usuario (admin o cliente)
    role: {
      type: String,
      enum: ["admin", "cliente"],
      default: "cliente",
    },
    // ✅ Nuevo: campo para verificar usuario por correo
    verificado: {
      type: Boolean,
      default: false,
    },
    // ✅ Nuevo: para guardar temporalmente el PIN de verificación
    codigoVerificacion: {
      type: String,
      required: false,
    },

    fotoPerfil: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// 🔐 Hash automático de la contraseña antes de guardar
usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = model("Usuario", usuarioSchema);
