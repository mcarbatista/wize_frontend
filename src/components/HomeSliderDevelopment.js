import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import gallery_1 from "../assets/gallery_1.png";
import gallery_2 from "../assets/gallery_2.png";
import gallery_3 from "../assets/gallery_3.png";
import gallery_4 from "../assets/gallery_4.png";
import gallery_5 from "../assets/gallery_5.png";
import BASE_URL from "../api/config"

// ✅ Development Data
const fetchDesarrollos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/desarrollos`);
        const desarrollos = response.data;

        console.log("📢 API Response:", desarrollos);

        if (!Array.isArray(desarrollos)) {
            console.error("❌ API did not return an array.");
            return;
        };

        const settings = {
            dots: true,  // ✅ Enable dots
            infinite: true,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: false,
            arrows: true, // ✅ Enable arrows
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };
    } catch (error) {
        console.error("❌ Error fetching desarrollos:", error);
    };

    return (
        // <Box className="slider-section">
        //     <Typography variant="h3" className="slide-title">Testimonios</Typography>
        //     <Slider {...settings}>
        //         {testimonios.map((testimonial, index) => (
        //             <Box key={index} className="slide">
        //                 <Typography className="slide-text">"{testimonial.text}"</Typography>
        //                 <Typography className="slide-who">{testimonial.name}</Typography>
        //             </Box>
        //         ))}
        //     </Slider>

        <Box className="gallery-section">
            <Typography variant="h3" className="gallery-title"> Nuevos Desarrollos</Typography>
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

        // </Box>

    );
};

export default Testimonios;
