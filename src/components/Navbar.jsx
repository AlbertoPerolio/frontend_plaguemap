import "../styles/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react"; // 🚨 Agregamos useState y useEffect

function Navbar({ hideExtraButtons }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🚨 1. Nuevo estado para controlar la visibilidad del botón "Ir arriba"
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // 🚨 2. Lógica para manejar el evento de scroll
  useEffect(() => {
    // Si estamos en una ruta donde los botones están ocultos (ej. /plagueMap), no ejecutamos la lógica de scroll
    if (hideExtraButtons) return;

    const handleScroll = () => {
      // Muestra el botón si el scroll vertical es mayor a 100 píxeles
      const scrollThreshold = 100;
      if (window.scrollY > scrollThreshold) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    // Añadir el listener cuando el componente se monta
    window.addEventListener("scroll", handleScroll);

    // Limpiar el listener cuando el componente se desmonta o hideExtraButtons cambia
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hideExtraButtons]); // Dependencia clave para manejar la ruta del mapa

  const handleScrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      {/* 🚨 El contenedor general se mantiene para la lógica de hideExtraButtons */}
      {!hideExtraButtons && (
        <>
          {/* 🚨 Botón de Volver Arriba: Ahora depende de showScrollToTop */}
          {showScrollToTop && (
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
        </>
      )}

      <div className="header">
        <nav className="navbar">
          <div className="div-logo">
            <Link to="/" className="logo">
              Mapa de Plagas
            </Link>
          </div>

          <ul className="nav-list">
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
                {/* <li className="nav-item">
                  <Link to="/dates" className="btn-navbar">
                    Datos
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link
                    to="/"
                    onClick={() => {
                      logout();
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
