const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const multer = require("multer");
const path = require("path");

// Extensiones permitidas
const EXTENSIONES_PERMITIDAS = /jpeg|jpg|png|gif/;

// Configuración de almacenamiento
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "productos",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

// ✅ Agrega después de `const storage = multer.diskStorage(...)`:

const storagePerfiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/perfiles"));
  },
  filename: function (req, file, cb) {
    const nombreSeguro =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, nombreSeguro);
  },
});

// Validación del tipo de archivo
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const esExtensionValida = EXTENSIONES_PERMITIDAS.test(ext);
  const esMimeValido = EXTENSIONES_PERMITIDAS.test(mime);

  if (esExtensionValida && esMimeValido) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // Máximo 5 MB
  },
});

const uploadPerfiles = multer({
  storage: storagePerfiles,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
module.exports = { upload, uploadPerfiles };
