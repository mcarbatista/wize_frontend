import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, Container } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";
import HomeSlider from "../components/HomeSlider"; // ✅ Import the slider
import videoSrc from "../assets/videoHome.mp4";
import gallery_1 from "../assets/gallery_1.png";
import gallery_2 from "../assets/gallery_2.png";
import gallery_3 from "../assets/gallery_3.png";
import gallery_4 from "../assets/gallery_4.png";
import gallery_5 from "../assets/gallery_5.png";
import iconInverti from "../assets/icono_inverti.svg";
import iconVende from "../assets/icono_vende.svg";
import iconCompra from "../assets/icono_compra.svg";

const Home = () => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowText(true), 2000); // Show text after 2 seconds
    }, []);

    // Auto-scroll settings for the gallery
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
        nextArrow: <div className="custom-next">→</div>, // Custom arrow
        prevArrow: <div className="custom-prev">←</div>, // Custom arrow
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ],
    };

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
                <Typography variant="h3" className="gallery-title">
                    Nuevos Desarrollos
                </Typography>
                <Slider {...settings}>
                    {[gallery_1, gallery_2, gallery_3, gallery_4, gallery_5].map((img, index) => (
                        <Card key={index} className="gallery-card fade-effect">
                            <CardMedia component="img" image={img} alt={`Gallery Image ${index + 1}`} className="card-image" />
                            <Box className="card-overlay">
                                <Typography variant="h5" className="card-title">Propiedad {index + 1}</Typography>
                            </Box>
                        </Card>
                    ))}
                </Slider>
            </Box>

            {/* Section with Hola Background Image */}
            <Box className="welcome-section">
                <Box className="welcome-content">
                    <Typography variant="h4" className="welcome-subtitle">Hola!</Typography>
                    <Typography variant="h5" className="welcome-text">
                        ¡Bienvenidos a WIZE! Tu nuevo comienzo empieza aquí.
                        Te acompañamos con confianza, transparencia y un trato cercano.
                    </Typography>
                    <Button className="scroll-button">Scroll ↓</Button>
                </Box>
            </Box>

            {/* Nuestro Compromiso Section */}
            <Box className="commitment-section">
                <Typography variant="h3" className="commitment-title">
                    Nuestro Compromiso
                </Typography>
                <Typography variant="h5" className="commitment-subheader">
                    Entender tus necesidades con un enfoque humano, cercano y transparente.
                    Combinamos nuestra experiencia y servicio personalizado para ofrecerte soluciones inmobiliarias
                    que construyan confianza y aseguren tu futuro.
                </Typography>

                <Container className="commitment-container">
                    <Grid container spacing={5} justifyContent="center" alignItems="stretch">
                        {[
                            {
                                img: iconInverti,
                                title: "Invertí",
                                subtitle: "Optimiza sus retornos",
                                text: "Wize ofrece soluciones de inversión personalizadas para maximizar su rentabilidad.",
                                paragraph: "Nuestros conocimientos estratégicos y nuestro enfoque personalizado permiten a los inversores alcanzar sus objetivos financieros."
                            },
                            {
                                img: iconCompra,
                                title: "Comprá",
                                subtitle: "Encontrá tu propiedad ideal",
                                text: "En Wize, nos dedicamos a ayudar a los compradores a encontrar las propiedades de sus sueños.",
                                paragraph: "Nuestro enfoque personalizado garantiza que usted descubra la inversión inmobiliaria perfecta."
                            },
                            {
                                img: iconVende,
                                title: "Vendé",
                                subtitle: "Maximiza el valor de su propiedad",
                                text: "Cuando se trata de vender su propiedad, Wize brinda orientación experta para ayudarlo a lograr el mejor valor.",
                                paragraph: "Con nuestro servicio gratuito de HOMESTAGING, estamos comprometidos a hacer que el proceso de venta sea sencillo y eficiente."
                            }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={4} key={index} className="commitment-column">
                                <Box className="commitment-content">
                                    <img src={item.img} alt={item.title} className="commitment-icon" />
                                    <Typography variant="h4" className="commitment-subtitle">{item.title}</Typography>
                                    <Typography className="commitment-subtitle-text"><strong>{item.subtitle}</strong></Typography>
                                    <Typography className="commitment-description">{item.text}</Typography>
                                    <Typography className="commitment-paragraph">{item.paragraph}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ✅ TESTIMONIOS Section */}
            <HomeSlider />

            {/* CTA Section */}
            <Box className="hablemos-section">
                <Typography variant="h4" className="hablemos-subtitle">Hablemos de negocios</Typography>
                <Button variant="outlined" className="hablemos-button">Agendá una llamada</Button>
            </Box>

        </div>
    );
};

export default Home;
