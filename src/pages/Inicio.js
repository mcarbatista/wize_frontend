import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import "../styles/Home.css";
import videoSrc from "../assets/videoHome.mp4";
import iconInverti from "../assets/icono_inverti.svg";
import iconVende from "../assets/icono_vende.svg";
import iconCompra from "../assets/icono_compra.svg";
import DevelopmentsHomeSlider from "../components/Slider_DevelopmentsHome";
import Testimonios from "../components/Slider_TestimoniosHome"; // ✅ Import the slider

const Home = () => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowText(true), 2000); // Show text after 2 seconds
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {/* Full-screen Video Section */}
            <Box className="video-section">
                <video autoPlay loop muted playsInline className="video-background">
                    <source src={videoSrc} type="video/mp4" />
                </video>
                {showText && (
                    <Box className="video-text-container">
                        <Typography variant="h2" className="video-text">
                            Transformando la gestión de activos inmobiliarios
                        </Typography>
                        <Typography variant="body1" className="video-subtext">
                            Te ayudamos a tomar la mejor decisión en el mundo de las inversiones inmobiliarias, acercándote opciones y oportunidades elegidas a tu medida por su potencial de seguridad y valorización.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Auto-scrolling Gallery Section */}
            <Box className="gallery-section">
                <Typography variant="h3" className="gallery-title">Nuevos Desarrollos</Typography>
                {/* Use the refactored GallerySlider here */}
                <DevelopmentsHomeSlider />
                <Button component="a" href="/Desarrollos" variant="outlined" className="nuevos-desarrollos-button">
                    Ver todos los desarrollos
                </Button>
            </Box>

            {/* Section with Hola Background Image */}
            <Box className="welcome-section">
                <Box className="welcome-content">
                    <Typography variant="h4" className="welcome-subtitle">Hola!</Typography>
                    <Typography variant="h5" className="welcome-text">
                        ¡Bienvenidos a WIZE! Tu nuevo comienzo empieza aquí.
                        Te acompañamos con confianza, transparencia y un trato cercano.
                    </Typography>
                    <Button component="a" href="#compromiso" variant="outlined" className="scroll-button">
                        Ver ↓
                    </Button>
                </Box>
            </Box>

            {/* Nuestro Compromiso Section */}
            <Box id="compromiso" className="commitment-section">
                <Typography variant="h3" className="commitment-title">
                    Nuestro Compromiso
                </Typography>
                <Typography className="commitment-description">
                    Entender tus necesidades con un enfoque humano, cercano y transparente.
                    Combinamos nuestra experiencia y servicio personalizado para ofrecerte soluciones inmobiliarias
                    que construyan confianza y aseguren tu futuro.
                </Typography>

                <Container className="commitment-container">
                    <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                        {[
                            {
                                img: iconInverti,
                                title: "Invertí",
                                subtitle: "Optimiza sus retornos",
                                text: "Wize ofrece soluciones de inversión personalizadas para maximizar su rentabilidad. Nuestros conocimientos estratégicos y nuestro enfoque personalizado permiten a los inversores alcanzar sus objetivos financieros."
                            },
                            {
                                img: iconCompra,
                                title: "Comprá",
                                subtitle: "Encontrá tu propiedad ideal",
                                text: "En Wize, nos dedicamos a ayudar a los compradores a encontrar las propiedades de sus sueños. Nuestro enfoque personalizado garantiza que usted descubra la inversión inmobiliaria perfecta."
                            },
                            {
                                img: iconVende,
                                title: "Vendé",
                                subtitle: "Maximiza el valor de su propiedad",
                                text: "Cuando se trata de vender su propiedad, Wize brinda orientación experta para ayudarlo a lograr el mejor valor. Con nuestro servicio gratuito de HOMESTAGING, estamos comprometidos a hacer que el proceso de venta sea sencillo y eficiente."
                            }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={12} md={4} key={index} className="commitment-column">
                                <Box className="commitment-content">
                                    <img src={item.img} alt={item.title} className="commitment-icon" />
                                    <Typography variant="h4" className="commitment-subtitle">
                                        {item.title}
                                    </Typography>
                                    <Typography className="commitment-subtitle-text">
                                        <strong>{item.subtitle}</strong>
                                    </Typography>
                                    <Typography className="commitment-paragraph">
                                        {item.text}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* HABLEMOS Section */}
            <Box className="hablemos-section">
                <Typography variant="h4" className="hablemos-subtitle">Hablemos de negocios</Typography>
                <Button component="a" href="#footer" variant="outlined" className="hablemos-button">
                    Agendá una llamada
                </Button>
            </Box>

            {/* ✅ TESTIMONIOS Section */}
            <Testimonios />
        </div>
    );
};

export default Home;
