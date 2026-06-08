import { useState } from "react";
import "../styles/Login.css";
import Animacion from "../components/Animacion";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [video, setVideo] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://vipan-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setVideo("/videos/SESION.webm");
        setMostrarAnimacion(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 6000);
      } else {
        setVideo("/videos/errorsesion.webm");
        setMostrarAnimacion(true);

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Acceso Administrador</h2>
        <img
          src="/verificacion.png"
          alt="Verificación"
          className="img-verificacion"
        />
        <h6>
          Hola, para ingresar al modo administrador ingresa las credenciales
        </h6>

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>

      {mostrarAnimacion && (
        <Animacion video={video} cerrar={() => setMostrarAnimacion(false)} />
      )}
    </div>
  );
}

export default Login;
