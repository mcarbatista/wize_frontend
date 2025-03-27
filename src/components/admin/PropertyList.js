// components/PropertyList.js

import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia,
} from "@mui/material";

const PropertyList = ({ propiedades = [], onEdit, onDelete }) => {
    if (!Array.isArray(propiedades) || propiedades.length === 0) {
        return <Typography>No hay propiedades para mostrar.</Typography>;
    }

    return (
        <Grid container spacing={2}>
            {propiedades.map((prop) => {
                const imagenDestacada = prop.Galeria?.[0]?.url;

                return (
                    <Grid item xs={12} md={6} lg={4} key={prop._id}>
                        <Card>
                            {imagenDestacada && (
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={imagenDestacada}
                                    alt={prop.Titulo || "Imagen de propiedad"}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">
                                    {prop.Titulo || "Sin título"}
                                </Typography>
                                <Typography variant="body2">
                                    {prop.Barrio || "Barrio desconocido"} - {prop.Ciudad || "Ciudad"}
                                </Typography>
                                <Typography variant="body2">
                                    {prop.Precio ? `USD ${prop.Precio}` : "Precio no disponible"}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => onEdit?.(prop)}>Editar</Button>
                                <Button size="small" color="error" onClick={() => onDelete?.(prop._id)}>
                                    Eliminar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default PropertyList;
