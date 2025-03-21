import React from "react";
import { Grid, CardContent, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/Servicios.css";

// Import images from assets folder
import servicios1 from "../assets/servicios_1.png";
import servicios2 from "../assets/servicios_2.png";
import servicios3 from "../assets/servicios_3.png";
import servicios4 from "../assets/servicios_4.png";

const serviciosData = [
    {
        id: 1,
        title: "Inversión en Bienes Raices",
        short_description: "Inversión inteligente, crecimiento seguro y rentable.",
        description: "Ofrecemos soluciones personalizadas para ayudar a nuestros clientes a alcanzar sus objetivos financieros. Invertir con nosotros es asegurar tu futuro con oportunidades inmobiliarias rentables y sostenibles.",
        image: servicios1,
        link: "/contacto",
        bgColor: "#13272D"
    },
    {
        id: 2,
        title: "Comprá o alquilá.",
        short_description: "¡Tu hogar soñado te espera!",
        description: "Descubrí la alegría de encontrar la vivienda perfecta para ti. Ya sea que busques comprar o alquilar, nuestro equipo está aquí para guiarte en cada paso, hagamos realidad tu ideal de vida!",
        image: servicios2,
        link: "/tasaciones",
        bgColor: "#0F4C54"
    },
    {
        id: 3,
        title: "Home Staging",
        short_description: "Maximiza el potencial",
        description: "El homestaging es un equipamiento estratégico del hogar que aumenta el valor percibido de tu propiedad, atrayendo más compradores y acelerando su venta.",
        image: servicios3,
        link: "/administracion",
        bgColor: "#C3AF94"
    },
    {
        id: 4,
        title: "Vendé o alquilá",
        short_description: "Transforma tu propiedad en una oportunidad",
        description: "Te acompañamos en el proceso de venta o alquiler, maximizando el valor de tu inversión y asegurando que encuentres al inquilino o comprador ideal.",
        image: servicios4,
        link: "/inversiones",
        bgColor: "#DDD4C0"
    }
];

const Servicios = () => {
    return (
        <Box>
            {/* 🔹 Page Title */}
            <Box className="title-section">
                <Typography className="title-text">Servicios</Typography>
            </Box>

            {/* 🔹 Service Sections */}
            {serviciosData.map((servicio, index) => (
                <Box key={servicio.id} className="service-section" style={{ backgroundColor: servicio.bgColor }}>
                    <Grid container className={`service-grid ${index % 2 === 0 ? "row-normal" : "row-reverse"}`}>

                        {/* Parallax Image Container */}
                        <Grid item xs={12} md={6} className="parallax-container">
                            <div className="parallax-image" style={{ backgroundImage: `url(${servicio.image})` }}></div>
                        </Grid>

                        {/* Content Section */}
                        <Grid item xs={12} md={6} className="content-container">
                            <CardContent className="service-card">
                                <Typography variant="h3" className="service-title">{servicio.title}</Typography>
                                <Typography variant="h5" className="service-subtitle">{servicio.short_description}</Typography>
                                <Typography variant="body1" className="service-description">{servicio.description}</Typography>
                                <Button variant="contained" component={Link} to={servicio.link} className="service-button">
                                    Ver Proyectos
                                </Button>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    );
};

export default Servicios;
