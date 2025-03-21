import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const NotFound = () => {
    return (
        <Box sx={{ textAlign: "center", padding: "80px" }}>
            <Typography variant="h2" sx={{ color: "#0F4C54", fontWeight: "bold" }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                Página no encontrada
            </Typography>
            <Button variant="contained" component={Link} to="/" sx={{ background: "#C3AF94" }}>
                Volver al inicio
            </Button>
        </Box>
    );
};

export default NotFound;
