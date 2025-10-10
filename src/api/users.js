import axios from "./axios";

// 1. Necesaria para obtener la lista de usuarios con sus roles
export const getUsersRequest = () => axios.get("/users");

// 2. Necesaria para cambiar el rol en el backend (usa la ruta PUT /users/:id/role)
export const updateUserRoleRequest = (id_reg, newRole) =>
  axios.put(`/users/${id_reg}/role`, { role: newRole });

// 🛑 3. NUEVA FUNCIÓN: Actualizar datos de perfil (PUT /users/:id) 🛑
// Esta función se usa tanto para cambiar detalles como para cambiar la contraseña.

export const updateUserRequest = (id_reg, data, token) =>
  axios
    .put(`/users/${id_reg}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((res) => {
      // devolvemos el mismo formato que espera el frontend
      return {
        data: {
          mensaje: res.data.mensaje,
          usuario: {
            id_reg: res.data.id_reg,
            name: res.data.name,
            user: res.data.user,
            email: res.data.email,
          },
        },
      };
    });
