/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { AlbumNaming } from "../types/albumTypes";
import { FaMicrochip, FaSpinner } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import Separator from "../shared/separator/Separator";
import { colorConst } from "../shared/theme/colorConstant";
import { colorIcon } from "../shared/theme/colorConstant";
import { customFonts } from "../shared/theme/customFonts";

interface AlbumControlsProps {
  loading: boolean;
  albumCount: number;
  photoCount: number;
  createAlbum: (data: AlbumNaming) => Promise<void>;
  deleteAllAlbums: () => Promise<void>;
  onOpenCreateAlbum: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

/**
 * Компонент управления альбомами, отображающий статистику контента (счётчики), и кнопки для поиска альбома, создания альбома и открытия настроек.
 * @component
 */

const AlbumsControls = ({
  loading,
  albumCount,
  photoCount,
  onOpenCreateAlbum,
  onOpenSettings,
  onOpenSearch,
}: AlbumControlsProps) => {
  return (
    <>
      <div css={styles.headerStyle}>
        <p css={styles.titleStyle}>
          Альбомов: {albumCount}; Фотографий: {photoCount}
          {loading && <FaSpinner css={styles.loadingIcon} style={{ fontSize: "1.25rem" }} />}
        </p>
        <div css={styles.mergeButtonsItem}>
          <button css={styles.openSearchAlbumModalButton} onClick={onOpenSearch}>
            <p css={styles.textButonSearch}>поиск</p>
            <IoSearch color={colorConst.albumsControls.iconColor.searchIcon} fontSize={"1.3rem"} />
          </button>
          <button css={styles.openCreateAlbumModalButton} onClick={onOpenCreateAlbum} disabled={loading}>
            <p css={styles.textButonCreate}>Создать альбом</p>
          </button>
          <button css={styles.openSettingsModalButton} onClick={onOpenSettings}>
            <FaMicrochip color={colorConst.albumsControls.iconColor.settingsIcon} />
          </button>
        </div>
      </div>
      <Separator css={styles.horizontalSeparator} />
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
    letterSpacing: customFonts.fonts.size.ls,
    fontSize: "2rem",
    color: "white",
    margin: 0,
  }),
  textButonSearch: css({
    fontFamily: customFonts.fonts.ru,
    textAlign: "center",
    color: "#e6e9e9ff",
    fontSize: "1rem",
    margin: 0,
    paddingRight: 12,
  }),
  textButonCreate: css({
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
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
  openSearchAlbumModalButton: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: "33px",
    width: "84px",
    backgroundColor: "transparent",
    border: "1px solid grey",
    borderRadius: 6,
    "&:hover": {
      filter: "brightness(1.15)",
    },
  }),
  openSettingsModalButton: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 23,
  }),
  loadingIcon: css({
    marginLeft: 10,
    animation: "spin 1s linear infinite",
    color: colorIcon.bright,
    "@keyframes spin": {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
    },
  }),
};
