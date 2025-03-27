import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";


const AdminSelector = () => {
    const navigate = useNavigate();

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
                <Button variant="contained" color="primary" onClick={() => navigate(`/admin/desarrollos`)}>Admin Desarrollos</Button>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/admin/propiedades`)}>Admin Propiedades</Button>
            </Stack>
        </Box>
    );
};

export default AdminSelector;
