import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Card, CardMedia, Box, Typography } from "@mui/material";
import "../styles/GalerySlider.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import BASE_URL from "../api/config";

const GallerySlider = () => {
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
        dots: false,
        infinite: true,
        speed: 5000,
        cssEase: "linear",
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        pauseOnHover: true,
        arrows: true,
        swipe: true,
        nextArrow: (
            <div className="custom-arrow custom-next">
                <ChevronRight />
            </div>
        ),
        prevArrow: (
            <div className="custom-arrow custom-prev">
                <ChevronLeft />
            </div>
        ),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <Slider {...settings}>
            {desarrollos.map((desarrollo, index) => (
                <Card
                    key={index}
                    className="gallery-card fade-effect"
                    style={{ margin: "0 10px" }} // Added margin for spacing between cards
                >
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
            ))}
        </Slider>
    );
};

export default GallerySlider;
