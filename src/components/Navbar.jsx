import "../styles/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function Navbar({ hideExtraButtons }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para el botón "Ir arriba"
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Estado para el menú móvil
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (hideExtraButtons) return;

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
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
  };

  return (
    <div>
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
          <div className="div-logo">
            <Link to="/" className="logo">
              Mapa de Plagas
            </Link>
          </div>

          {/* Botón de menú para móviles */}
          <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>

          <ul className={`nav-list ${menuOpen ? "active" : ""}`}>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <p
                className="nav-link"
                onClick={() => handleScrollTo("Mas_informacion")}
              >
                Mas Información
              </p>
            </li>
            <li className="nav-item">
              <p className="nav-link" onClick={() => handleScrollTo("plagas")}>
                Plagas
              </p>
            </li>
            <li className="nav-item">
              <Link to="/plagueMap" className="btn-navbar">
                Plague Map
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="btn-navbar">
                    Perfil de {user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard" className="btn-navbar">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" onClick={() => logout()} className="btn-navbar">
                    Salir
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn-navbar">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn-navbar">
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
