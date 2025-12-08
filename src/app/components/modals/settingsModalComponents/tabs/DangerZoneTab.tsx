/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { customFonts } from "@/app/shared/theme/customFonts";
import { tabsStyles } from "@/app/shared/settingsTabStyles/common";

interface DangerZoneTabProps {
  onClose: () => void;
  deleteAllAlbums: () => Promise<void>;
  albumCount: number;
  loading?: boolean;
}

export default function DangerZoneTab({ onClose, deleteAllAlbums, albumCount, loading }: DangerZoneTabProps) {
  return (
    <div css={tabsStyles.tabSection}>
      <h3 css={tabsStyles.sectionTitle}>Опасная зона</h3>
      <p css={tabsStyles.infoItem}>Удалить все существующие альбомы и фотографии</p>
      <div css={tabsStyles.settingsContainer}>
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
