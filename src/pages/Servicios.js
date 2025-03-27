import React, { useEffect } from "react";
import { Grid, CardContent, Typography, Button, Box } from "@mui/material";
import "../styles/Servicios.css";

// ✅ Import images
import servicios1 from "../assets/servicios_1.png";
import servicios2 from "../assets/servicios_2.png";
import servicios3 from "../assets/servicios_3.png";
import servicios4 from "../assets/servicios_4.png";

const services = [
    {
        image: servicios1,
        title: "Inversión en Bienes Raíces",
        subtitle: "Inversión inteligente, crecimiento seguro y rentable.",
        description:
            "Ofrecemos soluciones personalizadas para ayudar a nuestros clientes a alcanzar sus objetivos financieros. Invertir con nosotros es asegurar tu futuro con oportunidades inmobiliarias rentables y sostenibles.",
        button: { label: "Ver Proyectos", href: "#desarrollos" },
        backgroundColor: "#13272D",
    },
    {
        image: servicios2,
        title: "Comprá o alquilá.",
        subtitle: "¡Tu hogar soñado te espera!",
        description:
            "Descubrí la alegría de encontrar la vivienda perfecta para ti. Ya sea que busques comprar o alquilar, nuestro equipo está aquí para guiarte en cada paso, hagamos realidad tu ideal de vida!",
        button: { label: "Ver Propiedades", href: "#propiedades" },
        backgroundColor: "#0F4C54",
    },
    {
        image: servicios3,
        title: "Home Staging",
        subtitle: "Maximiza el potencial",
        description:
            "El homestaging es un equipamiento estratégico del hogar que aumenta el valor percibido de tu propiedad, atrayendo más compradores y acelerando su venta.",
        button: { label: "Más información", href: "/servicios/homeStaging" },
        backgroundColor: "#C3AF94",
    },
    {
        image: servicios4,
        title: "Vendé o alquilá",
        subtitle: "Transforma tu propiedad en una oportunidad",
        description:
            "Te acompañamos en el proceso de venta o alquiler, maximizando el valor de tu inversión y asegurando que encuentres al inquilino o comprador ideal.",
        button: { label: "Contáctanos", href: "#footer" },
        backgroundColor: "#DDD4C0",
    },
];

const Servicios = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box>
            {/* 🔹 Page Title */}
            <Box className="title-section">
                <Typography className="servicios-title-text">Servicios</Typography>
            </Box>

            {/* 🔹 Services List */}
            {services.map((service, index) => (
                <Box
                    key={index}
                    className="service-section"
                    style={{ backgroundColor: service.backgroundColor }}
                >
                    <Box
                        container
                        className={`service-grid ${index % 2 === 0 ? "row-normal" : "row-reverse"}`}
                    >
                        {/* Image Section */}
                        <Box
                            item
                            xs={12}
                            md={6}
                            className={`parallax-container ${index % 2 === 0 ? "parallax-container-normal" : "parallax-container-reverse"}`}
                        >
                            <div
                                className="parallax-image"
                                style={{ backgroundImage: `url(${service.image})` }}
                            ></div>
                        </Box>

                        {/* Content Section */}
                        <Box item xs={12} md={6} className="content-container">
                            <CardContent className="service-card">
                                <Typography variant="h3" className="service-title">
                                    {service.title}
                                </Typography>
                                <Typography variant="h5" className="service-subtitle">
                                    {service.subtitle}
                                </Typography>
                                <Typography variant="body1" className="service-description">
                                    {service.description}
                                </Typography>
                                {service.button && (
                                    <Button
                                        component="a"
                                        href={service.button.href}
                                        variant="outlined"
                                        className="service-button"
                                    >
                                        {service.button.label}
                                    </Button>
                                )}
                            </CardContent>
                        </Box>
                    </Box>
                </Box>
            ))
            }
        </Box >
    );
};

export default Servicios;
