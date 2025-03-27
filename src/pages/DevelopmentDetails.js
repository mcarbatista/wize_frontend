import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Button,
    Divider,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";
import "../styles/PropertyDetails.css";
import DescriptionWithExpand from "../components/DescriptionWithExpand";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BASE_URL from "../api/config";


const DevelopmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [development, setDevelopment] = useState(null);
    const [relatedProperties, setRelatedProperties] = useState([]);
    const [thumbSlider, setThumbSlider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getShortText = (text, length = 150) => {
        if (!text) return "";
        if (text.length <= length) return text;
        return text.substring(0, text.lastIndexOf(" ", length)) + "...";
    };

    const thumbnailSliderSettings = {
        slidesToShow: 6,
        slidesToScroll: 1,
        focusOnSelect: true,
        centerMode: true,
        infinite: true,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) {
            console.error("❌ No ID found in URL.");
            navigate("/not-found");
            return;
        }

        const fetchDevelopment = async () => {
            console.log(`📢 Fetching development with ID: ${id}`);

            try {
                const response = await axios.get(
                    `${BASE_URL}/api/desarrollos/${id}`
                );
                console.log("✅ API Response:", response.data);
                setDevelopment(response.data.desarrollo);
                setRelatedProperties(response.data.propiedades);
                setError(null);
            } catch (error) {
                console.error("❌ Error fetching development:", error);
                navigate("/not-found");
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopment();
    }, [id, navigate]);

    if (loading || !development) return <Typography>Cargando...</Typography>;
    if (error) return <Typography>Error: {error}</Typography>;

    return (
        <Box className="property-detail-all">
            <Box className="property-detail-container ">
                <Button className="back-button" onClick={() => window.history.back()}>
                    ← Atrás
                </Button>

                <Box className="property-detail-header-start">
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={7} className="property-detail-info-start">
                            <Typography variant="h3" className="property-detail-title">
                                {development.Titulo}
                            </Typography>
                            <Typography className="property-detail-summary">
                                {development.Resumen}
                            </Typography>
                        </Grid>

                        <Divider orientation="vertical" flexItem className="property-detail-divider" />

                        <Grid item xs={12} md={4} className="property-detail-price-box">
                            <Typography className="property-detail-status">{development.Estado}</Typography>
                            <Typography className="property-detail-price">
                                {development.Precio?.toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box className="property-detail-gallery-contact">
                <img src={development.Imagen} alt={development.Titulo} className="property-main-image" />

                <Grid container spacing={2} className="property-gallery">
                    <Slider
                        {...thumbnailSliderSettings}
                        ref={(slider) => setThumbSlider(slider)}
                        className="property-thumbnails"
                    >
                        {development.Galeria?.map((img, index) => (
                            <Box key={index} className="property-thumbnail-container">
                                <img src={img.url} alt={`Thumbnail ${index}`} className="property-thumbnail" />
                            </Box>
                        ))}
                    </Slider>
                </Grid>

                <Grid container spacing={3} className="property-detail-header"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        flexWrap: "nowrap",
                    }}
                >
                    <Box className="property-contact">
                        <Button className="contact-button">Contacto</Button>
                    </Box>
                </Grid>
            </Box>

            <Box className="property-detail-container ">
                <Box className="property-detail-header">
                    <Grid container spacing={3} className="property-detail-info">
                        <Grid item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">
                                Ubicación
                            </Typography>
                            <Typography className="property-detail-summary">
                                Avenida a la Playa & Don Quijote de la Mancha, Ciudad de la Costa Canelones Department, Uruguay
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">
                                Descripción
                            </Typography>
                            <DescriptionWithExpand
                                className="property-detail-summary"
                                shortText={getShortText(development.Descripcion, 150)}
                                fullText={development.Descripcion}
                            />

                            <Typography className="property-detail-subtitle" variant="h6">
                                Plano
                            </Typography>
                        </Grid>

                        <Box className="property-map">
                            <iframe
                                src={`https://www.google.com/maps?q=${development.Ubicacion}&output=embed`}
                                title="Google Map"
                                className="google-map"
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7} className="property-detail-info-right">
                        <Grid item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">
                                Contacto
                            </Typography>
                            <Typography className="property-detail-summary">{development.Email}</Typography>
                            <Typography className="property-detail-summary">{development.Celular}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">
                                Detalles
                            </Typography>
                            <Typography className="property-detail-summary">{development.Detalles}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Tipo</Typography>
                            <Typography className="property-detail-summary">{development.Tipo}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Tamaño</Typography>
                            <Typography className="property-detail-summary">{development.Tamano}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Dormitorios</Typography>
                            <Typography className="property-detail-summary">{development.Dormitorios}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Baños</Typography>
                            <Typography className="property-detail-summary">{development.Banos}</Typography>
                            <Typography className="property-detail-subti" variant="h6">Forma de pago</Typography>
                            <Typography className="property-detail-summary">{development.Forma_de_Pago}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box className="related-properties-section">
                <Typography variant="h5">Propiedades en este desarrollo</Typography>
                <Grid container spacing={2} className="property-list">
                    {relatedProperties.length > 0 ? (
                        relatedProperties.map((prop) => (
                            <Grid item xs={12} sm={6} md={4} key={prop._id}>
                                <Card className="property-card">
                                    <Link to={`/propiedades/${prop._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                        <CardMedia component="img" image={prop.Imagen} alt={prop.Titulo} />
                                        <CardContent>
                                            <Typography variant="h6">{prop.Titulo}</Typography>
                                            <Typography>{prop.Barrio}</Typography>
                                            <Typography>Desde {prop.Precio}</Typography>
                                        </CardContent>
                                    </Link>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>No hay propiedades asociadas a este desarrollo.</Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default DevelopmentDetails;
