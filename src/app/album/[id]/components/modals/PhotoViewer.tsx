/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Photo } from "../../types/photoTypes";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { TbSeparator } from "react-icons/tb";
import MovePhotoModal from "./MovePhotoModal";
import { AiOutlineClose } from "react-icons/ai";

type PhotoViewerProps = {
  photo: Photo | null;
  photos: Photo[];
  albumId: number;
  onClose: () => void;
  onSyncAfterPhotoDelete: (photoId: number) => void;
  onSyncAfterPhotoMove: (photoId: number) => void;
};

/**
 * Компонент для просмотра, навигации и удаления фотографий
 * Компонент отображает фотографии в оверлее, поддерживает переключение с помощью клавиатуры и удаление через API-запросы, а также синхронизируется с родительским компонентом после удаления
 * @component
 * @returns {JSX.Element}
 */

export default function PhotoViewer({
  photo,
  photos,
  albumId,
  onClose,
  onSyncAfterPhotoDelete,
  onSyncAfterPhotoMove,
}: PhotoViewerProps) {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  useEffect(() => {
    console.log("пикер открыт с фото:", photo);
    console.log("текущий photos:", photos);
    if (photo && photos.length > 0) {
      const initialPhoto = photos.find((p) => p.id === photo.id) || photos[0];
      setCurrentPhoto(initialPhoto);
    }
  }, [photo, photos]);

  // Корректировка после изменения photos (например, после удаления)
  useEffect(() => {
    if (photos.length === 0) {
      console.log("photos пуст, закрываем пикер");
      onClose();
      return;
    }

    if (currentPhoto && !photos.some((p) => p.id === currentPhoto.id)) {
      console.log("текущая фотография удалена, выбираем новую");
      const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
      const newIndex =
        currentIndex >= photos.length ? photos.length - 1 : currentIndex;
      setCurrentPhoto(photos[newIndex >= 0 ? newIndex : 0] || null);
    }
  }, [photos, currentPhoto, onClose]);

  // Обработчик клавиш
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentPhoto || photos.length <= 1) return;

      const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
      if (currentIndex === -1) return;

      if (event.key === "ArrowLeft") {
        const newIndex = (currentIndex - 1 + photos.length) % photos.length;
        setCurrentPhoto(photos[newIndex]);
      } else if (event.key === "ArrowRight") {
        const newIndex = (currentIndex + 1) % photos.length;
        setCurrentPhoto(photos[newIndex]);
      } else if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Delete") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos, currentPhoto, onClose]);

  const handlePrev = () => {
    if (!currentPhoto || photos.length <= 1) return;

    const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
    if (currentIndex === -1) return;

    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentPhoto(photos[newIndex]);
  };

  const handleNext = () => {
    if (!currentPhoto || photos.length <= 1) return;

    const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
    if (currentIndex === -1) return;

    const newIndex = (currentIndex + 1) % photos.length;
    setCurrentPhoto(photos[newIndex]);
  };

  const handleClose = () => onClose();

  const handleDelete = async () => {
    if (!currentPhoto) return;
    console.log("удаляем фотографию с id:", currentPhoto.id);

    setIsDeleting(true);
    try {
      const res = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: Number(currentPhoto.id) }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка удаления фотографии");
      }

      onSyncAfterPhotoDelete(currentPhoto.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка при удалении:", errorMessage);
      alert(`Не удалось удалить фотографию: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetCover = async () => {
    if (!currentPhoto) return;

    try {
      const res = await fetch(`/api/albums/cover`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: currentPhoto.id, albumId }),
      });

      if (!res.ok) {
        const text = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          throw new Error("Сервер вернул некорректный ответ");
        }
        throw new Error(errorData.error || "Ошибка установки обложки");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка при установке обложки:", errorMessage);
      alert(`Не удалось установить обложку: ${errorMessage}`);
    }
  };

  const handleMoveClick = () => {
    setIsMoveModalOpen(true);
  };

  const handleMove = () => {
    if (onSyncAfterPhotoMove) {
      onSyncAfterPhotoMove(currentPhoto!.id);
    }
  };

  if (!photo || photos.length === 0 || !currentPhoto) return null;

  // Вычисляем текущий индекс для индикации (например, "2 из 8")
  const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
  const photoPosition =
    photos.length > 1 ? `${currentIndex + 1} из ${photos.length}` : "";

  return (
    <>
      <div css={style.overlay} onClick={handleClose}>
        <div css={style.viewer} onClick={(e) => e.stopPropagation()}>
          <button css={style.closeIcon} onClick={handleClose}>
            <AiOutlineClose />
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                css={[style.actionButton, isDeleting && style.disabledButton]}
                onClick={handleDelete}
              >
                {isDeleting ? "Удаление..." : "Удалить"}
              </span>
              <TbSeparator />
              <span css={style.actionButton} onClick={handleMoveClick}>
                Перенести
              </span>
              <TbSeparator />
              <span css={style.actionButton} onClick={handleSetCover}>
                Сделать обложкой
              </span>
            </div>
            <div>
              {photoPosition && (
                <span css={style.photoPosition}>{photoPosition}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {isMoveModalOpen && (
        <MovePhotoModal
          photoId={currentPhoto.id}
          currentAlbumId={albumId}
          onClose={() => setIsMoveModalOpen(false)}
          onMove={handleMove}
        />
      )}
    </>
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
    padding: "2rem",
    boxShadow: "0 0 20px rgba(0, 255, 234, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }),
  closeIcon: css({
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
    "&:hover": {
      color: "#00d1ea",
    },
  }),
  switchAreaLeft: css({
    position: "absolute",
    left: 0,
    top: 46,
    bottom: "calc(1rem + 4rem)",
    width: "50%",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: "8px 0 0 8px",
    transition: "background 0.3s",
    // "&:hover": { background: "rgba(0, 255, 234, 0.1)" },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    zIndex: 2010,
  }),
  switchAreaRight: css({
    position: "absolute",
    right: 0,
    top: 46,
    bottom: "calc(1rem + 4rem)",
    width: "50%",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: "0 8px 8px 0",
    transition: "background 0.3s",
    // "&:hover": { background: "rgba(0, 255, 234, 0.1)" },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    zIndex: 2010,
  }),
  arrowIcon: css({ color: "#00ffea", fontSize: "30px" }),
  image: css({ maxWidth: "100%", maxHeight: "91vh", objectFit: "contain" }),
  captionContainer: css({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
    padding: "0.5rem",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
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
  photoPosition: css({
    color: "#00ffea",
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "14px",
    padding: "0.1rem 0.5rem",
    borderRadius: "4px",
  }),
};
