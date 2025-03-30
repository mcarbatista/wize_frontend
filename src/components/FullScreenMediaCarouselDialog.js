import React, { useRef, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { useTheme, useMediaQuery } from "@mui/material";
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

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

    // Memoize navigation functions
    const handlePrev = useCallback(() => {
        sliderRef.current?.slickPrev();
    }, []);

    const handleNext = useCallback(() => {
        sliderRef.current?.slickNext();
    }, []);

    // Base arrow style
    const arrowStyle = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#ffffff",
        background: "none",
        zIndex: 2,
    };

    // Adjust arrow positioning based on screen size:
    const leftArrowStyle = {
        ...arrowStyle,
        left: isMobile ? "10px" : isMedium ? "35px" : "55px",
        top: isMobile ? "18%" : isMedium ? "27%" : "50%",
    };

    const rightArrowStyle = {
        ...arrowStyle,
        right: isMobile ? "10px" : isMedium ? "35px" : "55px",
        top: isMobile ? "18%" : isMedium ? "27%" : "50%",
    };

    const iconFontSize = isMobile ? "2rem" : isMedium ? "2.5rem" : "3rem";

    // Dynamic close button style based on device type
    const closeButtonStyle = {
        position: "absolute",
        top: isMobile ? "3%" : isMedium ? "7%" : "10%",
        right: isMobile ? "5%" : isMedium ? "7%" : "7%",
        zIndex: 1000,
    };

    const mediaStyle = {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <div className="fullscreen-container">
                <div className="fullscreen-slider-wrapper">
                    {/* Close Button */}
                    <IconButton
                        onClick={onClose}
                        aria-label="Close carousel"
                        className="fullscreen-close-button"
                        sx={closeButtonStyle}
                    >
                        <CloseIcon sx={{ fontSize: iconFontSize, color: "#ffffff" }} />
                    </IconButton>

                    <Slider ref={sliderRef} {...sliderSettings} className="media-element">
                        {mediaItems.map((item, idx) => (
                            <div key={idx}>
                                {item.type === "video" ? (
                                    <video src={item.url} autoPlay muted loop style={mediaStyle} />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.alt || `Media ${idx + 1}`}
                                        style={mediaStyle}
                                    />
                                )}
                            </div>
                        ))}
                    </Slider>

                    {mediaItems.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrev}
                                aria-label="Previous media"
                                sx={leftArrowStyle}
                            >
                                <ArrowBackIosNewIcon sx={{ fontSize: iconFontSize }} />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                aria-label="Next media"
                                sx={rightArrowStyle}
                            >
                                <ArrowForwardIosIcon sx={{ fontSize: iconFontSize }} />
                            </IconButton>
                        </>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default FullScreenMediaCarouselDialog;
