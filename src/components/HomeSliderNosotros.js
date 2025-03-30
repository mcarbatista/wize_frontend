import React from "react";
import Slider from "react-slick";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Testimonios.css";

// ✅ Testimonials Data
const testimonios = [
    {
        text: "Trabajar con wize fue un placer, su enfoque personalizado hizo que todo el proceso fuera fluido y sin estrés. Recomiendo sus servicios a cualquiera que quiera comprar, vender o invertir en bienes raíces.",
        name: "Nicolás Berges, Lausanne, Suiza",
    },
    {
        text: "Poner mi propiedad en manos de WIZE fue la mejor decisión. Su estrategia de marketing y su red de contactos hicieron que vendiera rápido y al mejor precio. Además, el trato humano y la comunicación constante marcaron la diferencia.",
        name: "Laura Fernández, Parque miramar, MVD",
    },
    {
        text: "Poner mi propiedad en manos de WIZE fue la mejor decisión. Su estrategia de marketing y su red de contactos hicieron que vendiera rápido y al mejor precio. Además, el trato humano y la comunicación constante marcaron la diferencia.",
        name: "Laura Fernández, Parque miramar, MVD",
    }
];

// ✅ Custom Arrows matching fullscreen carousel styles
const NextArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        style={{
            position: "absolute",
            top: "50%",
            right: "5%",
            transform: "translateY(-50%)",
            color: "#fff",
            background: "none",
            zIndex: 1,
        }}
    >
        <ArrowForwardIosIcon style={{ fontSize: "3rem" }} />
    </IconButton>
);
const PrevArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            transform: "translateY(-50%)",
            color: "#fff",
            background: "none",
            zIndex: 1,
        }}
    >
        <ArrowBackIosNewIcon style={{ fontSize: "3rem" }} />
    </IconButton>
);

const Testimonios = () => {
    const settings = {
        dots: true, // ✅ Enable dots
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: false,
        arrows: true, // ✅ Enable arrows
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="slider-section">
            <div className="nosotros-card">
                <Typography variant="h3" className="slide-title">
                    Testimonios Inversores
                </Typography>
                <Slider {...settings} className="slick-slider">
                    {testimonios.map((testimonial, index) => (
                        <Box key={index} className="slide">
                            <Typography className="slide-text">"{testimonial.text}"</Typography>
                            <Typography className="slide-who">{testimonial.name}</Typography>
                        </Box>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Testimonios;
