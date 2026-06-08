require("dotenv").config(); // Carga variables del .env

const express = require("express");
const cors = require("cors");
const path = require("path");
const Usuario = require("./models/Usuario");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const servicioRoutes = require("./routes/servicio");

const app = express();

// Configuración
app.set("port", process.env.PORT || 4000);

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.get("/", (req, res) => {
  res.send("bienvenido a vinculacion");
});

// ✅ Solo servir imágenes subidas por el admin en public/uploads
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", require("./routes/auth"));
app.use("/usuarios", require("./routes/usuario"));
app.use("/productos", require("./routes/producto"));
app.use("/categorias", require("./routes/categoria"));
app.use("/servicios", servicioRoutes);
app.use("/temporadas", require("./routes/temporada"));

// ✅ Ruta de prueba de login
app.get("/debug/login", async (req, res) => {
  try {
    const user = await Usuario.findOne({ username: "VIPAN" });
    if (!user) return res.send("❌ No se encontró el usuario admin");

    const match = await bcrypt.compare("tifany123", user.password);
    if (!match) return res.send("❌ La contraseña no coincide");

    res.send("✅ Login exitoso con VIPAN/tifany123");
  } catch (err) {
    console.error("🔥 Error:", err.message);
    res.status(500).send("❌ Error del servidor");
  }
});

module.exports = app;
