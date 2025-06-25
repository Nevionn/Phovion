/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import CreateAlbumModal from "./modals/CreateAlbumModal";
import { AlbumNaming } from "../types/albumTypes";
import { FaMicrochip } from "react-icons/fa6";
import Separator from "../shared/separator/Separator";
import SettingsModal from "./modals/SettingsModal";

/**
 * Компонент управления альбомами, отображающий статистику и кнопки для создания и удаления альбомов.
 * @component
 */

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
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <div css={styles.headerStyle}>
        <p css={styles.titleStyle}>
          Альбомов: {albumCount}; Фотографий: {photoCount}
        </p>
        <div css={styles.mergeButtonsItem}>
          <button
            css={styles.openCreateAlbumModalButton}
            onClick={() => setIsCreateAlbumModalOpen(true)}
            disabled={loading}
          >
            Создать альбом
          </button>
          <button
            css={styles.openSettingsModalButton}
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <FaMicrochip style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      <Separator css={styles.horizontalSeparator} />
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
        isOpen={isCreateAlbumModalOpen}
        onClose={() => setIsCreateAlbumModalOpen(false)}
        createAlbum={createAlbum}
        loading={loading}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
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
    width: "100%",
    gap: "1rem",
    backgroundColor: "transparent",
  }),
  titleStyle: css({
    fontSize: "2rem",
    color: "white",
    margin: "0",
  }),
  mergeButtonsItem: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  }),
  horizontalSeparator: css({
    width: "100%",
    height: 1,
    backgroundColor: "white",
    marginTop: 10,
  }),
  createAlbumStyle: css({
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  }),
  openCreateAlbumModalButton: css({
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
  openSettingsModalButton: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
