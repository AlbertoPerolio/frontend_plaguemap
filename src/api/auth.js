import axios from "./axios";

export const registerRequest = (user) => axios.post("/users", user);

export const loginRequest = async (user) => {
  // Login normal (envía credenciales)
  const res = await axios.post("/auth/login", user, { withCredentials: true });

  // Esperar un poco antes de verificar el token (para evitar “Token requerido”)
  setTimeout(async () => {
    try {
      const verifyRes = await axios.get("/auth/verify", {
        withCredentials: true,
      });
      console.log("Token verificado:");
    } catch (err) {
      console.warn("Error al verificar token tras login:", err);
    }
  }, 400);

  return res.data;
};

export const verifyTokenRequest = () =>
  axios.get("/auth/verify", { withCredentials: true });

export const logoutRequest = () =>
  axios.post("/auth/logout", null, { withCredentials: true });
