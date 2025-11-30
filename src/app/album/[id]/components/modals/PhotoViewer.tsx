/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Photo } from "../../types/photoTypes";
import MovePhotoModal from "./MovePhotoModal";
import PhotoEditor from "./PhotoEditor";
import ActionMenu from "./ActionMenu";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { AiOutlineClose } from "react-icons/ai";
import { colorConst } from "@/app/shared/theme/colorConstant";
import { customFonts } from "@/app/shared/theme/customFonts";
import { handleExpand } from "../../utils/expandPhotoUtils";
import { useImageZoomPan } from "../../hooks/useImageZoomPan";

interface PhotoViewerProps {
  photo: Photo | null;
  photos: Photo[];
  albumId: number;
  onClose: () => void;
  onSyncAfterPhotoDelete: (photoId: number) => void;
  onSyncAfterPhotoMove: (photoId: number) => void;
}

/**
 * Компонент для просмотра, навигации и удаления фотографий
 * Компонент отображает фотографии в оверлее, поддерживает переключение с помощью клавиатуры и удаление через API-запросы,
 * а также синхронизируется с родительским компонентом после удаления. Имеется возможность открытия фотографии в новой вкладке во весь экран с динамическим режимом отображения.
 * Поддержка зуммирования фотографии на колесо мыши
 * @component
 * @returns {JSX.Element}
 */

