import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, Button, Dialog, DialogContent } from "@mui/material";
import DOMPurify from "dompurify";
import "../styles/PropertyDetails.css";
import DescriptionWithExpand from "../components/DescriptionWithExpand";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BASE_URL from "../api/config";
import ImageGallery from "../components/ImageGallery_Details";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlano, setSelectedPlano] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) {
            console.error("❌ No ID found in URL.");
            navigate("/not-found");
            return;
        }

        const fetchProperty = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/propiedades/${id}`);
                setProperty(response.data);
                document.title = `Wize | ${response.data.Titulo || ""}`;
                setError(null);
            } catch (error) {
                console.error("❌ Error fetching property:", error);
                navigate("/not-found");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    if (loading || !property) return <Typography>Cargando...</Typography>;
    if (error) return <Typography>Error: {error}</Typography>;

    const safeDescripcion = DOMPurify.sanitize(property.Descripcion || "");
    const safeDescripcionExpandir = DOMPurify.sanitize(property.Descripcion_Expandir || "");
    const safeFormaDePago = DOMPurify.sanitize(property.Forma_de_Pago || "");

    const formattedPrice = property.Precio
        ? `$ ${property.Precio.toLocaleString()}`
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
                    {/* LEFT COLUMN: Proyecto_Nombre & Resumen */}
                    <Grid item xs={12} lg={8}>
                        <Typography variant="h3" className="dev-title">
                            {property.Titulo || "Sin título"}
                        </Typography>
                        <Typography className="dev-summary">
                            {property.Resumen}
                        </Typography>
                    </Grid>

                    {/* RIGHT COLUMN: Estado & Precio */}
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
                            {property.Estado}
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
                {property.Galeria?.length > 0 && (
                    <ImageGallery mediaItems={property.Galeria} />
                )}
                <Box className="dev-gallery-cta">
                    <Button
                        variant="contained"
                        className="contact-button"
                        onClick={() => {
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
                    {/* LEFT COLUMN */}
                    <Grid item xs={12} md={9}>


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


                        {/* Ubicación */}
                        <Box mb={3}>
                            <Typography variant="h6" className="dev-subtitle">
                                Ubicación
                            </Typography>
                            <Typography className="dev-summary">
                                {property.Ubicacion}
                            </Typography>
                        </Box>
                        {/* MAP */}
                        <Box className="dev-map-wrapper">
                            <iframe
                                src={`https://www.google.com/maps?q=${property.Ubicacion}&output=embed`}
                                title="Google Map"
                                className="dev-map"
                            />
                        </Box>
                        {/* Plano Section */}
                        {property.Plano && property.Plano.length > 0 && (
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Plano
                                </Typography>
                                {property.Plano.map((plano, index) => (
                                    <Box key={index} mb={1}>
                                        <img
                                            src={plano.url}
                                            alt={plano.alt || "Plano Image"}
                                            style={{
                                                cursor: "pointer",
                                                maxWidth: "600px"
                                            }}
                                            onClick={() => setSelectedPlano(plano.url)}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Grid>

                    {/* RIGHT COLUMN */}
                    <Grid item xs={12} md={3}>
                        {/* For large screens */}
                        <Box sx={{ display: { xs: "none", lg: "block" } }}>
                            {/* Contacto */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Contacto
                                </Typography>
                                <Typography className="dev-summary">{property.Email}</Typography>
                                <Typography className="dev-summary">{property.Celular}</Typography>
                            </Box>

                            {/* Detalles */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Detalles
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Tipo</Typography>
                                        <Typography className="dev-summary">{property.Tipo}</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Dormitorios</Typography>
                                        <Typography className="dev-summary">{property.Dormitorios}</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Baños</Typography>
                                        <Typography className="dev-summary">{property.Banos}</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Estado</Typography>
                                        <Typography className="dev-summary">{property.Estado}</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Tamaño</Typography>
                                        <Typography className="dev-summary">{property.Tamano_m2} m²</Typography>
                                    </Box>
                                    <Box sx={{ flex: { xs: "1 0 25%", lg: "1 0 100%" } }}>
                                        <Typography className="dev-small-subtitle">Gastos</Typography>
                                        <Typography className="dev-summary">
                                            {property.Gastos_Ocupacion}
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

                        {/* For medium and small screens */}
                        <Box sx={{ display: { xs: "block", lg: "none" } }}>
                            {/* Contacto Box */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Contacto
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                    <Box sx={{ flex: "1 0 50%" }}>
                                        <Typography className="dev-summary">{property.Email}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 50%" }}>
                                        <Typography className="dev-summary">{property.Celular}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Detalles Box */}
                            <Box mb={3}>
                                <Typography variant="h6" className="dev-subtitle">
                                    Detalles
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

                                    <Box sx={{ flex: "1 0 33%" }}>
                                        <Typography className="dev-small-subtitle">Dormitorios</Typography>
                                        <Typography className="dev-summary">{property.Dormitorios}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 33%" }}>
                                        <Typography className="dev-small-subtitle">Baños</Typography>
                                        <Typography className="dev-summary">{property.Banos}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 33%" }}>
                                        <Typography className="dev-small-subtitle">Tipo</Typography>
                                        <Typography className="dev-summary">{property.Tipo}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 33%" }}>
                                        <Typography className="dev-small-subtitle">Estado</Typography>
                                        <Typography className="dev-summary">{property.Estado}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 33%" }}>
                                        <Typography className="dev-small-subtitle">Tamaño</Typography>
                                        <Typography className="dev-summary">{property.Tamano_m2} m²</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 0 100%" }}>
                                        <Typography className="dev-small-subtitle">Fecha de construcción</Typography>
                                        <Typography className="dev-summary">{property.Entrega} m²</Typography>
                                    </Box>


                                    <Box sx={{ flex: "1 0 33%" }}>
                                        <Typography className="dev-small-subtitle">Forma de pago</Typography>
                                        <Typography
                                            className="dev-summary"
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: safeFormaDePago }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: "1 0 100%" }}>
                                        <Typography className="dev-small-subtitle">Gastos</Typography>
                                        <Typography className="dev-summary">
                                            {property.Gastos_Ocupacion}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Plano Popup Dialog */}
            <Dialog
                open={Boolean(selectedPlano)}
                onClose={() => setSelectedPlano(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 0
                    }}
                >
                    <img
                        src={selectedPlano}
                        alt="Plano Full"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100vh",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default PropertyDetails;
