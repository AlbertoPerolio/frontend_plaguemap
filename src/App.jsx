import "./App.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import InfPlag from "./pages/InfPlag";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PlagueMap from "./pages/PlagueMap";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Componente Wrapper para usar useLocation
function AppContent() {
  const location = useLocation();

  // Rutas donde queremos ocultar el Footer Y los botones extra del Navbar
  const hideExtraElementsPaths = ["/plagueMap"];

  const isMapRoute = hideExtraElementsPaths.includes(location.pathname);
  const shouldShowFooter = !isMapRoute; // Oculta el Footer en el mapa

  return (
    <>
      {/* Pasamos el prop 'hideExtraButtons' al Navbar */}
      <Navbar hideExtraButtons={isMapRoute} />
      <div className="main-content">
        <Routes>
          {/* rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/InfPlag" element={<InfPlag />} />
          <Route path="/plagueMap" element={<PlagueMap />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/dates" element={<Dates />} /> */}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>

      {/* Renderizado condicional del Footer */}
      {shouldShowFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          {/* El contenido principal se mueve a AppContent */}
          <AppContent />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
