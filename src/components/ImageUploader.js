import React, { useState, useEffect } from "react";
import "./ImageUploader.css";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const imageUrls = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      width: 300,
      height: 250,
    }));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
    e.target.value = "";
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setZoom((prevZoom) => Math.min(prevZoom + 0.25, 3));
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

  const openLightbox = (index) => {
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

      <div className="gallery">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`Uploaded ${index + 1}`}
            width={image.width * zoom}
            height={image.height * zoom}
            onClick={() => openLightbox(index)}
            style={{ cursor: "pointer", transition: "transform 0.3s ease" }}
          />
        ))}
      </div>

      {isOpen && images.length > 0 && (
        <div className="lightbox">
          <span className="close" onClick={() => setIsOpen(false)}>
            &times;
          </span>
          <img
            src={images[photoIndex].src}
            alt={`Lightbox ${photoIndex + 1}`}
          />
          <div className="navigation">
            <button
              onClick={() =>
                setPhotoIndex((photoIndex - 1 + images.length) % images.length)
              }
            >
              Prev
            </button>
            <button
              onClick={() => setPhotoIndex((photoIndex + 1) % images.length)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
