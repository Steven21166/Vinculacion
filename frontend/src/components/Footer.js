import "../styles/Footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LOGO SOLO */}
        <div className="footer-section">
          <img src="/logo_vipan.png" alt="VIPAN" className="footer-logo" />
        </div>

        {/* CONTACTO */}
        <div className="footer-section">
          <h3>CONTÁCTANOS</h3>
          <p>📞 0987103448</p>
          <p>📍 Riobamba - Ecuador</p>
          <p>📍 Sector de Bellavista calle Morona y la 35.</p>
        </div>

        {/* ENLACES */}
        <div className="footer-section">
          <h3>ENLACES</h3>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/productos">Productos</Link>
            </li>

            <li>
              <Link to="/servicios">Servicios</Link>
            </li>
          </ul>
        </div>

        {/* REDES */}
        <div className="footer-section">
          <h3>REDES SOCIALES</h3>
          <div className="socials">
            <a
              href="https://www.instagram.com/vipan_riobamba?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/593987103448?text=Hola,%20quiero%20información%20sobre%20VIPAN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 VIPAN - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;
