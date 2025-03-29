import React, { useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";

const AdminSelector = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Wize | Admin Panel";
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        // Validate token by calling a protected endpoint.
        axios
            .get(`${BASE_URL}/api/admin/propiedades`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                // Token is valid, no further action needed.
            })
            .catch((err) => {
                console.error("Authorization error:", err);
                // Token is invalid or expired, redirect to login.
                navigate("/login");
            });
    }, [navigate]);

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
            <Typography variant="h4">Panel de Administración</Typography>
            <Typography variant="subtitle1">¿Qué querés administrar?</Typography>
            <Stack direction="column" spacing={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/admin/desarrollos`)}
                >
                    Admin Desarrollos
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/admin/propiedades`)}
                >
                    Admin Propiedades
                </Button>
            </Stack>
        </Box>
    );
};

export default AdminSelector;
