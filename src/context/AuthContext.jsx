import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import axios from "../api/axios";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Registro
  const signup = async (userData) => {
    try {
      await registerRequest(userData);
      await signin({ user: userData.user, password: userData.password });
    } catch (error) {
      setErrors(error.response?.data || { message: "Error de registro" });
    }
  };

  // Login
  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      setUser(res.data.user); // cookie httpOnly maneja token
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response?.data || { message: "Error de login" });
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post("/auth/logout"); // borra cookie
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Limpiar errores automáticamente
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Verificar sesión al iniciar
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyTokenRequest();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  // Actualizar rol si cambia (para panel admin en tiempo real)
  useEffect(() => {
    if (user?.role === "admin") {
      // Aquí podrías disparar la carga de usuarios/admin data
      // Ej: dispatch(fetchUsers()) o usar otro hook para dashboard
    }
  }, [user?.role]);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        user,
        isAuthenticated,
        errors,
        loading,
        setUser, // opcional si quieres actualizar user desde dashboard
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
