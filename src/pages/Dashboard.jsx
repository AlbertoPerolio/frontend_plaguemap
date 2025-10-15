import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMarkersRequest,
  deleteMarkerRequest,
  approveMarkerRequest,
} from "../api/markers";
import { getUsersRequest, updateUserRoleRequest } from "../api/users";
import socket from "../api/socket";
import * as XLSX from "xlsx";

import "../styles/Dashboard.css";
import ImageModal from "../components/ImageModal";
import ConfirmationModal from "../components/ConfirmationModal";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [filters, setFilters] = useState({
    status: user?.role === "admin" ? "all" : "approved",
    plagueType: "all",
    showMyReports: false,
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);

  const [modalImage, setModalImage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    idToDelete: null,
  });
  const [roleConfirm, setRoleConfirm] = useState({
    isOpen: false,
    id_reg: null,
    newRole: null,
    username: "",
  });

  // ------------------ Fetch Markers & Users ------------------
  const fetchMarkers = useCallback(async () => {
    setLoading(true);

    let users = [];
    try {
      const usersResponse = await getUsersRequest();
      users = Array.isArray(usersResponse.data?.body)
        ? usersResponse.data.body
        : Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [];
      setUserList(users);
    } catch (error) {
      console.warn(
        "Fallo al cargar usuarios (posiblemente por permisos de admin). Continuando sin nombres de usuario..."
      );
    }

    const userMap = new Map(
      users.map((u) => [
        u.id_reg.toString(),
        { username: u.name, role: u.role },
      ])
    );

    try {
      const markersResponse = await getMarkersRequest();
      const markers = Array.isArray(markersResponse.data)
        ? markersResponse.data
        : [];

      const enrichedMarkers = markers.map((m) => {
        const userData = userMap.get(m.id_reg?.toString()) || {
          username: "Desconocido",
          role: "user",
        };
        return { ...m, username: userData.username, userRole: userData.role };
      });

      setAllMarkers(enrichedMarkers);
    } catch (error) {
      console.error("Error fetching markers:", error);
      setAllMarkers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------ WebSockets ------------------
  useEffect(() => {
    fetchMarkers();

    const onMarkerChange = () => {
      console.log("Websocket: Cambio en marcador detectado. Recargando...");
      fetchMarkers();
    };

    socket.on("marker_added", onMarkerChange);
    socket.on("marker_approved", onMarkerChange);
    socket.on("marker_deleted", onMarkerChange);
    socket.on("marker_updated", onMarkerChange);

    return () => {
      socket.off("marker_added", onMarkerChange);
      socket.off("marker_approved", onMarkerChange);
      socket.off("marker_deleted", onMarkerChange);
      socket.off("marker_updated", onMarkerChange);
    };
  }, [fetchMarkers]);

  // ------------------ Roles ------------------
  const handleRoleChange = (id_reg, newRole, username) => {
    if (id_reg === user.id_reg) {
      alert("No puedes cambiar tu propio rol desde el panel de reportes.");
      return;
    }

    const currentUserRole = userList.find((u) => u.id_reg === id_reg)?.role;
    if (currentUserRole === newRole) return;

    if (newRole === "admin" || newRole === "user") {
      setRoleConfirm({ isOpen: true, id_reg, newRole, username });
    }
  };

  const confirmRoleChange = async () => {
    if (roleConfirm.id_reg && roleConfirm.newRole) {
      try {
        await updateUserRoleRequest(roleConfirm.id_reg, roleConfirm.newRole);

        setUserList((prevUsers) =>
          prevUsers.map((u) =>
            u.id_reg === roleConfirm.id_reg
              ? { ...u, role: roleConfirm.newRole }
              : u
          )
        );

        setAllMarkers((prevMarkers) =>
          prevMarkers.map((marker) =>
            marker.id_reg === roleConfirm.id_reg
              ? { ...marker, userRole: roleConfirm.newRole }
              : marker
          )
        );
      } catch (error) {
        console.error(
          "Error al actualizar el rol:",
          error.response?.data || error
        );
        alert(
          "Hubo un error al intentar cambiar el rol. Verifica tu conexión y permisos."
        );
      }
    }

    setRoleConfirm({
      isOpen: false,
      id_reg: null,
      newRole: null,
      username: "",
    });
  };

  const cancelRoleChange = () =>
    setRoleConfirm({
      isOpen: false,
      id_reg: null,
      newRole: null,
      username: "",
    });

  const getRoleConfirmationMessage = () => {
    const isPromoting = roleConfirm.newRole === "admin";
    const action = isPromoting
      ? "otorgar el rol de ADMINISTRADOR"
      : "degradar al usuario a un rol estándar USUARIO";
    const warning = isPromoting
      ? "Esta acción le dará control total sobre el sistema, incluyendo otros usuarios y reportes."
      : "Esto limitará sus privilegios a reportes personales y navegación básica.";

    return `¿Estás SEGURO de que quieres ${action} al usuario ${roleConfirm.username}? ${warning} Esta acción es irreversible.`;
  };

  // ------------------ Modales ------------------
  const openImageModal = (imageUrl) => setModalImage(imageUrl);
  const closeImageModal = () => setModalImage(null);

  const handleGoToLocation = (lat, lng) =>
    navigate(`/plagueMap?lat=${lat}&lng=${lng}`);

  const handleEdit = (idplague) =>
    navigate("/plagueMap", { state: { action: "edit", idplague } });

  const handleDelete = (idplague) =>
    setConfirmModal({ isOpen: true, idToDelete: idplague });

  const confirmDelete = async () => {
    if (confirmModal.idToDelete) {
      await deleteMarkerRequest(confirmModal.idToDelete);
      fetchMarkers();
    }
    setConfirmModal({ isOpen: false, idToDelete: null });
  };

  const cancelDelete = () =>
    setConfirmModal({ isOpen: false, idToDelete: null });

  const handleApprove = async (idplague) => {
    await approveMarkerRequest(idplague);
    fetchMarkers();
  };

  // ------------------ Filtros ------------------
  const handleClearFilters = () => {
    setFilters({
      status: user?.role === "admin" ? "all" : "approved",
      plagueType: "all",
      showMyReports: false,
      startDate: "",
      endDate: "",
    });
  };

  const filteredMarkers = useMemo(() => {
    if (!user) return allMarkers.filter((m) => m.status === "aprobado");

    let currentMarkers = allMarkers;

    if (user.role === "admin" && filters.status !== "all") {
      currentMarkers = currentMarkers.filter(
        (m) => m.status === filters.status
      );
    }

    if (filters.plagueType !== "all") {
      currentMarkers = currentMarkers.filter(
        (m) => m.title === filters.plagueType
      );
    }

    if (filters.startDate) {
      currentMarkers = currentMarkers.filter((m) => {
        const markerDate = new Date(m.createdAt || m.created_at);
        return markerDate.toISOString().split("T")[0] >= filters.startDate;
      });
    }

    if (filters.endDate) {
      currentMarkers = currentMarkers.filter((m) => {
        const markerDate = new Date(m.createdAt || m.created_at);
        return markerDate.toISOString().split("T")[0] <= filters.endDate;
      });
    }

    if (filters.showMyReports) {
      currentMarkers = currentMarkers.filter((m) => m.id_reg === user.id_reg);
    }

    if (user.role !== "admin") {
      currentMarkers = currentMarkers.filter(
        (m) => m.status === "aprobado" || m.id_reg === user.id_reg
      );
    }

    return currentMarkers;
  }, [allMarkers, filters, user]);

  const uniquePlagues = useMemo(() => {
    const plagues = new Set();
    allMarkers.forEach((m) => m.title && plagues.add(m.title));
    return Array.from(plagues);
  }, [allMarkers]);

  // ------------------ Exportar Excel con Estadísticas ------------------
  const exportToExcel = () => {
    if (!user || user.role !== "admin") return;

    // --- Datos principales ---
    const data = allMarkers.map((m) => ({
      Usuario: m.username,
      Rol: m.userRole,
      Plaga: m.title || "Sin Tipo",
      Descripción: m.description || "",
      Estado: m.status,
      Fecha: m.createdAt || m.created_at || "",
      Latitud: m.lat,
      Longitud: m.lng,
    }));

    // --- Estadísticas ---
    const totalMarkers = allMarkers.length;
    const statusCounts = allMarkers.reduce(
      (acc, m) => {
        if (m.status === "aprobado") acc.aprobado += 1;
        else if (m.status === "pendiente") acc.pendiente += 1;
        return acc;
      },
      { aprobado: 0, pendiente: 0 }
    );

    const plagueCounts = allMarkers.reduce((acc, m) => {
      const key = m.title || "Sin Tipo";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const userCounts = allMarkers.reduce((acc, m) => {
      const key = m.username || "Desconocido";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const wb = XLSX.utils.book_new();

    // Hoja 1: Datos de marcadores
    const wsData = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, wsData, "Marcadores");

    // Hoja 2: Estadísticas generales
    const statsData = [
      ["Total de Marcadores", totalMarkers],
      [],
      ["Marcadores por Estado"],
      ...Object.entries(statusCounts),
      [],
      ["Marcadores por Plaga"],
      ...Object.entries(plagueCounts),
      [],
      ["Marcadores por Usuario"],
      ...Object.entries(userCounts),
    ];
    const wsStats = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, "Estadísticas");

    XLSX.writeFile(wb, "estadistica_marcadores.xlsx");
  };

  // ------------------ Render ------------------
  if (loading)
    return <div className="dashboard-wrapper">Cargando reportes...</div>;

  return (
    <div className="dashboard-wrapper">
      <h2>
        {user?.role === "admin"
          ? "Panel de Administración"
          : "Mis Reportes y Aprobados"}
      </h2>

      {/* --- Botones de acción --- */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          className="dashboard-button create-button"
          onClick={() =>
            navigate("/PlagueMap", { state: { action: "create" } })
          }
        >
          Crear Nuevo Reporte
        </button>

        {user?.role === "admin" && (
          <button
            className="dashboard-button export-button"
            onClick={exportToExcel}
          >
            Exportar Estadística
          </button>
        )}
      </div>

      {/* --- Filtros --- */}
      <div className="filters-container">
        <label className="show-my-reports-container">
          <input
            type="checkbox"
            checked={filters.showMyReports}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                showMyReports: e.target.checked,
              }))
            }
          />
          <span>Mostrar Solo Mis Reportes</span>
        </label>

        <select
          value={filters.plagueType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, plagueType: e.target.value }))
          }
        >
          <option value="all">Todas las Plagas</option>
          {uniquePlagues.map((plague) => (
            <option key={plague} value={plague}>
              {plague}
            </option>
          ))}
        </select>

        {user?.role === "admin" && (
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="all">Todos los Estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">Pendientes</option>
          </select>
        )}

        <label>
          Fecha Inicio:
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </label>

        <label>
          Fecha Fin:
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </label>

        <button
          className="dashboard-button reset-button"
          onClick={handleClearFilters}
        >
          Borrar Filtros
        </button>
      </div>

      {/* --- Tabla de reportes --- */}
      <div
        className={`reports-table-container ${
          user?.role === "admin" ? "admin-view" : ""
        }`}
      >
        <table>
          <thead>
            <tr>
              {user?.role === "admin" && <th>Usuario</th>}
              {user?.role === "admin" && <th>Rol</th>}
              <th>Plaga</th>
              <th>Descripción</th>
              <th>Imagen</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarkers.map((marker) => (
              <tr key={marker.idplague}>
                {user?.role === "admin" && <td>{marker.username}</td>}
                {user?.role === "admin" && (
                  <td className="role-cell">
                    <select
                      value={marker.userRole}
                      onChange={(e) =>
                        handleRoleChange(
                          marker.id_reg,
                          e.target.value,
                          marker.username
                        )
                      }
                      disabled={marker.id_reg === user.id_reg}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">Usuario</option>
                    </select>
                  </td>
                )}
                <td>{marker.title || "Sin Tipo"}</td>
                <td>{marker.description?.substring(0, 30)}</td>
                <td className="image-cell">
                  {marker.imgurl ? (
                    <button
                      onClick={() => openImageModal(marker.imgurl)}
                      className="image-preview-button"
                    >
                      <img
                        src={marker.imgurl}
                        alt="Preview"
                        width="50"
                        height="50"
                      />
                    </button>
                  ) : (
                    <span>No hay</span>
                  )}
                </td>
                <td>
                  <span className={`status status-${marker.status}`}>
                    {marker.status}
                  </span>
                </td>
                <td>
                  {marker.createdAt || marker.created_at
                    ? new Date(
                        marker.createdAt || marker.created_at
                      ).toLocaleDateString()
                    : "Sin Fecha"}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleGoToLocation(marker.lat, marker.lng)}
                    className="action-button locate-button"
                  >
                    Ir a Mapa
                  </button>
                  {(user?.role === "admin" ||
                    marker.id_reg === user?.id_reg) && (
                    <>
                      <button
                        onClick={() => handleEdit(marker.idplague)}
                        className="action-button edit-button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(marker.idplague)}
                        className="action-button delete-button"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  {user?.role === "admin" && marker.status === "pendiente" && (
                    <button
                      onClick={() => handleApprove(marker.idplague)}
                      className="action-button approve-button"
                    >
                      Aprobar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ImageModal imageUrl={modalImage} onClose={closeImageModal} />

      <ConfirmationModal
        message="¿Estás seguro de que quieres eliminar este reporte de plaga? Esta acción es irreversible."
        isOpen={confirmModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ConfirmationModal
        message={getRoleConfirmationMessage()}
        isOpen={roleConfirm.isOpen}
        onConfirm={confirmRoleChange}
        onCancel={cancelRoleChange}
      />
    </div>
  );
}

export default Dashboard;
