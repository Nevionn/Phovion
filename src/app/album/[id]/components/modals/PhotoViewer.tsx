/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Photo } from "../../types/photoTypes";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { TbSeparator } from "react-icons/tb";

type PhotoViewerProps = {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onSyncAfterPhotoDelete: (photoId: number) => void;
};

export default function PhotoViewer({
  photo,
  photos,
  onClose,
  onSyncAfterPhotoDelete,
}: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log("пикер открыт с фото:", photo);
    if (photo && photos.length > 0) {
      setCurrentIndex(
        photos.findIndex((p) => p.id === photo.id) >= 0
          ? photos.findIndex((p) => p.id === photo.id)
          : 0
      );
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && photos.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (event.key === "ArrowRight" && photos.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      } else if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Delete") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, photos, onClose]);

  const handlePrev = () => {
    photos.length > 1 &&
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    photos.length > 1 && setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handleClose = () => onClose();

  const handleDelete = async () => {
    if (!photo) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: Number(photo.id) }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка удаления фотографии");
      }

      const data = await res.json();
      console.log("Фотография удалена:", data);

      onSyncAfterPhotoDelete(photo.id);

      if (photos.length === 1) {
        onClose();
      } else {
        setCurrentIndex((prev) => {
          const newIndex = prev === photos.length - 1 ? prev - 1 : prev;
          return newIndex >= 0 ? newIndex : 0;
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка при удалении:", errorMessage);
      alert(`Не удалось удалить фотографию: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!photo) return null;

  const currentPhoto = photos[currentIndex] || photo;

  return (
    <div css={style.overlay} onClick={handleClose}>
      <div css={style.viewer} onClick={(e) => e.stopPropagation()}>
        <button css={style.closeButton} onClick={handleClose}>
          ×
        </button>
        <button
          css={style.switchAreaLeft}
          onClick={handlePrev}
          disabled={photos.length <= 1}
        >
          <SlArrowLeft css={style.arrowIcon} />
        </button>
        <img
          src={currentPhoto.path}
          alt={`Photo ${currentPhoto.id}`}
          css={style.image}
        />
        <button
          css={style.switchAreaRight}
          onClick={handleNext}
          disabled={photos.length <= 1}
        >
          <SlArrowRight css={style.arrowIcon} />
        </button>
        <div css={style.captionContainer}>
          <div css={style.actionButtons}>
            <span
              css={[style.actionButton, isDeleting && style.disabledButton]}
              onClick={handleDelete}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </span>
            <TbSeparator />
            <span css={style.actionButton}>Перенести</span>
          </div>
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
  switchAreaLeft: css({
    position: "absolute",
    left: 0,
    top: 46,
    bottom: "calc(1rem + 4rem)",
    width: "60px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px 0 0 8px",
    transition: "background 0.3s",
    "&:hover": { background: "rgba(0, 255, 234, 0.1)" },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    zIndex: 2010,
  }),
  switchAreaRight: css({
    position: "absolute",
    right: 0,
    top: 46,
    bottom: "calc(1rem + 4rem)",
    width: "60px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0 8px 8px 0",
    transition: "background 0.3s",
    "&:hover": { background: "rgba(0, 255, 234, 0.1)" },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    zIndex: 2010,
  }),
  arrowIcon: css({ color: "#00ffea", fontSize: "30px" }),
  image: css({ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }),
  captionContainer: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "1rem",
    padding: "0.5rem",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
  }),
  actionButtons: css({
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),
  actionButton: css({
    color: "#00ffea",
    cursor: "pointer",
    fontFamily: "'Orbitron', sans-serif",
    padding: "0.1rem 0.5rem",
    borderRadius: "4px",
    transition: "background 0.3s",
    "&:hover": { background: "rgba(0, 255, 234, 0.2)" },
  }),
  disabledButton: css({
    cursor: "not-allowed",
    opacity: 0.5,
    "&:hover": { background: "none" },
  }),
};
