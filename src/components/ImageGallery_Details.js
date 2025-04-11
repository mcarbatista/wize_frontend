import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { useTheme, useMediaQuery } from "@mui/material";
import "../styles/ImageGallery.css";
// import FullScreenMediaCarouselDialog from "./FullScreenMediaCarouselDialog";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageGallery = ({ mediaItems = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const mainSliderRef = useRef(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMedium = useMediaQuery(theme.breakpoints.down("md"));

    // Identify the item with alt="Imagen" so we can start there:
    const mainImageIndex = mediaItems.findIndex((item) => item.alt === "Imagen");

    // Main slider settings: enables swipe and updates currentIndex on slide change.
    const mainSliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        swipe: true,
        adaptiveHeight: true, // help slider adjust height
        initialSlide: mainImageIndex >= 0 ? mainImageIndex : 0,
        afterChange: (idx) => setCurrentIndex(idx),
        accessibility: false,
    };

    // Thumbnail slider settings (no default arrows).
    const thumbnailSliderSettings = {
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
        swipeToSlide: true,
        focusOnSelect: true,
        centerPadding: "0px",
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

    const handleThumbnailClick = (idx) => {
        setCurrentIndex(idx);
        mainSliderRef.current.slickGoTo(idx);
    };

    // Arrow button functions for the main slider
    const handleMainPrev = () => {
        mainSliderRef.current.slickPrev();
    };

    const handleMainNext = () => {
        mainSliderRef.current.slickNext();
    };

    // Base arrow style with white color
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
        left: isMobile ? "10px" : isMedium ? "35px" : "45px",
    };

    const rightArrowStyle = {
        ...arrowStyle,
        right: isMobile ? "10px" : isMedium ? "30px" : "45px",
    };

    const iconFontSize = isMobile ? "2rem" : isMedium ? "2.5rem" : "3rem";

    // Fallback check: if type is not provided, detect based on file extension.
    const isVideoItem = (item) => {
        const url = item.url.trim().toLowerCase();
        const detected = item.type === "video" || url.endsWith(".mp4") || url.endsWith(".mov");
        console.log(`Checking item: ${url} -> isVideo: ${detected}`);
        return detected;
    };

    // Helper to determine the correct MIME type based on file extension.
    const getVideoMimeType = (url) => {
        const lowerUrl = url.trim().toLowerCase();
        if (lowerUrl.endsWith(".mov")) {
            return "video/quicktime";
        }
        return "video/mp4";
    };

    useEffect(() => {
        // Log mediaItems for debugging.
        mediaItems.forEach((item, idx) => {
            console.log(`Media item ${idx}: URL: ${item.url}, type: ${item.type || "undefined"}, isVideo: ${isVideoItem(item)}, mime: ${isVideoItem(item) ? getVideoMimeType(item.url) : "n/a"}`);
        });
    }, [mediaItems]);

    return (
        <div className="gallery-container">
            <div className="main-media-wrapper">
                <Slider ref={mainSliderRef} {...mainSliderSettings}>
                    {mediaItems.map((item, idx) => {
                        const isActive = idx === currentIndex;
                        console.log(`Slide ${idx} active: ${isActive}`);
                        return (
                            <div key={idx} data-active={isActive} onClick={() => setDialogOpen(true)}>
                                {isVideoItem(item) ? (
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls
                                        poster={item.poster || ""}
                                        className="main-image"
                                        style={{
                                            width: "100%",
                                            height: "650px",
                                            objectFit: "cover"
                                        }}
                                    >
                                        <source src={item.url} type={getVideoMimeType(item.url)} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.alt || "Principal"}
                                        className="main-image"
                                        style={{
                                            width: "100%",
                                            height: "650px",
                                            objectFit: "cover"
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </Slider>

                {mediaItems.length > 1 && (
                    <>
                        <IconButton
                            onClick={handleMainPrev}
                            className="arrow-button left-arrow"
                            sx={leftArrowStyle}
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: iconFontSize, color: "#ffffff" }} />
                        </IconButton>
                        <IconButton
                            onClick={handleMainNext}
                            className="arrow-button right-arrow"
                            sx={rightArrowStyle}
                        >
                            <ArrowForwardIosIcon sx={{ fontSize: iconFontSize, color: "#ffffff" }} />
                        </IconButton>
                    </>
                )}
            </div>

            <Slider {...thumbnailSliderSettings} className="thumbnail-slider">
                {mediaItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="thumbnail-wrapper"
                        onClick={() => handleThumbnailClick(idx)}
                    >
                        {isVideoItem(item) ? (
                            <video
                                muted
                                loop
                                className="thumbnail-image"
                            >
                                <source src={item.url} type={getVideoMimeType(item.url)} />
                                Your browser does not support the video tag.
                            </video>
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

            {/* <FullScreenMediaCarouselDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                mediaItems={mediaItems}
                initialIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            /> */}
        </div>
    );
};

export default ImageGallery;
