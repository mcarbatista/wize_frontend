import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ImageGallery.css";

const ImageGallery = ({ images = [] }) => {
    const [mainImage, setMainImage] = useState(images[0]?.url);

    const sliderSettings = {
        slidesToShow: Math.min(images.length, 6),
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
        swipeToSlide: true,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: "0px",
    };

    return (
        <div className="gallery-container">
            <img src={mainImage} alt="Principal" className="main-image" />
            <Slider {...sliderSettings} className="thumbnail-slider">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="thumbnail-wrapper"
                        onClick={() => setMainImage(img.url)}
                    >
                        <img
                            src={img.url}
                            alt={`Thumb ${idx}`}
                            className="thumbnail-image"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageGallery;
