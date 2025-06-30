/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { AlbumNaming } from "@/app/types/albumTypes";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  createAlbum: (data: AlbumNaming) => Promise<void>;
  loading?: boolean;
}

const CreateAlbumModal = ({
  isOpen,
  onClose,
  createAlbum,
  loading,
}: CreateAlbumModalProps) => {
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    await createAlbum({ name: newAlbumName, description: newAlbumDescription });
    resetLocaleState();
    onClose();
  };

  const resetLocaleState = () => {
    setNewAlbumName(""), setNewAlbumDescription("");
  };

  if (!isOpen) return null;

  return (
    <div css={styles.modalOverlay}>
      <div css={styles.modalContent}>
        <h2 css={styles.modalTitle}>Создать новый альбом</h2>
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
            onClick={handleCreateAlbum}
            disabled={loading || !newAlbumName.trim()}
          >
            {loading ? "Создание..." : "Создать"}
          </button>
          <button
            css={styles.closeButton}
            onClick={() => {
              onClose(), resetLocaleState();
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

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
    fontSize: "1.5rem",
    margin: 0,
  }),
  inputStyle: css({
    border: "2px solid rgb(12, 117, 236)",
    borderRadius: "8px",
    fontSize: "1rem",
    height: "34px",
    width: "100%",
    backgroundColor: "rgba(52, 93, 139, 0.4)", // #2a2a2a"
    color: "white",
    outline: "none",
    "&:focus": {
      borderColor: "rgb(85, 182, 247)",
      boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.3)",
    },
  }),
  textareaStyle: css({
    border: "2px solid rgb(12, 117, 236)",
    borderRadius: "8px",
    fontSize: "1rem",
    width: "100%",
    minHeight: "100px",
    backgroundColor: "rgba(52, 93, 139, 0.4)",
    color: "white",
    resize: "vertical",
    outline: "none",
    "&:focus": {
      borderColor: "rgb(85, 182, 247)",
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
    backgroundImage:
      "linear-gradient(211deg,rgb(47, 101, 152) 0%,rgb(67, 93, 133) 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "filter 0.2s, box-shadow 0.2s",
    fontSize: "1rem",
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
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#666",
    },
  }),
};

export default CreateAlbumModal;
