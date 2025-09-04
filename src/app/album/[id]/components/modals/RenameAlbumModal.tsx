/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { AlbumNaming } from "@/app/types/albumTypes";
import { customFonts } from "@/app/shared/theme/customFonts";

interface RenameAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentDescription: string | null;
  renameAlbum: (data: AlbumNaming) => Promise<void>;
  loading?: boolean;
}

const RenameAlbumModal = ({
  isOpen,
  onClose,
  currentName,
  currentDescription,
  renameAlbum,
  loading,
}: RenameAlbumModalProps) => {
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewAlbumName(currentName);
      setNewAlbumDescription(currentDescription || "");
    }
  }, [isOpen, currentName, currentDescription]);

  const hasChanges =
    newAlbumName.trim() !== currentName ||
    (newAlbumDescription.trim() === "" && currentDescription !== null) ||
    newAlbumDescription.trim() !== (currentDescription || "");

  const handleRenameAlbum = async () => {
    if (!newAlbumName.trim()) return;

    const data: AlbumNaming = {
      name: newAlbumName,
      description: newAlbumDescription.trim() === "" ? null : newAlbumDescription || null,
    };

    console.log("Новое название и описание:", data);

    try {
      await renameAlbum(data);
      resetLocaleState();
      onClose();
    } catch (error) {
      console.error("Ошибка переименования:", error);
    }
  };

  const resetLocaleState = () => {
    setNewAlbumName("");
    setNewAlbumDescription("");
  };

  if (!isOpen) return null;

  return (
    <div css={styles.modalOverlay}>
      <div css={styles.modalContent}>
        <h2 css={styles.modalTitle}>Переименовать альбом</h2>
        <input
          css={styles.inputStyle}
          type="text"
          placeholder="Название альбома"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <textarea
          css={styles.textareaStyle}
          placeholder="Описание альбома"
          value={newAlbumDescription}
          onChange={(e) => setNewAlbumDescription(e.target.value)}
        />
        <div css={styles.buttonContainer}>
          <button
            css={styles.buttonStyle}
            onClick={handleRenameAlbum}
            disabled={loading || !newAlbumName.trim() || !hasChanges}
          >
            {loading ? "Изменение..." : "Изменить"}
          </button>
          <button
            css={styles.closeButton}
            onClick={() => {
              resetLocaleState();
              onClose();
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameAlbumModal;

const styles = {
  modalOverlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }),
  modalContent: css({
    backgroundColor: "var(--modal-background, #142b5c)",
    padding: "2rem",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  }),
  modalTitle: css({
    color: "white",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    fontSize: customFonts.fonts.size.headerTitle,
    textAlign: "left",
    margin: 0,
  }),
  inputStyle: css({
    border: "2px solid var(--create-album-modal-input-fields-border-color-non-target)",
    borderRadius: "8px",
    fontSize: customFonts.fonts.size.inputText,
    height: "34px",
    width: "100%",
    backgroundColor: "var(--create-album-modal-input-fields-color)",
    color: "white",
    outline: "none",
    "&:focus": {
      borderColor: "var(--create-album-modal-input-fields-border-color-target)",
      boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.3)",
    },
  }),
  textareaStyle: css({
    border: "2px solid var(--create-album-modal-input-fields-border-color-non-target)",
    borderRadius: "8px",
    fontSize: customFonts.fonts.size.inputText,
    width: "100%",
    minHeight: "100px",
    backgroundColor: "var(--create-album-modal-input-fields-color)",
    color: "white",
    resize: "vertical",
    outline: "none",
    "&:focus": {
      borderColor: "var(--create-album-modal-input-fields-border-color-target)",
      boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.3)",
    },
  }),
  buttonContainer: css({
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  }),
  buttonStyle: css({
    padding: "0.5rem 1rem",
    backgroundImage: "var(--create-album-button-color)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "filter 0.2s, box-shadow 0.2s",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    fontSize: customFonts.fonts.size.buttonText,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      filter: "brightness(1.15)",
    },
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: "rgba(80, 84, 99, 0.84)",
      cursor: "not-allowed",
      boxShadow: "none",
    },
  }),
  closeButton: css({
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(80, 84, 99, 0.84)",
    color: "white",
    border: "none",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    fontSize: customFonts.fonts.size.buttonText,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#666",
    },
  }),
};
