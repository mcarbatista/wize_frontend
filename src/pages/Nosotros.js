import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Nosotros.css";
import Testimonios_Nosotros from "../components/Slider_TestimoniosNosotros"; // ✅ Import the slider

const Nosotros = () => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowText(true), 1000); // Show text after 2 seconds
        window.scrollTo(0, 0);
    }, []);

    // Auto-scroll settings for the gallery (unchanged)
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true, // ✅ Ensure arrows are enabled
        fade: false, // ✅ Disable default fade to apply custom effect
        nextArrow: <Box className="custom-next">→</Box>, // Custom arrow
        prevArrow: <Box className="custom-prev">←</Box>, // Custom arrow
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <Box>
            {/* 🔹 Page Title */}
            <Box className="nosotros-title-section">
                <Typography className="nosotros-title-text">Nosotros</Typography>
            </Box>

            {/* 🔹 Service Sections */}
            <Box className="nosotros-container">
                {showText && (
                    <Box container direction="column" className="nosotros-section">
                        <Box item xs={12}>
                            <Typography variant="h3" className="nosotros-title">
                                Transformando la gestión de activos inmobiliarios
                            </Typography>
                        </Box>
                        <Box item xs={12}>
                            <Typography variant="h5" className="nosotros-subtitle">
                                Soluciones personalizadas y accesibles
                            </Typography>
                        </Box>
                        <Box item xs={12} className="nosotros-description-section">
                            <Typography variant="body1" className="nosotros-description">
                                En Wize, nuestra misión es empoderar a inversionistas y futuros
                                propietarios de viviendas en Uruguay y Estados Unidos brindándoles
                                servicios inmobiliarios excepcionales. Estamos dedicados a cumplir
                                los objetivos financieros de nuestros clientes a través de
                                inversiones inmobiliarias estratégicas, enfocándonos en áreas de
                                alto crecimiento.
                            </Typography>
                            <Typography variant="body1" className="nosotros-description">
                                Nos esforzamos por crear una experiencia fluida y gratificante para
                                todos nuestros clientes, ya sea que estén buscando invertir o
                                encontrar la casa de sus sueños. Ya sea que esté comprando,
                                vendiendo o invirtiendo, estamos aquí para ayudarlo en cada paso del
                                camino. Nos esforzamos por garantizar una experiencia exitosa de
                                principio a fin.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            <Box>
                {/* ✅ TESTIMONIOS Section */}
                <Testimonios_Nosotros />
            </Box>
        </Box>
    );
};

export default Nosotros;
