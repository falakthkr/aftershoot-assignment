import React, { useState, useEffect } from "react";
import { Upload, Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./ImageUploader.css";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = (data) => {
    let newImages = data.fileList.map((image) => image);
    setImages(newImages);
  };

  const handleCancelPreview = () => setPreviewVisible(false);

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
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
        accept="image/*"
        multiple
      >
        <Button icon={<PlusOutlined />}>Upload Images</Button>
      </Upload>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>

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
              transform: `scale(${zoom})`,
              display: "inline-block",
              margin: "10px",
            }}
          >
            <img
              src={URL.createObjectURL(image.originFileObj)}
              alt={`Uploaded ${index + 1}`}
              width="300"
              height="250"
              style={{
                objectFit: "cover",
                cursor: "pointer",
                border: "1px solid grey",
                margin: "10px",
                borderRadius: "10px",
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
