/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { customFonts } from "@/app/shared/theme/customFonts";

interface DangerZoneTabProps {
  onClose: () => void;
  deleteAllAlbums: () => Promise<void>;
  albumCount: number;
  loading?: boolean;
}

export default function DangerZoneTab({ onClose, deleteAllAlbums, albumCount, loading }: DangerZoneTabProps) {
  return (
    <div css={styles.tabSection}>
      <h3 css={styles.sectionTitle}>Опасная зона</h3>
      <p css={styles.infoItem}>Удалить все существующие альбомы и фотографии</p>
      <div css={styles.settingsContainer}>
        <button
          css={styles.deleteButtonStyle}
          onClick={() => {
            deleteAllAlbums(), onClose();
          }}
          disabled={loading || albumCount === 0}
        >
          <p css={styles.buttonText}>{loading ? "Удаление..." : "Удалить все"}</p>
        </button>
      </div>
    </div>
  );
}

const styles = {
  tabSection: css({
    marginBottom: "1.5rem",
    "@media (max-width: 480px)": {
      marginBottom: "1rem",
    },
  }),
  settingsContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (max-width: 480px)": {
      gap: "0.8rem",
    },
  }),
  sectionTitle: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "var(--modal-text-color, #00ffea)",
    marginBottom: "0.5rem",
    "@media (max-width: 480px)": {
      fontSize: "1rem",
    },
  }),
  infoItem: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    fontSize: "1rem",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    color: "#ccc",
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
      gap: 5,
    },
  }),
  buttonText: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: customFonts.fonts.size.md,
    color: "#212121ff",
    margin: 0,
    "@media (max-width: 480px)": {
      fontSize: "14px",
    },
  }),
  deleteButtonStyle: css({
    height: "35px",
    width: "30%",
    marginTop: 10,
    backgroundColor: "#ED7095",
    color: "black",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "filter 0.2s",
    "&:hover": {
      filter: "brightness(1.15)",
    },
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    "@media (max-width: 768px)": {
      width: "40%",
    },
    "@media (max-width: 480px)": {
      width: "50%",
      fontSize: "14px",
    },
  }),
};
