import io from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

// Crea una única instancia del socket.
// La conexión se establecerá inmediatamente.
export const socket = io(SOCKET_URL, {
  // Si usas opciones específicas (como transports)
  transports: ["websocket"],
});

// Opcional: Manejar eventos globales aquí.
socket.on("connect", () => {
  console.log("Socket.IO conectado al servidor.");
});

socket.on("connect_error", (err) => {
  console.error("Error al conectar Socket.IO:", err.message);
});

// Por defecto, se exporta la instancia del socket.
export default socket;
