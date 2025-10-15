import "../styles/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa"; // 📦 icono del menú (hamburguesa)

function Navbar({ hideExtraButtons }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Estado del menú

  useEffect(() => {
    if (hideExtraButtons) return;

    const handleScroll = () => {
      const scrollThreshold = 100;
      setShowScrollToTop(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideExtraButtons]);

  const handleScrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false); // ✅ Cierra el menú al hacer clic
  };

  return (
    <div>
      {/* Botón "ir arriba" */}
      {!hideExtraButtons && showScrollToTop && (
        <button
          className="btn-up"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            className="btn-up"
            src={require("../img/flechaarriba.png")}
            alt="Ir arriba"
          />
        </button>
      )}

      <div className="header">
        <nav className="navbar">
          {/* ✅ Nuevo contenedor superior */}
          <div className="navbar-top">
            <div className="div-logo">
              <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
                Mapa de Plagas
              </Link>
            </div>

            {/* ✅ Botón menú responsive */}
            <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars />
            </div>
          </div>

          {/* ✅ Lista del menú */}
          <ul className={`nav-list ${menuOpen ? "active" : ""}`}>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <p
                className="nav-link"
                onClick={() => handleScrollTo("Mas_informacion")}
              >
                Más Información
              </p>
            </li>
            <li className="nav-item">
              <p className="nav-link" onClick={() => handleScrollTo("plagas")}>
                Plagas
              </p>
            </li>
            <li className="nav-item">
              <Link
                to="/plagueMap"
                className="btn-navbar"
                onClick={() => setMenuOpen(false)}
              >
                Plague Map
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/profile"
                    className="btn-navbar"
                    onClick={() => setMenuOpen(false)}
                  >
                    Perfil de {user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className="btn-navbar"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="btn-navbar"
                  >
                    Salir
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn-navbar"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn-navbar"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registrarte
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
