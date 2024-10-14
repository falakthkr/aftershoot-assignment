import React, { useState, useEffect } from "react";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [zoom, setZoom] = useState(1);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setZoom((prevZoom) => prevZoom + 0.25);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: "10px" }}
      />
      <div
        className="scrollable-container image-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`uploaded-${index}`}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.3s ease",
              width: "100%",
              height: "auto",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
