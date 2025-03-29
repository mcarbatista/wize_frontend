import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";
import "../styles/Admin.css";

const AdminSelector = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    // Helper function to decode JWT
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        document.title = "Wize | Admin Panel";
        if (!token) {
            navigate("/login");
            return;
        }
        const decoded = parseJwt(token);
        setUser(decoded);

        // Validate token by calling a protected endpoint.
        axios
            .get(`${BASE_URL}/api/admin/propiedades`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .catch((err) => {
                console.error("Authorization error:", err);
                navigate("/login");
            });
    }, [navigate, token]);

    const handleLogout = async () => {
        try {
            await axios.get(`${BASE_URL}/api/auth/logout`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const handleChangePassword = () => {
        navigate("/admin/change-password");
    };

    const handleCreateUser = () => {
        navigate("/admin/create-user");
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
            gap={4}
        >
            <Typography variant="h4" className="admin-title">
                Panel de Administración
            </Typography>
            <Typography variant="subtitle1">¿Qué querés administrar?</Typography>
            <Stack direction="column" spacing={2}>
                <Button
                    className="admin-button-desarrollos"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/admin/desarrollos`)}
                >
                    Admin Desarrollos
                </Button>
                <Button
                    className="admin-button-propiedades"
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/admin/propiedades`)}
                >
                    Admin Propiedades
                </Button>
                <Button
                    className="admin-button"
                    variant="contained"
                    color="info"
                    onClick={handleChangePassword}
                >
                    Cambiar contraseña
                </Button>
                {user && user.role === "admin" && (
                    <Button
                        className="admin-button"
                        variant="contained"
                        color="success"
                        onClick={handleCreateUser}
                    >
                        Crear usuario
                    </Button>
                )}
                <Button
                    className="admin-button"
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </Button>
            </Stack>
        </Box>
    );
};

export default AdminSelector;