const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photo,
  photos,
  albumId,
  onClose,
  onSyncAfterPhotoDelete,
  onSyncAfterPhotoMove,
}) => {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [arrowsVisible, setArrowsVisible] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);

  const {
    containerRef,
    imageRef,
    currentZoom,
    xOffset,
    yOffset,
    handleWheel: originalHandleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    resetZoom,
    onDragStart,
  } = useImageZoomPan();

  // --- КАСТОМНЫЙ handleWheel на весь viewer ---
  const handleViewerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Первый зум-ин (вверх) → скрываем стрелки
    if (e.deltaY < 0 && currentZoom === 100 && arrowsVisible) {
      setArrowsVisible(false);
    }

    // Зум-аут до 100% → возвращаем стрелки
    if (currentZoom <= 100 && e.deltaY > 0 && !arrowsVisible) {
      setArrowsVisible(true);
    }

    originalHandleWheel(e);
  };

  // --- Инициализация текущего фото ---
  useEffect(() => {
    if (photo && photos.length > 0) {
      const initialPhoto = photos.find((p) => p.id === photo.id) || photos[0];
      setCurrentPhoto(initialPhoto);
    }
  }, [photo, photos]);

  // --- Блокируем скролл фона только когда пикер открыт ---
  useEffect(() => {
    if (!photo) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [photo]);

  // --- Синхронизация после удаления ---
  useEffect(() => {
    if (photos.length === 0) {
      onClose();
      return;
    }
    if (currentPhoto && !photos.some((p) => p.id === currentPhoto.id)) {
      const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
      const newIndex = currentIndex >= photos.length ? photos.length - 1 : currentIndex;
      setCurrentPhoto(photos[newIndex >= 0 ? newIndex : 0] || null);
    }
  }, [photos, currentPhoto, onClose]);

  // --- Клавиатура (отключена при зуме) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isFocusedInViewer = viewerRef.current?.contains(document.activeElement);
      if (!currentPhoto || photos.length <= 1 || (!isFocusedInViewer && isMoveModalOpen)) return;

      const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
      if (currentIndex === -1) return;

      if (event.key === "ArrowLeft" && currentZoom <= 100) {
        handlePrev();
      } else if (event.key === "ArrowRight" && currentZoom <= 100) {
        handleNext();
      } else if (event.key === "Escape") {
        handleClose();
      } else if (event.key === "Delete") {
        handleDelete();
      } else if (event.key === "m") {
        setIsMoveModalOpen(true);
      } else if ((event.key.toLowerCase() === "i" || event.key.toLowerCase() === "ш") && !isMoveModalOpen) {
        handleExpand(currentPhoto);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos, currentPhoto, isMoveModalOpen, currentZoom]);

  const handlePrev = () => {
    if (!currentPhoto || photos.length <= 1) return;
    const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentPhoto(photos[newIndex]);
  };

  const handleNext = () => {
    if (!currentPhoto || photos.length <= 1) return;
    const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
    const newIndex = (currentIndex + 1) % photos.length;
    setCurrentPhoto(photos[newIndex]);
  };

  const handleClose = () => {
    onClose();
    setCurrentPhoto(null);
    setIsEditModalOpen(false);
    setIsMoveModalOpen(false);
    setArrowsVisible(true);
    resetZoom();
  };

  const handleDelete = async () => {
    if (!currentPhoto) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: Number(currentPhoto.id) }),
      });
      setCurrentPhoto(null);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка удаления фотографии");
      }

      onSyncAfterPhotoDelete(currentPhoto.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
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
      if (!res.ok) throw new Error("Ошибка установки обложки");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Ошибка установки обложки: ${errorMessage}`);
    }
  };

  const handleMove = () => {
    if (onSyncAfterPhotoMove) {
      onSyncAfterPhotoMove(currentPhoto!.id);
      setCurrentPhoto(null);
    }
  };

  if (!photo || photos.length === 0 || !currentPhoto) return null;

  const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
  const photoPosition = photos.length > 1 ? `${currentIndex + 1} из ${photos.length}` : "";

  return (
    <>
      <div css={style.overlay} onClick={handleClose}>
        <div
          css={style.viewer}
          onClick={(e) => e.stopPropagation()}
          ref={viewerRef}
          onWheel={handleViewerWheel} // wheel на весь viewer
        >
          <button css={style.closeIcon} onClick={handleClose}>
            <AiOutlineClose />
          </button>

          {arrowsVisible && (
            <button css={style.switchAreaLeft} onClick={handlePrev} disabled={photos.length <= 1}>
              <SlArrowLeft css={style.arrowIcon} />
            </button>
          )}

          {/* Фото с зумом */}
          <div
            ref={containerRef}
            css={style.photoContainer}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onContextMenu={handleContextMenu}
            onDragStart={onDragStart}
          >
            <img
              ref={imageRef}
              src={currentPhoto.path}
              alt={`Photo ${currentPhoto.id}`}
              css={css(style.image, {
                transform: `translate(${xOffset}px, ${yOffset}px) scale(${currentZoom / 100})`,
                userSelect: "none",
                draggable: false,
              })}
            />
          </div>

          {arrowsVisible && (
            <button css={style.switchAreaRight} onClick={handleNext} disabled={photos.length <= 1}>
              <SlArrowRight css={style.arrowIcon} />
            </button>
          )}

          {/* Нижняя панель */}
          <div css={style.captionContainer}>
            <div>{photoPosition && <span css={style.photoPosition}>{photoPosition}</span>}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ActionMenu
                isDeleting={isDeleting}
                onEdit={() => setIsEditModalOpen(true)}
                onRotateLeft={() => console.log("Повернуть влево")}
                onRotateRight={() => console.log("Повернуть вправо")}
                onMove={() => setIsMoveModalOpen(true)}
                onSetCover={handleSetCover}
                onOpenOriginal={() => handleExpand(currentPhoto)}
                onDelete={handleDelete}
              />
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
      {isEditModalOpen && (
        <PhotoEditor
          photo={currentPhoto}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(editedPhoto) => {
            console.log("Отредактировано:", editedPhoto);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default PhotoViewer;

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
    overflow: "hidden",
  }),
  viewer: css({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden",
    maxWidth: "90%",
    height: "91vh",
    background: "#1a1a2e", // var(--modal-background) при желание
    border: "var(--photo-viewer-border-color)",
    borderRadius: "12px",
    boxShadow: "var(--photo-viewer-border-shadow)",
    padding: 0,
  }),
  photoContainer: css({
    position: "relative",
    flex: "1 1 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    cursor: "grab",
    "&:active": { cursor: "grabbing" },
  }),
  image: css({
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transition: "none",
  }),
  captionContainer: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    height: "30px",
    width: "95%",
    borderRadius: "6px",
    marginTop: "10px",
    marginBottom: "4px",
  }),
  closeIcon: css({
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    color: colorConst.photoPicker.closeIcon.bright,
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    lineHeight: "1",
    zIndex: 2020,
    "&:hover": { color: colorConst.photoPicker.closeIcon.dim },
  }),
  switchAreaLeft: css({
    position: "absolute",
    left: 0,
    top: 10,
    bottom: "calc(1rem + 2rem)",
    width: "50%",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: "8px 0 0 8px",
    transition: "background 0.3s",
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    "&:hover > *": { color: colorConst.photoPicker.arrowIcon.bright },
    zIndex: 2010,
  }),
  switchAreaRight: css({
    position: "absolute",
    right: 0,
    top: 10,
    bottom: "calc(1rem + 2rem)",
    width: "50%",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: "0 8px 8px 0",
    transition: "background 0.3s",
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    "&:hover > *": { color: colorConst.photoPicker.arrowIcon.bright },
    zIndex: 2010,
  }),
  arrowIcon: css({
    color: colorConst.photoPicker.arrowIcon.dim,
    fontSize: "30px",
  }),
  actionButton: css({
    color: colorConst.ActionMenuModal.actionButton.bright,
    cursor: "pointer",
    fontFamily: customFonts.fonts.ru,
    textWrap: "nowrap",
    padding: "0.1rem 0.3rem",
    borderRadius: "4px",
    transition: "background 0.3s",
    "&:hover": { background: colorConst.ActionMenuModal.actionButton.dim },
  }),
  disabledButton: css({
    cursor: "not-allowed",
    opacity: 0.5,
    "&:hover": { background: "none" },
  }),
  photoPosition: css({
    color: colorConst.photoPicker.photoPosition,
    fontFamily: customFonts.fonts.ru,
    textWrap: "nowrap",
    fontSize: "14px",
    padding: "0.1rem 0.3rem",
    borderRadius: "4px",
  }),
};
