import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Button
} from "@mui/material";
import DOMPurify from "dompurify";
import "../styles/PropertyDetails.css";
import DescriptionWithExpand from "../components/DescriptionWithExpand";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BASE_URL from "../api/config";
import ImageGallery from "../components/ImageGallery"; // Make sure arrows are on the big image
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

    // Sanitize text
    const safeDescripcion = DOMPurify.sanitize(development.Descripcion || "");
    const safeDescripcionExpandir = DOMPurify.sanitize(
        development.Descripcion_Expandir || ""
    );
    const safeFormaDePago = DOMPurify.sanitize(development.Forma_de_Pago || "");

    // Format price if needed
    const formattedPrice = development.Precio
        ? `$ ${development.Precio.toLocaleString()}`
        : "";

    return (
        <Box className="dev-details-page" sx={{ paddingBottom: "50px" }}>
            {/* BACK BUTTON */}
            <Box className="dev-details-topbar">
                <Button className="back-button" onClick={() => navigate(-1)}>
                    ← Atrás
                </Button>
            </Box>

            {/* HEADER SECTION (two columns) */}
            <Box className="dev-details-header">
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    {/* LEFT COLUMN: Proyecto_Nombre & Resumen (takes more space) */}
                    <Grid item xs={12} lg={8}>
                        <Typography variant="h3" className="dev-title">
                            {development.Proyecto_Nombre || "Sin título"}
                        </Typography>
                        <Typography className="dev-summary">
                            {development.Resumen}
                        </Typography>
                    </Grid>

                    {/* RIGHT COLUMN: Estado & Precio with left border (divider) on large screens */}
                    <Grid
                        item
                        xs={12}
                        lg={3}
                        textAlign={{ xs: "left", lg: "right" }}
                        sx={{
                            borderLeft: { lg: "1px solid #13272D" },
                            pl: { lg: 2 },
                        }}
                    >
                        <Typography className="dev-status">
                            {development.Estado}
                        </Typography>
                        <Box>
                            <Typography className="dev-price-label">Desde</Typography>
                            <Typography className="dev-price">{formattedPrice}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* GALLERY SECTION + CONTACT CTA */}
            <Box className="dev-details-gallery">
                {development.Galeria?.length > 0 && (
                    <ImageGallery mediaItems={development.Galeria} />
                )}

                <Box className="dev-gallery-cta">
                    <Button
                        variant="contained"
                        className="contact-button"
                        onClick={() => {
                            // Future popup logic can go here
                            alert("Open Contact Popup (to be developed)");
                        }}
                    >
                        Contacto
                    </Button>
                </Box>
            </Box>

            {/* CONTENT SECTION (9:3 columns) */}
            <Box className="dev-details-content">
                <Grid container spacing={4}>
                    {/* LEFT COLUMN (9 parts) */}
                    <Grid item xs={12} md={9}>
                        {/* Ubicación */}
                        <Box mb={3}>
                            <Typography variant="h6" className="dev-subtitle">
                                Ubicación
                            </Typography>
                            <Typography className="dev-summary">
                                {development.Ubicacion}
                            </Typography>
                        </Box>

                        {/* Descripción */}
                        <Box mb={3}>
                            <Typography variant="h6" className="dev-subtitle">
                                Descripción
                            </Typography>
                            <DescriptionWithExpand
                                className="dev-summary"
                                shortText={safeDescripcion}
                                extraText={safeDescripcionExpandir}
                                useHtml
                            />
                        </Box>

                        {/* MAP */}
                        <Box className="dev-map-wrapper">
                            <iframe
                                src={`https://www.google.com/maps?q=${development.Ubicacion}&output=embed`}
                                title="Google Map"
                                className="dev-map"
                            />
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN (3 parts) */}
                    <Grid item xs={12} md={3}>
                        {/* For large screens, show the original layout */}
                        <Box sx={{ display: { xs: "none", lg: "block" } }}>
                            {/* Contacto */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Contacto
                                </Typography>
                                <Typography className="dev-summary">{development.Email}</Typography>
                                <Typography className="dev-summary">{development.Celular}</Typography>
                            </Box>

                            {/* Detalles */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Detalles
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Tipo</Typography>
                                        <Typography className="dev-summary">{development.Tipo}</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Fecha de construcción</Typography>
                                        <Typography className="dev-summary">{development.Entrega}</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Gastos</Typography>
                                        <Typography className="dev-summary">
                                            {development.Gastos_Ocupacion}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Forma de pago</Typography>
                                        <Typography
                                            className="dev-summary"
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: safeFormaDePago }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                        </Box>

                        {/* For medium and small screens, use the new two-box layout */}
                        <Box sx={{ display: { xs: "block", lg: "none" } }}>
                            {/* Contacto Box */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Contacto
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: "1 0 50%" }}>
                                        <Typography className="dev-summary">{development.Email}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 50%" }}>
                                        <Typography className="dev-summary">{development.Celular}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Detalles Box */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Detalles
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: "1 0 25%" }}>
                                        <Typography className="dev-small-subtitle">Tipo</Typography>
                                        <Typography className="dev-summary">{development.Tipo}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 25%" }}>
                                        <Typography className="dev-small-subtitle">Fecha de construcción</Typography>
                                        <Typography className="dev-summary">{development.Entrega}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 25%" }}>
                                        <Typography className="dev-small-subtitle">Gastos</Typography>
                                        <Typography className="dev-summary">
                                            {development.Gastos_Ocupacion}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 25%" }}>
                                        <Typography className="dev-small-subtitle">Forma de pago</Typography>
                                        <Typography
                                            className="dev-summary"
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: safeFormaDePago }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* RELATED PROPERTIES */}
            <Box className="dev-details-related">
                <Typography variant="h6" className="dev-subtitle" mb={2}>
                    Propiedades en este desarrollo
                </Typography>
                <RelatedProperties relatedProperties={relatedProperties} />
            </Box>
        </Box>
    );
};

export default DevelopmentDetails;
