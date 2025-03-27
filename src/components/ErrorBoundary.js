import React, { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";


class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ textAlign: "center", padding: "80px" }}>
                    <Typography variant="h3" sx={{ color: "#0F4C54", fontWeight: "bold" }}>
                        Algo salió mal
                    </Typography>
                    <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                        Hubo un problema al cargar la página. Intenta refrescar.
                    </Typography>
                    <Button variant="contained" component={Link} to="/" sx={{ background: "#C3AF94" }}>
                        Volver al inicio
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
