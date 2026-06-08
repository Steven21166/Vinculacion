require("dotenv").config();

const dns = require("dns");

// Forzar DNS públicos
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Usuario = require("./src/models/Usuario");

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Conectado a MongoDB");

    const datosAdmin = {
      nombre: "Admin",
      apellido: "Principal",
      edad: 30,
      telefono: "0999999999",
      correo: "tifany.com.es@gmail.com",
      username: "VIPAN",
      password: "tifany123", // ⚠️ Se encripta en el modelo (pre-save)
      role: "admin",
      verificado: true,
      fotoPerfil: "/logo_vipan.png",
    };

    const existeAdmin = await Usuario.findOne({
      $or: [{ correo: datosAdmin.correo }, { username: datosAdmin.username }],
    });

    if (existeAdmin) {
      console.log("🆕 Admin ya existe, actualizando datos básicos...");

      // ⚠️ NO actualizar password automáticamente
      existeAdmin.nombre = datosAdmin.nombre;
      existeAdmin.apellido = datosAdmin.apellido;
      existeAdmin.telefono = datosAdmin.telefono;
      existeAdmin.role = "admin";
      existeAdmin.verificado = true;
      console.log("🆕 Admin ya existe, actualizando datos...");

      existeAdmin.nombre = datosAdmin.nombre;
      existeAdmin.apellido = datosAdmin.apellido;
      existeAdmin.edad = datosAdmin.edad;
      existeAdmin.telefono = datosAdmin.telefono;

      // ✅ ACTUALIZAR CREDENCIALES
      existeAdmin.correo = datosAdmin.correo;
      existeAdmin.username = datosAdmin.username;
      existeAdmin.password = datosAdmin.password;

      existeAdmin.role = "admin";
      existeAdmin.verificado = true;
      existeAdmin.fotoPerfil = datosAdmin.fotoPerfil;

      await existeAdmin.save();

      console.log("✅ Admin actualizado correctamente");
    } else {
      console.log("🆕 Creando administrador...");

      const admin = new Usuario(datosAdmin);
      await admin.save();

      console.log("✅ Administrador creado con éxito");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear/actualizar admin:", error.message);
    process.exit(1);
  }
};

crearAdmin();
