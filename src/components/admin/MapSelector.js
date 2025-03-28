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

const MapSelector = ({ mapa, setMapa, label = "Mapa", error, helperText }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCU-nYLKnmyOdfSmjkhszlfQs4myPxoGqE" // 🔁 Reemplazá por tu clave real
    });

    // 🧠 Convertir string a objeto lat/lng
    const parsedMapa = useMemo(() => {
        if (!mapa || typeof mapa !== "string") return centerDefault;
        const [latStr, lngStr] = mapa.split(",");
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (isNaN(lat) || isNaN(lng)) return centerDefault;
        return { lat, lng };
    }, [mapa]);

    // 📍 Guardar el mapa como string
    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMapa(`${lat},${lng}`);
    }, [setMapa]);

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
                center={parsedMapa}
                zoom={14}
                onClick={handleMapClick}
            >
                {mapa && <Marker position={parsedMapa} />}
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
