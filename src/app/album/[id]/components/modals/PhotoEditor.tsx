/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Photo } from "../../types/photoTypes";
import { AiOutlineClose } from "react-icons/ai";
import { FiCrop, FiFilter, FiType, FiEdit2 } from "react-icons/fi";
import { MdBrush, MdBlurOn } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { colorConst } from "@/app/shared/theme/colorConstant";

interface PhotoEditorProps {
  photo: Photo | null;
  onClose: () => void;
  onSave: (editedPhoto: string) => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(100);

  useEffect(() => {
    if (photo) setIsLoading(false);
  }, [photo]);

  const handleSave = () => {
    if (photo) {
      onSave(photo.path);
    }
    onClose();
  };

  const modes = [
    { name: "Обрезка", icon: FiCrop },
    { name: "Фильтры", icon: FiFilter },
    { name: "Текст", icon: FiType },
    { name: "Кисть", icon: MdBrush },
    { name: "Размытие", icon: MdBlurOn },
    { name: "Цветокоррекция", icon: FiEdit2 },
  ];

  const handleModeClick = (mode: string) => {
    setActiveMode((prev) => (prev === mode ? null : mode));
  };

  const handleZoomIn = () => {
    setCurrentZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setCurrentZoom((prev) => Math.max(prev - 10, 10));
  };

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
          <div css={styles.photoArea}>
            <img
              src={photo.path}
              alt={`Edit ${photo.id}`}
              css={css(styles.image, { transform: `scale(${currentZoom / 100})` })}
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
            <div onClick={handleZoomIn}>
              <FaPlus />
            </div>
            <span css={styles.zoomValue}>{currentZoom}%</span>
            <div onClick={handleZoomOut}>
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
    width: "60%",
    height: "80vh",
    background: "var(--modal-background)",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: colorConst.photoPicker.boxShadow,
    gap: "1rem",
  }),
  header: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 0.5rem",
  }),
  title: css({
    color: "#fff",
    fontSize: "18px",
    fontWeight: 600,
  }),
  closeIcon: css({
    background: "none",
    border: "none",
    color: colorConst.photoPicker.closeIcon.bright,
    fontSize: "24px",
    cursor: "pointer",
    "&:hover": { color: colorConst.photoPicker.closeIcon.dim },
  }),
  content: css({
    display: "grid",
    gridTemplateColumns: "70% 28%",
    gap: "1rem",
    overflow: "hidden",
  }),
  photoArea: css({
    border: "1px solid #3ccf91",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f0f1a",
    overflow: "hidden",
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
  }),
  activeMode: css({
    background: "rgba(122, 92, 255, 0.4)",
    fontWeight: 600,
  }),
  modeIcon: css({
    marginRight: "0.5rem",
    color: "#7a5cff",
    fontSize: "18px",
  }),
  modeText: css({
    color: "#fff",
  }),
  footer: css({
    display: "grid",
    gridTemplateColumns: "70% 28%",
    gap: "1rem",
    alignItems: "center",
  }),
  zoomPanel: css({
    border: "1px solid #00bcd4",
    borderRadius: "8px",
    padding: "0.5rem",
    color: "#fff",
    fontSize: "14px",
    background: "#0f0f1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "12%",
  }),
  zoomValue: css({
    margin: "0 0.5rem",
    fontSize: "14px",
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
  }),
};
