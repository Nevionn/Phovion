/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface AlbumControlsProps {
  newAlbumName: string;
  setNewAlbumName: (name: string) => void;
  loading: boolean;
  albumCount: number;
  photoCount: number;
  createAlbum: () => Promise<void>;
  deleteAllAlbums: () => Promise<void>;
}

const AlbumControls = ({
  newAlbumName,
  setNewAlbumName,
  loading,
  albumCount,
  photoCount,
  createAlbum,
  deleteAllAlbums,
}: AlbumControlsProps) => {
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
        <button
          css={styles.buttonStyle}
          onClick={createAlbum}
          disabled={loading}
        >
          {loading ? "Создание..." : "Создать"}
        </button>
        <button
          css={styles.deleteButtonStyle}
          onClick={deleteAllAlbums}
          disabled={loading}
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
