/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

interface AlbumControlsProps {
  loading: boolean;
  albumCount: number;
  photoCount: number;
  createAlbum: (data: { name: string; description: string }) => Promise<void>;
  deleteAllAlbums: () => Promise<void>;
}

const AlbumControls = ({
  loading,
  albumCount,
  photoCount,
  createAlbum,
  deleteAllAlbums,
}: AlbumControlsProps) => {
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    await createAlbum({ name: newAlbumName, description: newAlbumDescription });
    resetLocaleState();
  };

  const resetLocaleState = () => {
    setNewAlbumName(""), setNewAlbumDescription("");
  };

  return (
    <>
      <div css={styles.headerStyle}>
        <h1 css={styles.titleStyle}>
          Альбомы
          <br /> альбомов: {albumCount} фотографий: {photoCount}
        </h1>
      </div>

      <div css={styles.createAlbumStyle}>
        <input
          css={styles.inputStyle}
          type="text"
          placeholder="Название альбома"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <input
          css={styles.inputStyle}
          type="text"
          placeholder="Описание альбома"
          value={newAlbumDescription}
          onChange={(e) => setNewAlbumDescription(e.target.value)}
        />
        <button
          css={styles.buttonStyle}
          onClick={handleCreateAlbum}
          disabled={loading || !newAlbumName.trim()}
        >
          {loading ? "Создание..." : "Создать"}
        </button>
        <button
          css={styles.deleteButtonStyle}
          onClick={() => {
            deleteAllAlbums(), resetLocaleState();
          }}
          disabled={loading || albumCount === 0}
        >
          {loading ? "Удаление..." : "Удалить все"}
        </button>
      </div>
    </>
  );
};

export default AlbumControls;

const styles = {
  headerStyle: css({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  }),
  titleStyle: css({
    fontSize: "2rem",
    color: "white",
  }),
  createAlbumStyle: css({
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  }),
  inputStyle: css({
    padding: "0.5rem",
    border: "2px solid purple",
    borderRadius: "8px",
    fontSize: "1rem",
  }),
  buttonStyle: css({
    padding: "0.5rem 1rem",
    backgroundImage: "linear-gradient(211deg, #846392 0%, #604385 100%)",
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
      backgroundColor: "#ccc",
      cursor: "not-allowed",
      boxShadow: "none",
    },
  }),
  deleteButtonStyle: css({
    padding: "0.5rem 1rem",
    backgroundImage: "linear-gradient(211deg, #933232 0%, #7a2a2a 100%)",
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
      backgroundColor: "#ccc",
      cursor: "not-allowed",
      boxShadow: "none",
    },
  }),
};
