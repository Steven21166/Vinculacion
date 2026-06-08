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
    <div>
      <h1>LOGIN FUNCIONA</h1>
    </div>
  );
}

export default Login;
