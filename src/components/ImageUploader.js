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

  const handleChange = (data) => {
    let newImages = data.fileList.map((image) => image);
    setImages(newImages);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setZoom((prevZoom) => (prevZoom < 2 ? prevZoom + 0.25 : 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
            key={index}
            style={{
              display: "inline-block",
              margin: "15px",
              width: "400px",
              height: "250px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid grey",
              borderRadius: "10px",
            }}
          >
            <img
              src={URL.createObjectURL(image.originFileObj)}
              alt={`Uploaded ${index + 1}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "auto",
                height: "auto",
                minWidth: "100%",
                minHeight: "100%",
                transform: `translate(-50%, -50%) scale(${zoom})`,
                cursor: "pointer",
              }}
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
