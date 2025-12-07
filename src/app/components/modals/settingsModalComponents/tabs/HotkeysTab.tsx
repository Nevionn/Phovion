/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Separator from "@/app/shared/separator/Separator";
import { customFonts } from "@/app/shared/theme/customFonts";

export default function HotkeysTab() {
  return (
    <div css={styles.tabSection}>
      <h3 css={styles.sectionTitle}>Горячие клавиши</h3>
      <div css={styles.settingsContainer}>
        <p css={styles.infoItem}>Используйте следующие комбинации для управления: (раскладка eu)</p>

        <div css={styles.keyShortcutsContainer}>
          <p css={styles.subSectionTitle}>Общее</p>
          <div css={styles.keyShortcut}>
            <span css={styles.keyButton}>Esc</span>
            <span css={styles.keyDescription}>Закрыть окно</span>
          </div>

          <Separator css={styles.verticalSeparator} />

          <p css={styles.subSectionTitle}>Просмотр изображений</p>
          <div css={styles.keyShortcut}>
            <span css={styles.keyButton}>←</span>
            <span css={styles.keyDescription}>Переключение на предыдущую фотографию</span>
          </div>
          <div css={styles.keyShortcut}>
            <span css={styles.keyButton}>→</span>
            <span css={styles.keyDescription}>Переключение на следующую фотографию</span>
          </div>
          <div css={styles.keyShortcut}>
            <span css={styles.keyButton}>Del</span>
            <span css={styles.keyDescription}>Удалить фото</span>
          </div>
          <div css={styles.keyShortcut}>
            <span css={styles.keyButton}>I</span>
            <span css={styles.keyDescription}>Открыть оригинал</span>
          </div>
          <div css={styles.keyShortcut}>
            <span css={styles.keyButton}>M</span>
            <span css={styles.keyDescription}>Перенос в другой альбом</span>
          </div>
        </div>
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
  subSectionTitle: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontFamily: customFonts.fonts.ru,
    fontSize: "1.2rem",
    color: "var(--modal-text-color, #00ffea)",
    margin: "0",
    "@media (max-width: 480px)": {
      fontSize: "1rem",
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
  keyShortcutsContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    "@media (max-width: 480px)": {
      gap: "0.3rem",
    },
  }),
  keyShortcut: css({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    "@media (max-width: 480px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
  }),
  keyButton: css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.4rem 1rem",
    backgroundColor: "#2a2a3e",
    border: "2px solid #444",
    borderRadius: "4px",
    fontFamily: customFonts.fonts.ru,
    fontSize: "1rem",
    color: "#fff",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3)",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#3a3a4e",
    },
    "@media (max-width: 480px)": {
      padding: "0.3rem 0.8rem",
      fontSize: "0.9rem",
    },
  }),
  keyDescription: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: "1rem",
    color: "#ccc",
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
    },
  }),
  verticalSeparator: css({
    height: 15,
  }),
};
