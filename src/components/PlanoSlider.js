import React, { useState } from "react";
import { Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/PlanoSlider.css"; // 👈 importá el CSS separado

const PlanoSlider = ({ planos }) => {
    const [open, setOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    const handleOpen = (imgUrl) => {
        setActiveImage(imgUrl);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setActiveImage(null);
    };

    const sliderSettings = {
        dots: true,
        arrows: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    if (!planos || planos.length === 0) return null;

    return (
        <>
            <Typography className="property-detail-subtitle" variant="h6">
                Plano
            </Typography>

            <Box className="plano-slider-wrapper">
                <Slider {...sliderSettings}>
                    {planos.map((plano, index) => (
                        <Box
                            key={index}
                            className="plano-slide"
                            onClick={() => handleOpen(plano.url)}
                        >
                            <img
                                src={plano.url}
                                alt={plano.alt || `Plano ${index + 1}`}
                            />
                        </Box>
                    ))}
                </Slider>
            </Box>

            {/* Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        outline: "none",
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "white",
                            zIndex: 10,
                            background: "rgba(0,0,0,0.5)",
                            "&:hover": { background: "rgba(0,0,0,0.7)" },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <img
                        src={activeImage}
                        alt="Plano ampliado"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "90vh",
                            display: "block",
                            margin: "0 auto",
                            borderRadius: "10px",
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
};

export default PlanoSlider;
