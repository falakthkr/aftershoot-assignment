import React, { useState, useEffect } from "react";
import Gallery from "react-photo-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // Only for lightbox

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const imageUrls = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      width: 4, // Customize based on image aspect ratio
      height: 3,
    }));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
    e.target.value = ""; // Reset the file input for next upload
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setZoom((prevZoom) => Math.min(prevZoom + 0.25, 3)); // Max zoom at 3x
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.src));
    };
  }, [images]);

  const openLightbox = (event, { photo, index }) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="image-uploader-container">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: "10px" }}
      />

      <Gallery
        photos={images.map((image) => ({
          ...image,
          style: {
            transform: `scale(${zoom})`,
            transition: "transform 0.3s ease",
          },
        }))}
        onClick={openLightbox}
      />

      {isOpen && images.length > 0 && (
        <Lightbox
          mainSrc={images[photoIndex].src}
          nextSrc={images[(photoIndex + 1) % images.length].src}
          prevSrc={images[(photoIndex + images.length - 1) % images.length].src}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </div>
  );
};

export default ImageUploader;
