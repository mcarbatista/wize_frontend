import React, { useEffect } from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/HomeStaging.css";
import HomeStagingStats from '../components/HomeStagingStats';
import image1 from '../assets/homeStaging1.jpg'
import image2 from '../assets/homeStaging2.jpg'

const HomeStaging = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <Box>
            {/* 🔹 Page Title */}
            <Box className="homestaging-title-section">
                <Typography className="nosotros-title-text">Home Staging</Typography>
            </Box>

            <Box className="homestaging-section">
                {/* BACK BUTTON */}
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "2%" }}>
                    <Button className="back-button-hs" onClick={() => navigate(-1)}>
                        ← Atrás
                    </Button>
                </Box>
                <Box item xs={12}>
                    <Container sx={{ py: 8 }} data-aos="fade-left">
                        <Typography variant="body1" className="homestaging-description">
                            {/* Es una técnica de marketing inmobiliario que busca mejorar la imagen de una propiedad para acelerar su venta o alquiler y obtener mejores condiciones económicas. */}
                            El home staging te ayuda a vender tu propiedad al mejor precio en un período de tiempo más corto. Los profesionales de WIZE te ayudarán a presentar tu propiedad de manera que se destaque su máximo potencial. Nuestro amplio inventario de muebles y accesorios para el hogar está disponible para entrega en Montevideo. Permítenos ayudarte a causar una excelente impresión en los compradores potenciales.
                        </Typography>
                    </Container>
                </Box>
            </Box>
            <Box>

            </Box>
            <Box data-aos="fade-up">

                <HomeStagingStats />
            </Box>
            <Box className="homestaging-pics-section">
                <Typography className="homestaging-pics-title" data-aos="fade-up">
                    Antes y después de hacer Home Staging
                </Typography>
                <Box className="homestaging-pics-container" data-aos="fade-left">
                    <img src={image1} alt="Antes del Home Staging" />
                    <img src={image2} alt="Después del Home Staging" />
                </Box>
            </Box>

        </Box>
    );
};

export default HomeStaging;
