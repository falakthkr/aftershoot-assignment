import React, { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./ImageUploader.css";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(null);
  const [positions, setPositions] = useState({});
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleChange = (data) => {
    let newImages = data.fileList.map((image) => image);
    setImages(newImages);
  };

  const handleMouseDown = (e, index) => {
    setIsDragging(index);
    setStartPosition({
      x: e.clientX - (positions[index]?.x || 0),
      y: e.clientY - (positions[index]?.y || 0),
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging !== null) {
      setPositions((prevPositions) => ({
        ...prevPositions,
        [isDragging]: {
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setZoom((prevZoom) => (prevZoom < 2 ? prevZoom + 0.25 : 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPosition]);

  return (
    <div className="image-uploader-container">
      <Upload
        fileList={[]}
        onChange={handleChange}
        beforeUpload={() => false}
        accept="image/*"
        multiple
      >
        <Button icon={<PlusOutlined />}>Upload Images</Button>
      </Upload>

      {isOpen && images.length > 0 && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map((img) => ({
            src: URL.createObjectURL(img.originFileObj),
          }))}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
          plugins={[Thumbnails]}
        />
      )}

      <div className="uploaded-images">
        {images.map((image, index) => (
          <div
            className="image-container"
            key={index}
            style={{
              width: images.length % 2 === 1 ? `${93 / 3}%` : "47%",
              position: "relative",
            }}
          >
            <img
              src={URL.createObjectURL(image.originFileObj)}
              alt={`Uploaded ${index + 1}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `translate(${positions[index]?.x || 0}px, ${
                  positions[index]?.y || 0
                }px) translate(-50%, -50%) scale(${zoom})`,
                cursor: isDragging === index ? "grabbing" : "grab",
              }}
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
              onMouseDown={(e) => handleMouseDown(e, index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
