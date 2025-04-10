// src/components/admin/PropertyCard.jsx
import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const PropertyCard = ({ prop, onEdit, onDelete }) => (
    <Card className="property-card-edit">
        <Link
            to={`/propiedades/${prop._id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <CardMedia
                component="img"
                image={prop.Imagen}
                alt={prop.Proyecto_Nombre}
                sx={{ height: 200, objectFit: "cover" }}
            />
            <CardContent>
                <Typography className="property-status">{prop.Estado}</Typography>
                <Typography className="property-price">
                    ${prop.Precio_Con_Formato}
                </Typography>
                <Typography
                    className="property-title-desarrollos"
                    variant="h6"
                    style={{ height: "90px" }}
                >
                    {prop.Titulo}
                </Typography>
                <Typography className="property-barrio" variant="h6">
                    {prop.Barrio}
                </Typography>
                <Typography className="desarrollo-entrega">
                    {prop.Entrega}
                </Typography>
            </CardContent>
        </Link>
        <Box sx={{ display: "flex", justifyContent: "space-around", pb: 2 }}>
            <Button
                onClick={() => onEdit(prop._id)}
                size="small"
                className="admin-button-edit"
            >
                Editar
            </Button>
            <Button
                onClick={() => onDelete(prop)}
                size="small"
                color="error"
                className="admin-button-edit"
            >
                Eliminar
            </Button>
        </Box>
    </Card >
);

export default PropertyCard;
