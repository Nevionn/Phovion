/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Link from "next/link";
import CyberButton from "@/app/shared/buttons/CyberButton";
import { AlbumForViewPhotos } from "@/app/types/albumTypes";
import { useState } from "react";
import DownloadAlbumModal from "./modals/DownloadAlbumModal";

type HeaderItemsProps = {
  album: AlbumForViewPhotos | null;
  onEditClick: () => void;
  onDangerClick: () => void;
  deleteAlbum: () => void;
  clearAlbum: () => void;
  onDownloadClick: () => void;
  showDanger: boolean;
  photoCount: number;
  isFsaSupported: boolean;
};

/**
 * Компонент, хедера, отображающий навигацию текущего альбома: альбомы > album[название], и предоставляющий набор кнопок и функций для редактирования, удаления и скачивания
 * @component
 * @returns {JSX.Element}
 */

function HeaderItems({
  album,
  onEditClick,
  onDangerClick,
  onDownloadClick,
  deleteAlbum,
  clearAlbum,
  showDanger,
  photoCount,
  isFsaSupported,
}: HeaderItemsProps) {
  const [visibleDownloadAlbumModal, setVisibleDownloadAlbumModal] =
    useState(false);

  const handleOpenDownloadModal = () => {
    setVisibleDownloadAlbumModal(true);
  };

  return (
    <div css={style.navigationItem}>
      <div>
        <p css={style.title}>
          <Link href="/" css={style.link}>
            альбомы
          </Link>
          <span>&nbsp;&gt;&nbsp;</span>
          <span css={style.albumNameNavItem}>
            {album?.name}
            <span css={style.photoCount}>&nbsp;{album?.photoCount}</span>
          </span>
        </p>
      </div>
      <div css={style.gridButtons}>
        <div>
          <CyberButton label="Редактировать" hue={200} onClick={onEditClick} />
        </div>
        <div css={{ position: "relative" }}>
          <CyberButton label="Опасная зона" hue={0} onClick={onDangerClick} />
          {showDanger && (
            <div css={style.dangerZone}>
              <button css={style.deleteButton} onClick={deleteAlbum}>
                Удалить альбом
              </button>
              <button css={style.deleteButton} onClick={clearAlbum}>
                Очистить альбом
              </button>
            </div>
          )}
        </div>
        <div>
          <CyberButton
            label="Скачать альбом"
            hue={270}
            onClick={handleOpenDownloadModal}
          />
        </div>
      </div>
      {visibleDownloadAlbumModal && (
        <DownloadAlbumModal
          onAccept={() => {
            onDownloadClick();
            setVisibleDownloadAlbumModal(false);
          }}
          onCancel={() => {
            setVisibleDownloadAlbumModal(false);
          }}
          album={album?.name}
          photoCount={photoCount}
          isFsaSupported={isFsaSupported}
        />
      )}
    </div>
  );
}

export default HeaderItems;

const style = {
  navigationItem: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",

    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  }),
  title: css({
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "2px",
    margin: 0,
    wordBreak: "break-word",

    "& > span:first-of-type": {
      color: "white",
    },
    "& > span:last-of-type": {
      color: "#00ffea",
    },

    "@media (max-width: 768px)": {
      fontSize: "22px",
    },
  }),
  albumNameNavItem: css({
    display: "inline-block",
    maxWidth: "260px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    verticalAlign: "bottom",

    "@media (max-width: 768px)": {
      maxWidth: "100%",
      whiteSpace: "normal",
    },
  }),
  photoCount: css({
    color: "#99D6D1",
    fontWeight: "lighter",
    fontSize: 22,

    "@media (max-width: 768px)": {
      fontSize: 18,
    },
  }),
  link: css({
    color: "white",
    textDecoration: "none",
    transition: "all 0.3s",
    "&:hover": {
      color: "#00ffea",
      textShadow: "0 0 10px rgba(0, 255, 234, 0.8)",
    },
  }),
  gridButtons: css({
    display: "flex",
    flexDirection: "row",
    gap: "3.5rem",

    "@media (max-width: 925px)": {
      display: "none",
    },

    "@media (max-width: 768px)": {
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      alignItems: "stretch",
    },
  }),
  dangerZone: css({
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 10,
    padding: 8,
    backgroundColor: "rgba(212, 36, 65, 0.5)",
    border: "dashed #E8374D",
    borderRadius: 8,
    zIndex: 10,
  }),
  deleteButton: css({
    color: "white",
    backgroundColor: "#2385B7",
    border: "thick doublergb(255, 255, 255)",
    width: "100%",
    cursor: "pointer",
    marginBottom: "0.5rem",

    "&:last-child": {
      marginBottom: 0,
    },

    "&:hover": {
      backgroundColor: "#E14B64",
    },
  }),
};
