import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Card, CardMedia, Box, Typography } from "@mui/material";
import "../styles/Slider_DevelopmentsHome.css";
import BASE_URL from "../api/config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => {
    return (
        <div className="custom-arrow custom-next" onClick={onClick}>
            {/* Right chevron (›) */}
            <span className="arrow-icon">&#8250;</span>
        </div>
    );
};

const PrevArrow = ({ onClick }) => {
    return (
        <div className="custom-arrow custom-prev" onClick={onClick}>
            {/* Left chevron (‹) */}
            <span className="arrow-icon">&#8249;</span>
        </div>
    );
};

const DevelopmentsHomeSlider = () => {
    const [desarrollos, setDesarrollos] = useState([]);

    useEffect(() => {
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

        fetchDesarrollos();
    }, []);

    const settings = {
        infinite: true,
        dots: false,
        speed: 5000,
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: true,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 100,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerPadding: "20px",
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "0px",
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
