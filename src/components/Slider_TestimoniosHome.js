import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";

// ✅ Testimonials Data
const testimonios = [
    {
        text: "Desde que tomé contacto con WIZE, el profesionalismo en su forma de trabajar hizo la diferencia. Fui asesorado para la compra de un apartamento en Pocitos y posteriormente en el servicio brindado para el alquiler del mismo. En ambos casos, el nivel de compromiso y los tiempos de respuesta fueron excelentes.",
        name: "Félix Nolazco, Buenos Aires, Argentina"
    },
    {
        text: "La experiencia con WIZE fue impecable. Desde el primer contacto, su equipo me brindó atención personalizada y me ayudó a encontrar la mejor inversión inmobiliaria.",
        name: "Mariana López, Montevideo, Uruguay"
    },
    {
        text: "Gracias a WIZE, pude vender mi propiedad rápidamente y con el mejor asesoramiento. Recomiendo totalmente sus servicios.",
        name: "Carlos Méndez, Punta del Este, Uruguay"
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
        <Box className="slider-section-home">
            <Typography variant="h3" className="slide-title-home">Testimonios</Typography>
            <Slider {...settings}>
                {testimonios.map((testimonial, index) => (
                    <Box key={index} className="slide-home">
                        <Typography className="slide-text-home">"{testimonial.text}"</Typography>
                        <Typography className="slide-who-home">{testimonial.name}</Typography>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Testimonios;
