import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserRequest } from "../api/users";
import "../styles/Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();

  // Estado para detalles personales
  const [details, setDetails] = useState({
    name: user?.name || "",
    user: user?.user || "",
    email: user?.email || "",
  });
  const [detailsMessage, setDetailsMessage] = useState({ type: "", text: "" });
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Estado para contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Función genérica para manejar cambios en formularios
  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "details") {
      setDetails((prev) => ({ ...prev, [name]: value }));
      setDetailsMessage({ type: "", text: "" });
    } else if (formType === "password") {
      setPasswordForm((prev) => ({ ...prev, [name]: value }));
      setPasswordMessage({ type: "", text: "" });
    }
  };

  const Message = ({ type, text, clearMessage }) => {
    useEffect(() => {
      if (text) {
        const timer = setTimeout(() => {
          clearMessage();
        }, 3000); // desaparece después de 3 segundos
        return () => clearTimeout(timer);
      }
    }, [text, clearMessage]);

    if (!text) return null;
    return <p className={`profile-message ${type}`}>{text}</p>;
  };

  // Actualizar detalles personales
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setIsDetailsLoading(true);
    setDetailsMessage({ type: "info", text: "Actualizando..." });

    try {
      const response = await updateUserRequest(
        user.id_reg,
        details,
        user.token
      );

      if (updateUser) {
        updateUser({ ...user, ...details }); // actualizar contexto
      }

      setDetailsMessage({
        type: "success",
        text: response.data.mensaje || "Detalles actualizados con éxito.",
      });
    } catch (error) {
      console.error("[DEBUG] Error al actualizar detalles:", error.response);
      const errorMessage =
        error.response?.data?.mensaje || "Error al actualizar detalles.";
      setDetailsMessage({ type: "error", text: errorMessage });
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMessage({ type: "info", text: "Cambiando contraseña..." });

    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    if (newPassword !== confirmNewPassword) {
      setIsPasswordLoading(false);
      return setPasswordMessage({
        type: "error",
        text: "Las nuevas contraseñas no coinciden.",
      });
    }

    if (newPassword.length < 6) {
      setIsPasswordLoading(false);
      return setPasswordMessage({
        type: "error",
        text: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
    }

    try {
      const dataToSend = {
        currentPassword,
        password: newPassword,
      };

      const response = await updateUserRequest(
        user.id_reg,
        dataToSend,
        user.token
      );

      setPasswordMessage({
        type: "success",
        text: response.data.mensaje || "Contraseña actualizada con éxito.",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("[DEBUG] Error al cambiar contraseña:", error.response);
      const errorMessage =
        error.response?.data?.mensaje ||
        "Error al cambiar contraseña. Verifica tu contraseña actual.";
      setPasswordMessage({ type: "error", text: errorMessage });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container loading">
        <div className="profile-card">
          <h2 className="profile-heading">Cargando Perfil</h2>
          <p>Por favor, espera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="main-title">Ajustes de Cuenta</h1>
      <p className="user-info-banner">
        Estás editando la cuenta:{" "}
        <span className="user-name-display">{user.user}</span>. Tu rol es{" "}
        <span className={`role-tag role-${user.role}`}>
          {user.role.toUpperCase()}
        </span>
      </p>

      <div className="profile-grid">
        {/* FORMULARIO DATOS PERSONALES */}
        <div className="profile-card details-card">
          <h2 className="card-title">Datos Personales</h2>
          <form className="profile-form" onSubmit={handleUpdateDetails}>
            <Message
              type={detailsMessage.type}
              text={detailsMessage.text}
              clearMessage={() => setDetailsMessage({ type: "", text: "" })}
            />

            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={details.name}
                onChange={(e) => handleChange(e, "details")}
                className="form-input"
                disabled={isDetailsLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user">Nombre de Usuario</label>
              <input
                type="text"
                id="user"
                name="user"
                value={details.user}
                onChange={(e) => handleChange(e, "details")}
                className="form-input"
                disabled={isDetailsLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={details.email}
                onChange={(e) => handleChange(e, "details")}
                className="form-input"
                disabled={isDetailsLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="action-button primary"
              disabled={isDetailsLoading}
            >
              {isDetailsLoading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            </button>
          </form>
        </div>

        {/* FORMULARIO CAMBIO CONTRASEÑA */}
        <div className="profile-card password-card">
          <h2 className="card-title">Cambiar Contraseña</h2>
          <form className="profile-form" onSubmit={handleChangePassword}>
            <Message
              type={passwordMessage.type}
              text={passwordMessage.text}
              clearMessage={() => setPasswordMessage({ type: "", text: "" })}
            />

            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña Actual</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => handleChange(e, "password")}
                className="form-input"
                placeholder="Ingresa tu contraseña actual"
                disabled={isPasswordLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => handleChange(e, "password")}
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                disabled={isPasswordLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirmar Nueva</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => handleChange(e, "password")}
                className="form-input"
                placeholder="Repite la nueva contraseña"
                disabled={isPasswordLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="action-button secondary"
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? "CAMBIANDO..." : "CAMBIAR CONTRASEÑA"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
