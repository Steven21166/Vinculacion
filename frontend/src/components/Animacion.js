import React from "react";
import "../styles/Animacion.css";

const Animacion = ({
  mensaje,
  video,
  cerrar,
  onConfirm,
  mostrarBotones = false,
}) => {
  return (
    <div className="overlay-animacion">
      <div className="contenedor-animacion">
        <video autoPlay muted playsInline className="video-alerta">
          <source src={video} type="video/webm" />
        </video>

        <h2>{mensaje}</h2>

        {mostrarBotones && (
          <div className="contenedor-botones">
            <button className="btn-cancelar" onClick={cerrar}>
              Cancelar
            </button>

            <button className="btn-eliminar" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Animacion;
