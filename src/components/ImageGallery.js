import React, { useState } from "react";
import Slider from "react-slick";
import "../styles/ImageGallery.css";
import FullScreenMediaCarouselDialog from "./FullScreenMediaCarouselDialog";

const ImageGallery = ({ mediaItems = [] }) => {
    // Set the first media's URL as the main image.
    const [mainMedia, setMainMedia] = useState(
        mediaItems.length > 0 ? mediaItems[0].url : ""
    );
    // Keep track of the index for full-screen display.
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    const sliderSettings = {
        slidesToShow: Math.min(mediaItems.length, 6),
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
        swipeToSlide: true,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: "0px",
    };

    const handleThumbnailClick = (item, idx) => {
        setMainMedia(item.url);
        setCurrentIndex(idx);
    };

    return (
        <div className="gallery-container">
            {/* Main media display */}
            <img
                src={mainMedia}
                alt="Principal"
                className="main-image"
                onClick={() => setOpenDialog(true)}
            />
            <Slider {...sliderSettings} className="thumbnail-slider">
                {mediaItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="thumbnail-wrapper"
                        onClick={() => handleThumbnailClick(item, idx)}
                    >
                        <img
                            src={item.url}
                            alt={item.alt || `Thumb ${idx}`}
                            className="thumbnail-image"
                        />
                    </div>
                ))}
            </Slider>

            {/* Fullscreen Carousel Dialog */}
            <FullScreenMediaCarouselDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                mediaItems={mediaItems}
                initialIndex={currentIndex}
            />
        </div>
    );
};

export default ImageGallery;
