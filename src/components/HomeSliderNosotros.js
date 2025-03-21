import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";

// ✅ Testimonials Data
const testimonios = [
    {
        text: "Trabajar con wize fue un placer, su enfoque personalizado hizo que todo el proceso fuera fluido y sin estrés. Recomiendo sus servicios a cualquiera que quiera comprar, vender o invertir en bienes raíces.",
        name: "Nicolás Berges, Lausanne, Suiza"
    },
    {
        text: "Poner mi propiedad en manos de WIZE fue la mejor decisión. Su estrategia de marketing y su red de contactos hicieron que vendiera rápido y al mejor precio. Además, el trato humano y la comunicación constante marcaron la diferencia.",
        name: "Laura Fernández, Parque miramar, MVD"
    }
];

// ✅ Custom Arrows
const NextArrow = ({ onClick }) => (
    <div className="custom-arrow next" onClick={onClick}>→</div>
);
const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow prev" onClick={onClick}>←</div>
);

const Testimonios = () => {
    const settings = {
        dots: true,  // ✅ Enable dots
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: false,
        arrows: true, // ✅ Enable arrows
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <div className="slider-section">
            <div className="nosotros-card">
                <Typography variant="h3" className="slide-title">Testimonios Inversores</Typography>
                <Slider {...settings}>
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
