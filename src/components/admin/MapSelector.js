// src/components/MapSelector.js
import React, { useCallback, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";

const containerStyle = {
    width: "100%",
    height: "300px"
};

const centerDefault = {
    lat: -34.9011, // Montevideo
    lng: -56.1645
};

const MapSelector = ({ ubicacion, setUbicacion, label = "Ubicación", error, helperText }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCU-nYLKnmyOdfSmjkhszlfQs4myPxoGqE" // 🔁 Reemplazá por tu clave real
    });

    // 🧠 Convertir string a objeto lat/lng
    const parsedUbicacion = useMemo(() => {
        if (!ubicacion || typeof ubicacion !== "string") return centerDefault;
        const [latStr, lngStr] = ubicacion.split(",");
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (isNaN(lat) || isNaN(lng)) return centerDefault;
        return { lat, lng };
    }, [ubicacion]);

    // 📍 Guardar la ubicación como string
    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setUbicacion(`${lat},${lng}`);
    }, [setUbicacion]);

    if (!isLoaded) return <p>Cargando mapa...</p>;

    return (
        <Box mb={2}>
            {label && (
                <Typography variant="subtitle2" sx={{ mb: 1 }} color={error ? "error" : "text.primary"}>
                    {label}
                </Typography>
            )}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={parsedUbicacion}
                zoom={14}
                onClick={handleMapClick}
            >
                {ubicacion && <Marker position={parsedUbicacion} />}
            </GoogleMap>
            {helperText && (
                <Typography variant="caption" color={error ? "error" : "text.secondary"}>
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};

export default MapSelector;
