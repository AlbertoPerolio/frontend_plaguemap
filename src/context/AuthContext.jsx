import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import axios from "../api/axios";

export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // --- Registro ---
  const signup = async (userData) => {
    try {
      await registerRequest(userData);
      await signin({ user: userData.user, password: userData.password });
    } catch (error) {
      setErrors(error.response?.data || { message: "Error de registro" });
    }
  };

  // --- Login ---
  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      setUser(res.data.user); // el token ya está en cookie httpOnly
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response?.data || { message: "Error de login" });
    }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true }); // Borra cookie
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // --- Limpieza de errores automáticos ---
  useEffect(() => {
    if (errors.body) {
      const timer = setTimeout(() => setErrors({}), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // --- Verificar sesión al iniciar ---
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyTokenRequest();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, user, isAuthenticated, errors, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
