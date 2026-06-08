const dns = require("dns");

// Forzar DNS públicos
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

//cadena de conexion
const URI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : "mongodb://localhost/dbtest";

mongoose
  .connect(URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
  })
  .catch((err) => {
    console.error("❌ Error MongoDB:");
    console.error(err);
  });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("La base de datos ha sido conectada: ", URI);
});
