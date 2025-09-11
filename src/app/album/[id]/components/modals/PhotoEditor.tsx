/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { Photo } from "../../types/photoTypes";
import { AiOutlineClose } from "react-icons/ai";
import { FiCrop, FiFilter, FiType, FiEdit2 } from "react-icons/fi";
import { MdBrush, MdBlurOn } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { colorConst } from "@/app/shared/theme/colorConstant";
import { useImageZoomPan } from "../../hooks/useImageZoomPan";

interface PhotoEditorProps {
  photo: Photo | null;
  onClose: () => void;
  onSave: (editedPhoto: string) => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const {
    containerRef,
    imageRef,
    currentZoom,
    xOffset,
    yOffset,
    handleZoomIn,
    handleZoomOut,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    onDragStart,
  } = useImageZoomPan();

  useEffect(() => {
    if (photo) {
      setIsLoading(false);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [photo]);

  const handleSave = () => {
    if (photo) {
      onSave(photo.path);
    }
    onClose();
  };

  const handleModeClick = (mode: string) => {
    setActiveMode((prev) => (prev === mode ? null : mode));
  };

  const modes = [
    { name: "Обрезка", icon: FiCrop },
    { name: "Фильтры", icon: FiFilter },
    { name: "Текст", icon: FiType },
    { name: "Кисть", icon: MdBrush },
    { name: "Размытие", icon: MdBlurOn },
    { name: "Цветокоррекция", icon: FiEdit2 },
  ];

  if (!photo) return null;

  return (
    <div css={styles.overlay} onClick={onClose}>
      <div css={styles.editor} onClick={(e) => e.stopPropagation()}>
        <div css={styles.header}>
          <span css={styles.title}>Редактор</span>
          <button css={styles.closeIcon} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>

        <div css={styles.content}>
          <div
            ref={containerRef}
            css={styles.photoArea}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onContextMenu={handleContextMenu}
            onDragStart={onDragStart}
          >
            <img
              ref={imageRef}
              src={photo.path}
              alt={`Edit ${photo.id}`}
              css={css(styles.image, {
                transform: `translate(${xOffset}px, ${yOffset}px) scale(${currentZoom / 100})`,
                userSelect: "none",
                draggable: false,
              })}
            />
          </div>

          <div css={styles.modesPanel}>
            {modes.map((mode) => (
              <div
                key={mode.name}
                css={[styles.modeItem, activeMode === mode.name && styles.activeMode]}
                onClick={() => handleModeClick(mode.name)}
              >
                <mode.icon css={styles.modeIcon} />
                <span css={styles.modeText}>{mode.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div css={styles.footer}>
          <div css={styles.zoomPanel}>
            <div css={styles.zoomButton} onClick={handleZoomIn}>
              <FaPlus />
            </div>
            <span css={styles.zoomValue}>{currentZoom}%</span>
            <div css={styles.zoomButton} onClick={handleZoomOut}>
              <FaMinus />
            </div>
          </div>
          <button css={styles.saveButton} onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;

const styles = {
  overlay: css({
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1002,
  }),
  editor: css({
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    width: "90%", // Адаптивная ширина по умолчанию
    height: "90vh", // Адаптивная высота по умолчанию
    background: "var(--modal-background)",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: colorConst.photoPicker.boxShadow,
    gap: "1rem",
    "@media (min-width: 992px)": {
      width: "60%",
      height: "80vh",
    },
    "@media (max-width: 576px)": {
      width: "100%",
      height: "100vh",
      borderRadius: 0,
      padding: "0.5rem",
    },
  }),
  header: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 0.5rem",
    "@media (max-width: 576px)": {
      padding: "0 0.25rem",
    },
  }),
  title: css({
    color: "#fff",
    fontSize: "18px",
    fontWeight: 600,
    "@media (max-width: 576px)": {
      fontSize: "16px",
    },
  }),
  closeIcon: css({
    background: "none",
    border: "none",
    color: colorConst.photoPicker.closeIcon.bright,
    fontSize: "24px",
    cursor: "pointer",
    "&:hover": { color: colorConst.photoPicker.closeIcon.dim },
    "@media (max-width: 576px)": {
      fontSize: "20px",
    },
  }),
  content: css({
    display: "grid",
    gridTemplateColumns: "70% 28%",
    gap: "1rem",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "100%",
      gridTemplateRows: "auto auto",
    },
  }),
  photoArea: css({
    border: "1px solid #3ccf91",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f0f1a",
    overflow: "hidden",
    position: "relative",
    "@media (max-width: 768px)": {
      height: "60vh",
    },
    "@media (max-width: 576px)": {
      height: "50vh",
      borderRadius: "4px",
    },
  }),
  image: css({
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "transform 0.2s ease",
  }),
  modesPanel: css({
    border: "1px solid #7a5cff",
    borderRadius: "8px",
    padding: "0.5rem",
    background: "#1f1f3a",
    color: "#fff",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxHeight: "100%", // Ограничение высоты
    overflowY: "auto", // Прокрутка при переполнении
    "@media (max-width: 768px)": {
      order: 2, // Перемещаем панель ниже на мобильных
      maxHeight: "40vh",
    },
    "@media (max-width: 576px)": {
      fontSize: "12px",
      padding: "0.25rem",
    },
  }),
  modeItem: css({
    display: "flex",
    alignItems: "center",
    padding: "0.5rem",
    cursor: "pointer",
    borderRadius: "4px",
    "&:hover": {
      background: "rgba(122, 92, 255, 0.2)",
    },
    "@media (max-width: 576px)": {
      padding: "0.25rem",
    },
  }),
  activeMode: css({
    background: "rgba(122, 92, 255, 0.4)",
    fontWeight: 600,
  }),
  modeIcon: css({
    marginRight: "0.5rem",
    color: "#7a5cff",
    fontSize: "18px",
    "@media (max-width: 576px)": {
      fontSize: "16px",
    },
  }),
  modeText: css({
    color: "#fff",
    "@media (max-width: 576px)": {
      fontSize: "12px",
    },
  }),
  footer: css({
    display: "grid",
    gridTemplateColumns: "70% 28%",
    gap: "1rem",
    alignItems: "center",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto auto",
      gap: "0.5rem",
    },
  }),
  zoomPanel: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "12%",
    border: "1px solid #00bcd4",
    borderRadius: "8px",
    padding: "0.5rem",
    color: "#fff",
    fontSize: "14px",
    background: "#0f0f1a",
    "@media (max-width: 768px)": {
      width: "100%",
      justifyContent: "space-around",
    },
    "@media (max-width: 576px)": {
      fontSize: "12px",
      padding: "0.25rem",
    },
  }),
  zoomButton: css({
    cursor: "pointer",
    borderRadius: "4px",
    "&:hover": {
      opacity: "0.7",
    },
    "@media (max-width: 576px)": {
      fontSize: "14px",
    },
  }),
  zoomValue: css({
    margin: "0 0.5rem",
    fontSize: "14px",
    "@media (max-width: 576px)": {
      fontSize: "12px",
    },
  }),
  saveButton: css({
    border: "1px solid #ff9800",
    borderRadius: "8px",
    padding: "0.5rem 1.5rem",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    justifySelf: "end",
    "&:hover:not(:disabled)": { background: "#ff980020" },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    "@media (max-width: 768px)": {
      justifySelf: "center",
      width: "100%",
    },
    "@media (max-width: 576px)": {
      padding: "0.25rem 1rem",
      fontSize: "12px",
    },
  }),
};
