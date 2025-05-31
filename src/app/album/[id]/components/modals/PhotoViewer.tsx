/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Photo } from "../../types/photoTypes";

type PhotoViewerProps = {
  photo: Photo | null;
  onClose: () => void;
};

export default function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  if (!photo) return null;

  return (
    <div css={style.overlay} onClick={onClose}>
      <div css={style.viewer} onClick={(e) => e.stopPropagation()}>
        <button css={style.closeButton} onClick={onClose}>
          ×
        </button>
        <img src={photo.path} alt={`Photo ${photo.id}`} css={style.image} />
        <p css={style.caption}></p>
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
    maxHeight: "90%",
    background: "#1a1a2e",
    border: "2px solid #00ffea",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 0 20px rgba(0, 255, 234, 0.5)",
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
  }),
  image: css({
    maxWidth: "100%",
    maxHeight: "80vh",
    objectFit: "contain",
  }),
  caption: css({
    color: "#00ffea",
    textAlign: "center",
    marginTop: "1rem",
    fontFamily: "'Orbitron', sans-serif",
  }),
};
