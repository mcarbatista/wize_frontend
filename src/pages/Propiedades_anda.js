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
                                src={`https://www.google.com/maps?q=${property.Latitud},${property.Longitud}&output=embed`}
                                title="Google Map"
                                className="google-map"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7} className="property-detail-info">

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


.property - detail - container {
    padding: 20px!important;

}

.MuiTypography - root {
    font - family: "Avenir Medium", sans - serif!important;
}

.property - detail - all {
    margin: 0 auto;
    background - color: #FBF7EA;
}

.back - button {
    background: none;
    border: none;
    font - size: 16px;
    cursor: pointer;
    color: #13272D!important;
    font - family: "Avenir Light", sans - serif!important;
    margin - top: 80px!important;
    text - transform: lowercase;
}

/* 🔹 Ensures Header is a Flex Container */
.property - detail - header {
    display: flex!important;
    flex - direction: row!important;
    justify - content: space - between!important;
    align - items: center!important;
    gap: 40px;
    margin: 40px!important;
    justify - content: center!important;
    text - align: center!important;
}

/* 🔹 Title Styling */
.property - detail - title {
    font - size: 2.7rem!important;
    font - family: "Avenir Heavy", sans - serif!important;
    color: #13272D;
    margin - bottom: 20px!important;
    max - width: 800px!important;
    text - align: left;
}

.property - detail - subtitle {
    font - size: 1.7rem!important;
    font - family: "Avenir Heavy", sans - serif!important;
    color: #13272D;
    margin - bottom: 20px!important;
    max - width: 800px!important;
    text - align: left;
}

/* 🔹 Description */
.property - detail - summary {
    font - size: 1.2rem!important;
    color: #13272D!important;
    font - family: "Avenir", sans - serif!important;
    margin - bottom: 10px!important;
    max - width: 800px!important;
    text - align: left!important;
    justify - content: left!important;
    align - items: left!important;
}

/* 🔹 Estado (Status) */
.property - detail - status {
    font - size: 1.2rem!important;
    font - family: "Avenir Light", sans - serif!important;
    font - weight: bold;
    color: #13272D;
    text - transform: uppercase;
}

/* 🔹 Price Styling */
.property - detail - price {
    font - size: 2rem!important;
    color: #13272D;
    margin - top: 5px!important;
}

/* 🔹 Right Side: Estado & Price */
.property - detail - price - box {
    display: flex;
    flex - direction: column;
    align - items: flex - end;
    justify - content: center;
    max - width: 250px!important;
}

.property - detail - info {
    display: flex;
    flex - direction: column!important;
    align - items: flex - start!important;
    justify - content: left!important;
    margin - top: 20px;
    color: #444;
    font - size: 1.5rem;
    color: #13272D!important;
    font - family: "Avenir Medium", sans - serif!important;
    max - width: 800px!important
}

.property - detail - description - container {
    font - size: 1.2rem!important;
    color: #13272D!important;
    font - family: "Avenir", sans - serif!important;
    margin - bottom: 10px!important;
    max - width: 800px!important;
    text - align: left!important;
    justify - content: left!important;
    align - items: left!important;
}


.expand - link {
    font - size: 1rem;
    color: #0F4C54;
    text - decoration: underline;
    cursor: pointer;
    display: inline - block;
    margin - top: 5px;
}

/* 🔹 Divider Styling */
.property - detail - divider {
    height: 50px!important;
    width: 2px!important;
    background - color: #13272D!important;
    margin - top: 120px!important;
    margin - left: 200px!important;
    display: block!important;
}

.property - detail - gallery - contact {
    display: flex!important;
    flex - direction: column!important;
    justify - content: space - between!important;
    align - items: center!important;
    gap: 40px;
    margin: 40px!important;
    justify - content: center!important;
    text - align: center!important;
}

.property - main - image {
    width: 100 %;
    border - radius: 10px;
    margin - top: 20px;
}

.property - gallery {
    margin - top: 10px;
}

.property - thumbnail {
    width: 100 %;
    border - radius: 5px;
    cursor: pointer;
}

.property - contact {
    text - align: center;
    margin: 20px 0;
}

.contact - button {
    background - color: #0F4C54;
    color: white;
    font - size: 18px;
    padding: 10px 20px;
    border - radius: 5px;
    cursor: pointer;
}

.property - map {
    margin - top: 20px;
}

.google - map {
    width: 100 %;
    height: 300px;
    border: none;
}