/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Photo } from "../../types/photoTypes";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type PhotoViewerProps = {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
};

export default function PhotoViewer({
  photo,
  photos,
  onClose,
}: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    console.log("пикер открыт с фото:", photo);
    if (photo && photos.length > 0) {
      const index = photos.findIndex((p) => p.id === photo.id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setCurrentIndex(0);
    }
  }, [photo, photos]);

  const handlePrev = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  if (!photo) return null;

  const currentPhoto = photos[currentIndex] || photo;

  const handleClose = () => {
    onClose();
  };

  return (
    <div css={style.overlay} onClick={handleClose}>
      <div css={style.viewer} onClick={(e) => e.stopPropagation()}>
        <button css={style.closeButton} onClick={handleClose}>
          ×
        </button>
        <button
          css={style.arrowButtonLeft}
          onClick={handlePrev}
          disabled={photos.length <= 1}
        >
          <FaArrowLeft />
        </button>
        <img
          src={currentPhoto.path}
          alt={`Photo ${currentPhoto.id}`}
          css={style.image}
        />
        <button
          css={style.arrowButtonRight}
          onClick={handleNext}
          disabled={photos.length <= 1}
        >
          <FaArrowRight />
        </button>
        <div css={style.captionContainer}>
          <p css={style.caption}></p>
          {/* Плейсхолдер для будущих кнопок */}
          <div css={style.buttonPlaceholder}></div>
        </div>
      </div>
    </div>
  );
}

const style = {
  overlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }),
  viewer: css({
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90vh",
    background: "#1a1a2e",
    border: "2px solid #00ffea",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 0 20px rgba(0, 255, 234, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }),
  closeButton: css({
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    color: "#00ffea",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    lineHeight: "1",
    zIndex: 1001,
  }),
  arrowButtonLeft: css({
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "#00ffea",
    fontSize: "24px",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "50%",
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    zIndex: 2010,
  }),
  arrowButtonRight: css({
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "#00ffea",
    fontSize: "24px",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "50%",
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    zIndex: 2010,
  }),
  image: css({
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
  }),
  captionContainer: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1rem",
    padding: "0.5rem",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
  }),
  caption: css({
    color: "#00ffea",
    textAlign: "center",
    fontFamily: "'Orbitron', sans-serif",
    margin: "0",
  }),
  buttonPlaceholder: css({
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  }),
};
