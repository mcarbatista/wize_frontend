import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Card, CardMedia, Box, Typography } from "@mui/material";
import "../styles/GalerySlider.css";
import { ChevronLeft, ChevronRight, DoNotStepTwoTone } from "@mui/icons-material";
import BASE_URL from "../api/config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DevelopmentsHomeSlider = () => {
    const [desarrollos, setDesarrollos] = useState([]);

    useEffect(() => {
        fetchDesarrollos();
    }, []);

    const fetchDesarrollos = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/desarrollos`);
            const data = response.data;
            console.log("📢 API Response:", data);

            if (!Array.isArray(data)) {
                console.error("❌ API did not return an array.");
                return;
            }
            setDesarrollos(data);
        } catch (error) {
            console.error("Error fetching desarrollos:", error);
        }
    };

    const settings = {
        infinite: true,
        dots: false,
        speed: 5000,
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: true,
        autoplay: true,
        autoplaySpeed: 100,
        arrows: true, // ✅ Ensure arrows are enabled
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerPadding: "20px", // Slightly less space on medium screens
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "0px", // No extra padding on small screens
                },
            },
        ],
    };

    return (
        <Slider {...settings}>
            {desarrollos.map((desarrollo, index) => (
                <a
                    key={index}
                    href={`/desarrollos/${desarrollo._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                >
                    <Card className="gallery-card fade-effect">
                        <CardMedia
                            component="img"
                            image={desarrollo.Imagen}
                            alt={`Image of ${desarrollo.Proyecto_Nombre}`}
                            className="card-image"
                        />
                        <Box className="card-overlay">
                            <Typography variant="h5" className="card-title">
                                {desarrollo.Proyecto_Nombre}
                            </Typography>
                            <Typography variant="h5" className="card-text">
                                {desarrollo.Entrega}
                            </Typography>
                        </Box>
                    </Card>
                </a>
            ))}
        </Slider>
    );
};

export default DevelopmentsHomeSlider;
