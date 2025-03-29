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
import DOMPurify from "dompurify";
import "../styles/PropertyDetails.css";
import DescriptionWithExpand from "../components/DescriptionWithExpand";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BASE_URL from "../api/config";
import ImageGallery from "../components/ImageGallery"; // Updated gallery with full-screen modal
import MarkdownTypography from "../components/Markdown";
import RelatedProperties from "../components/RelatedProperties";

const DevelopmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [development, setDevelopment] = useState(null);
    const [relatedProperties, setRelatedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) {
            console.error("❌ No ID found in URL.");
            navigate("/not-found");
            return;
        }

        const fetchDevelopment = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/desarrollos/${id}`);
                setDevelopment(response.data.desarrollo);
                // Dynamically update the browser tab title.
                document.title = `Wize | ${response.data.desarrollo.Proyecto_Nombre || ""}`;
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

    const safeDescripcion = DOMPurify.sanitize(development.Descripcion || "");
    const safeDescripcionExpandir = DOMPurify.sanitize(
        development.Descripcion_Expandir || ""
    );
    const safeFormaDePago = DOMPurify.sanitize(
        development.Forma_de_Pago || ""
    );

    return (
        <Box className="property-detail-all">
            {/* Header Section */}
            <Box className="property-detail-container">
                <Button className="back-button" onClick={() => window.history.back()}>
                    ← Atrás
                </Button>
                <Box className="property-detail-header-start">
                    <Grid container spacing={3} alignItems="center" sx={{ margin: '0 auto', width: '85%' }}>
                        <Grid item xs={12} md={7}>
                            <Box className="property-detail-info-start">
                                <Typography variant="h3" className="property-detail-title">
                                    {development.Proyecto_Nombre || 'Sin título'}
                                </Typography>
                                <Typography className="property-detail-summary">
                                    {development.Resumen}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ ml: 'auto', pr: 3 }}>
                            <Grid container alignItems="center" justifyContent="flex-end">
                                <Grid item>
                                    <Divider orientation="vertical" flexItem className="property-detail-divider" />
                                </Grid>
                                <Grid item>
                                    <Box className="property-detail-price-box">
                                        <Typography className="property-detail-status">{development.Estado}</Typography>
                                        <Typography className="property-detail-price">Desde </Typography>
                                        <Typography className="property-detail-price">
                                            $ {development.Precio?.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Gallery & Contact Section */}
            <Box className="property-detail-gallery-contact">
                {development.Galeria?.length > 0 && (
                    <ImageGallery mediaItems={development.Galeria} />
                )}
                <Grid container spacing={3} className="property-detail-header-button" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "nowrap" }}>
                    <Grid item sx={{ mt: 0 }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                const el = document.getElementById("footer");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="contact-button"
                            sx={{ display: { xs: "none", sm: "flex" } }}
                        >
                            Contacto
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Content Section */}
            <Box className="property-detail-container">
                <Box className="property-detail-header">
                    <Grid container spacing={3} className="property-detail-info">
                        <Grid item xs={12} sm={6} className="property-detail-info">
                            <Typography className="property-detail-subtitle" variant="h6">
                                Ubicación
                            </Typography>
                            <Typography className="property-detail-summary">
                                {development.Ubicacion}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} className="property-detail-info">
                            <Typography className="property-detail-subtitle" variant="h6">
                                Descripción
                            </Typography>
                            <DescriptionWithExpand
                                className="property-detail-summary"
                                shortText={safeDescripcion}
                                extraText={safeDescripcionExpandir}
                                useHtml
                            />
                        </Grid>

                        <Box className="property-map-wrapper">
                            {/* Google Map */}
                            <Box className="property-map">
                                <iframe
                                    src={`https://www.google.com/maps?q=${development.Ubicacion}&output=embed`}
                                    title="Google Map"
                                    className="google-map"
                                />
                            </Box>
                        </Box>

                        <Grid item xs={12} sm={6} className="property-detail-info">
                            <Typography className="property-detail-subtitle" variant="h6">
                                Propiedades en este desarrollo
                            </Typography>
                        </Grid>
                        <RelatedProperties relatedProperties={relatedProperties} />
                    </Grid>

                    <Grid item xs={12} md={2} className="property-detail-info-right">
                        <Grid item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">
                                Contacto
                            </Typography>
                            <Typography className="property-detail-summary">
                                {development.Email}
                            </Typography>
                            <Typography className="property-detail-summary">
                                {development.Celular}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography className="property-detail-subtitle" variant="h6">
                                Detalles
                            </Typography>
                            <Typography className="property-detail-summary">
                                {development.Detalles}
                            </Typography>
                            <Typography className="property-detail-small-subtitle" variant="h6">
                                Tipo
                            </Typography>
                            <Typography className="property-detail-summary">
                                {development.Tipo}
                            </Typography>
                            <Typography className="property-detail-small-subtitle" variant="h6"> Tamaño </Typography>
                            <Typography className="property-detail-summary">{development.Tamano_m2} m²</Typography>
                            <Typography className="property-detail-small-subtitle" variant="h6"> Forma de pago</Typography>
                            <Typography
                                className="property-detail-summary"
                                component="div"
                                dangerouslySetInnerHTML={{ __html: safeFormaDePago }}
                            />
                        </Grid>
                        <Typography className="property-detail-small-subtitle" variant="h6">
                            Gastos de ocupación
                        </Typography>
                        <Typography className="property-detail-summary">
                            {development.Gastos_Ocupacion}
                        </Typography>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default DevelopmentDetails;
