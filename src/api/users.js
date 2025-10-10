import axios from "./axios";

// 1. Obtener la lista de usuarios con sus roles
export const getUsersRequest = () =>
  axios.get("/users", { withCredentials: true });

// 2. Cambiar el rol en el backend (PUT /users/:id/role)
export const updateUserRoleRequest = (id_reg, newRole) =>
  axios.put(
    `/users/${id_reg}/role`,
    { role: newRole },
    { withCredentials: true }
  );

// 3. Actualizar datos de usuario
export const updateUserRequest = (id_reg, data) =>
  axios.put(`/users/${id_reg}`, data, { withCredentials: true }).then((res) => {
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
