import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import "../styles/PropertyDetails.css";
import DescriptionWithExpand from "../components/DescriptionWithExpand";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getShortText = (text, length = 150) => {
        if (text.length <= length) return text; // If text is short, return it as is
        return text.substring(0, text.lastIndexOf(" ", length)) + "..."; // Prevent word cut-off
    };

    useEffect(() => {
        if (!id) {
            console.error("❌ No ID found in URL.");
            navigate("/notfound");
            return;
        }

        const fetchProperty = async () => {
            console.log(`📢 Fetching property with ID: ${id}`);

            try {
                const response = await axios.get(`http://localhost:8000/api/propiedades/${id}`);

                console.log("✅ API Response:", response.data);
                setProperty(response.data);
                setError(null);
            } catch (error) {
                console.error("❌ Error fetching property:", error);
                navigate("/notfound");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    if (loading) return <Typography>Cargando...</Typography>;
    if (error) return <Typography>Error: {error}</Typography>;

    return (
        <Box className="property-detail-all">

            <Box className="property-detail-container ">
                <Button className="back-button" onClick={() => window.history.back()}>← Atrás</Button>
                {/* 🔹 Property Header Section */}
                <Box className="property-detail-header">
                    <Grid container spacing={3} alignItems="center">
                        {/* 🔹 Title & Summary */}
                        <Grid item xs={12} md={7} className="property-detail-info">
                            <Typography variant="h3" className="property-detail-title">
                                {property.Titulo}
                            </Typography>
                            <Typography className="property-detail-summary">{property.Resumen}</Typography>
                        </Grid>

                        {/* 🔹 Divider */}
                        <Divider orientation="vertical" flexItem className="property-detail-divider" />

                        {/* 🔹 Status & Price */}
                        <Grid item xs={12} md={4} className="property-detail-price-box">
                            <Typography className="property-detail-status">{property.Estado}</Typography>
                            <Typography className="property-detail-price">{property.Precio.toLocaleString()}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>


            <Box className="property-detail-gallery-contact ">
                {/* 🔹 Main Image */}
                <img src={property.Imagen} alt={property.Titulo} className="property-main-image" />
                {/* 🔹 Gallery */}
                <Grid container spacing={2} className="property-gallery">
                    {property.Imagenes?.map((img, index) => (
                        <Grid item xs={4} sm={2} key={index}>
                            <img src={img} alt={`Propiedad ${index}`} className="property-thumbnail" />
                        </Grid>
                    ))}
                </Grid>
                <Grid container
                    spacing={3}
                    className="property-detail-header"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        flexWrap: "nowrap"
                    }}
                >
                    {/* 🔹 Contact Section */}
                    <Box className="property-contact">
                        <Button className="contact-button">Contacto</Button>
                    </Box>
                </Grid>
            </Box>

            <Box className="property-detail-container ">
                <Box className="property-detail-header">
                    {/* 🔹 Property Details */}
                    <Grid container spacing={3} className="property-detail-info">
                        <Grid className="property-detail-info" item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">Ubicación</Typography>
                            {/* <Typography className="property-detail-info">{property.Ubicacion}</Typography> */}
                            <Typography className="property-detail-summary">Avenida a la Playa & Don Quijote de la Mancha, Ciudad de la Costa Canelones Department, Uruguay</Typography>
                        </Grid>
                        <Grid className="property-detail-info" item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">Descripción</Typography>
                            {/* <Typography className="property-detail-info">{property.Descripcion}</Typography> */}
                            {property && (
                                <DescriptionWithExpand className="property-detail-summary"
                                    shortText={getShortText(property.Descripcion, 150)} // Set desired length
                                    fullText={property.Descripcion} // Full text from DB
                                />
                            )}
                            <Typography className="property-detail-subtitle" variant="h6">Plano</Typography>
                            {/* <Typography className="property-detail-info">{property.Plano}</Typography> */}
                        </Grid>
                        {/* 🔹 Google Map */}
                        <Box className="property-map">
                            <iframe
                                src={`https://www.google.com/maps?q=${property.Ubicacion}&output=embed`}
                                title="Google Map"
                                className="google-map"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7} className="property-detail-info-right">

                        <Grid className="property-detail-info" item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">Contacto</Typography>
                            {/* <Typography className="property-detail-summary">{property.Contacto}</Typography> */}
                            <Typography className="property-detail-summary">{property.Email}</Typography>
                            <Typography className="property-detail-summary">{property.Celular}</Typography>
                        </Grid>
                        <Grid className="property-detail-info" item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">Detalles</Typography>
                            <Typography className="property-detail-summary">{property.Detalles}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Tipo</Typography>
                            <Typography className="property-detail-summary">{property.Tipo}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Tamaño</Typography>
                            <Typography className="property-detail-summary">{property.Tamano}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Dormitorios</Typography>
                            <Typography className="property-detail-summary">{property.Dormitorios}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Baños</Typography>
                            <Typography className="property-detail-summary">{property.Banos}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Forma de pago</Typography>
                            <Typography className="property-detail-summary">{property.Forma_de_pago}</Typography>
                        </Grid>
                    </Grid>


                </Box >
            </Box >
        </Box >
    );
};

export default PropertyDetails;
