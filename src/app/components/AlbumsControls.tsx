/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import CreateAlbumModal from "./modals/CreateAlbumModal";
import { AlbumNaming } from "../types/albumTypes";
import { FaMicrochip } from "react-icons/fa6";
import Separator from "../shared/separator/Separator";
import SettingsModal from "./modals/SettingsModal";
import { customFonts } from "../shared/theme/customFonts";

interface AlbumControlsProps {
  loading: boolean;
  albumCount: number;
  photoCount: number;
  createAlbum: (data: AlbumNaming) => Promise<void>;
  deleteAllAlbums: () => Promise<void>;
}

/**
 * Компонент управления альбомами, отображающий статистику контента (счётчики), и кнопки для создания альбома и открытия настроек.
 * @component
 */

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
            <p css={styles.textButon}>Создать альбом</p>
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

      <CreateAlbumModal
        isOpen={isCreateAlbumModalOpen}
        onClose={() => setIsCreateAlbumModalOpen(false)}
        createAlbum={createAlbum}
        loading={loading}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        deleteAllAlbums={deleteAllAlbums}
        albumCount={albumCount}
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
    fontFamily: customFonts.fonts.ru,
    fontSize: "2rem",
    color: "white",
    margin: "0",
  }),
  textButon: css({
    fontFamily: customFonts.fonts.ru,
    margin: 0,
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
  openCreateAlbumModalButton: css({
    padding: "0.5rem 1rem",
    backgroundImage: "var(--create-album-button-color)",
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
    cursor: "pointer",
  }),
};
