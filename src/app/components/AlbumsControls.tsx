/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import CreateAlbumModal from "./modals/CreateAlbumModal";
import { AlbumNaming } from "../types/albumTypes";

interface AlbumControlsProps {
  loading: boolean;
  albumCount: number;
  photoCount: number;
  createAlbum: (data: AlbumNaming) => Promise<void>;
  deleteAllAlbums: () => Promise<void>;
}

const AlbumsControls = ({
  loading,
  albumCount,
  photoCount,
  createAlbum,
  deleteAllAlbums,
}: AlbumControlsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div css={styles.headerStyle}>
        <h1 css={styles.titleStyle}>
          Альбомы
          <br /> альбомов: {albumCount} фотографий: {photoCount}
        </h1>
        <button
          css={styles.openModalButton}
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          Создать альбом
        </button>
      </div>
      <div css={styles.createAlbumStyle}>
        <button
          css={styles.deleteButtonStyle}
          onClick={() => deleteAllAlbums()}
          disabled={loading || albumCount === 0}
        >
          {loading ? "Удаление..." : "Удалить все"}
        </button>
      </div>
      <CreateAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        createAlbum={createAlbum}
        loading={loading}
      />
    </>
  );
};

export default AlbumsControls;

const styles = {
  headerStyle: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    backgroundColor: "grey",
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
  openModalButton: css({
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
