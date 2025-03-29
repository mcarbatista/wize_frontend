import React, { useState, useEffect } from "react";
import { Dialog, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FullScreenMediaCarouselDialog = ({ open, onClose, mediaItems = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Reset the index when initialIndex changes
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                // Alternatively, if you have access to the slider instance:
                // sliderRef.current?.slickGoTo(currentIndex, true);
            }, 100); // slight delay can help ensure the dialog is fully visible
        }
    }, [open, currentIndex]);

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: initialIndex,
        beforeChange: (oldIndex, newIndex) => setCurrentIndex(newIndex),
        swipe: true,
        arrows: true,
    };

    // Simple helper to detect video media by file extension
    const isVideo = (url) =>
        url &&
        (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg"));

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            {/* Close Button */}
            <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Container for the slider with padding/margin */}
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    p: 2, // Add padding around the media
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                }}
            >
                <Slider {...sliderSettings} style={{ width: "100%", height: "100%" }}>
                    {mediaItems.map((item, idx) => {
                        const mediaUrl = item.url;
                        return (
                            <Box
                                key={idx}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                {isVideo(mediaUrl) ? (
                                    <video
                                        src={mediaUrl}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                        }}
                                        autoPlay
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={mediaUrl}
                                        alt={item.alt || `Media ${idx}`}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Slider>
            </Box>
        </Dialog>
    );
};

export default FullScreenMediaCarouselDialog;
