import React, { useState } from "react";
import Slider from "react-slick";
import "../styles/ImageGallery.css";
import FullScreenMediaCarouselDialog from "./FullScreenMediaCarouselDialog";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageGallery = ({ mediaItems = [] }) => {
    // Track current index and open state for fullscreen.
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Derive the main item from the current index.
    const mainItem = mediaItems.length > 0 ? mediaItems[currentIndex] : {};

    // Thumbnail slider settings (no default arrows).
    const sliderSettings = {
        slidesToShow: 6, // Default: show 6 thumbnails on large screens
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
        swipeToSlide: true,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: "0px",
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 4, // Show 4 thumbnails on medium screens
                },
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 3, // Show 2 thumbnails on small screens
                },
            },
        ],
    };

    const handleThumbnailClick = (idx) => {
        setCurrentIndex(idx);
    };

    // Handlers for overlay arrows on the main image.
    const handleMainPrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
    };

    const handleMainNext = () => {
        setCurrentIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="gallery-container">
            {/* Main media display with overlay arrows */}
            <div className="main-media-wrapper" style={{ position: "relative" }}>
                {mainItem.type === "video" ? (
                    <video
                        src={mainItem.url}
                        autoPlay
                        muted
                        loop
                        className="main-image"
                        onClick={() => setDialogOpen(true)}
                    />
                ) : (
                    <img
                        src={mainItem.url}
                        alt="Principal"
                        className="main-image"
                        onClick={() => setDialogOpen(true)}
                    />
                )}
                {mediaItems.length > 1 && (
                    <>
                        <IconButton
                            onClick={handleMainPrev}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: 20,
                                transform: "translateY(-50%)",
                                color: "#fff",
                                background: "none",
                            }}
                        >
                            <ArrowBackIosNewIcon style={{ fontSize: "3rem" }} />
                        </IconButton>
                        <IconButton
                            onClick={handleMainNext}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: 20,
                                transform: "translateY(-50%)",
                                color: "#fff",
                                background: "none",
                            }}
                        >
                            <ArrowForwardIosIcon style={{ fontSize: "3rem" }} />
                        </IconButton>
                    </>
                )}
            </div>

            {/* Thumbnail slider without arrows */}
            <Slider {...sliderSettings} className="thumbnail-slider">
                {mediaItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="thumbnail-wrapper"
                        onClick={() => handleThumbnailClick(idx)}
                    >
                        {item.type === "video" ? (
                            <video
                                src={item.url}
                                muted
                                loop
                                className="thumbnail-image"
                            />
                        ) : (
                            <img
                                src={item.url}
                                alt={item.alt || `Thumb ${idx}`}
                                className="thumbnail-image"
                            />
                        )}
                    </div>
                ))}
            </Slider>

            {/* Fullscreen Carousel Dialog */}
            <FullScreenMediaCarouselDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                mediaItems={mediaItems}
                initialIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        </div>
    );
};

export default ImageGallery;
