/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef } from "react";

type UploadSectionProps = {
  files: File[];
  uploading: boolean;
  uploadPhotos: () => void;
  setFiles: (files: File[]) => void;
};

/**
 * Компонент секция для загрузки фотографий из файловой системы, состоит из кнопки открытия ФС, текста названия файла и кнопки загрузки
 * @component
 * @returns {JSX.Element}
 */

function UploadSection({
  files,
  uploading,
  uploadPhotos,
  setFiles,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div css={style.uploadSection}>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={(e) =>
          setFiles(e.target.files ? Array.from(e.target.files) : [])
        }
        css={style.uploadInput}
      />
      <button
        css={style.uploadButton}
        onClick={uploadPhotos}
        disabled={files.length === 0 || uploading}
      >
        {uploading
          ? "Загрузка..."
          : files.length > 0
          ? `Загрузить ${files.length} фото`
          : "Загрузить фото"}
      </button>
    </div>
  );
}

export default UploadSection;

const style = {
  uploadSection: css({
    marginTop: "2rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(20, 20, 40, 0.7)",
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid rgb(169, 31, 185)",
    boxShadow: "0 0 10px rgba(255, 0, 255, 0.3)",

    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  }),

  uploadButton: css({
    background: "linear-gradient(45deg, #00ffea, #00b8d4)",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 0 10px rgba(0, 255, 234, 0.5)",

    "@media (max-width: 768px)": {
      width: "100%",
    },

    "&:hover": {
      background: "linear-gradient(45deg, #00b8d4, #00ffea)",
      boxShadow: "0 0 15px rgba(0, 255, 234, 0.8)",
    },
    "&:disabled": {
      background: "rgba(50, 50, 50, 0.7)",
      boxShadow: "none",
      cursor: "not-allowed",
    },
  }),

  uploadInput: css({
    color: "#00ffea",
    fontSize: "0.9rem",
    cursor: "pointer",

    // Сохраняем ширину автоматической части
    width: "auto",
    maxWidth: "100%",

    "&::file-selector-button": {
      background: "linear-gradient(45deg, #00ffea, #00b8d4)",
      border: "none",
      padding: "0.5rem 1.2rem",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 0 10px rgba(0, 255, 234, 0.5)",
      marginRight: "1rem",

      "&:hover": {
        background: "linear-gradient(45deg, #00b8d4, #00ffea)",
        boxShadow: "0 0 15px rgba(0, 255, 234, 0.8)",
      },
    },
  }),
};
