/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Link from "next/link";
import CyberButton from "@/app/shared/buttons/CyberButton";
import { AlbumForViewPhotos } from "@/app/types/albumTypes";

type HeaderProps = {
  album: AlbumForViewPhotos | null;
  onEditClick: () => void;
  onDangerClick: () => void;
  deleteAlbum: () => void;
  onDownloadClick: () => void;
  showDanger: boolean;
};

function Header({
  album,
  onEditClick,
  onDangerClick,
  onDownloadClick,
  deleteAlbum,
  showDanger,
}: HeaderProps) {
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
            </div>
          )}
        </div>
        <div>
          <CyberButton
            label="Скачать альбом"
            hue={270}
            onClick={onDownloadClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;

const style = {
  navigationItem: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  title: css({
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "2px",
    margin: 0,
    "& > span:first-of-type": {
      color: "white",
    },
    "& > span:last-of-type": {
      color: "#00ffea",
    },
  }),
  albumNameNavItem: css({
    display: "inline-block",
    maxWidth: "260px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    verticalAlign: "bottom",
  }),
  photoCount: css({
    color: "#99D6D1",
    fontWeight: "lighter",
    fontSize: 22,
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
    "&:hover": {
      backgroundColor: "#E14B64",
    },
  }),
};
