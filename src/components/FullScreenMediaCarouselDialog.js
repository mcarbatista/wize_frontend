import React, { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slider from "react-slick";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "../styles/FullScreenMediaCarouselDialog.css";

const FullScreenMediaCarouselDialog = ({
    open,
    onClose,
    mediaItems,
    initialIndex,
    setCurrentIndex,
}) => {
    const sliderRef = useRef(null);

    // Slider settings: no default arrows.
    const sliderSettings = {
        initialSlide: initialIndex,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        infinite: true,
        afterChange: (index) => {
            setCurrentIndex(index);
        },
    };

    const handlePrev = () => {
        sliderRef.current.slickPrev();
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <div className="fullscreen-container">

                {/* Slider container with padding and fixed height */}
                <div
                    className="fullscreen-slider-wrapper"
                    style={{
                        position: "relative",
                        padding: "5%",
                        boxSizing: "border-box",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        height: "calc(100vh - 10%)", // 5% padding top and bottom
                    }}
                >
                    {/* Close Button */}
                    <IconButton onClick={onClose} className="fullscreen-close-button">
                        <CloseIcon style={{ fontSize: "3rem", color: "#0F4C54" }} />
                    </IconButton>

                    <Slider ref={sliderRef} {...sliderSettings}>
                        {mediaItems.map((item, idx) => (
                            <div key={idx}>
                                {item.type === "video" ? (
                                    <video
                                        src={item.url}
                                        autoPlay
                                        muted
                                        loop
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.alt || `Media ${idx}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </Slider>
                    {mediaItems.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrev}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: 20,
                                    transform: "translateY(-50%)",
                                    color: "#0F4C54",
                                    background: "none",
                                }}
                            >
                                <ArrowBackIosNewIcon style={{ fontSize: "3rem" }} />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: 20,
                                    transform: "translateY(-50%)",
                                    color: "#0F4C54",
                                    background: "none",
                                }}
                            >
                                <ArrowForwardIosIcon style={{ fontSize: "3rem" }} />
                            </IconButton>
                        </>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default FullScreenMediaCarouselDialog;
