/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState } from "react";
import { FaPalette } from "react-icons/fa6";
import { GiTechnoHeart } from "react-icons/gi";
import { TbAlertOctagonFilled } from "react-icons/tb";
import { AiFillCloseSquare } from "react-icons/ai";
import Separator from "@/app/shared/separator/Separator";

/**
 * Модальное окно настроек с разделами для оформления, системной информации и опасной зоны.
 * @component
 * @returns {JSX.Element} Рендер модального окна с настройками.
 */

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteAllAlbums: () => Promise<void>;
  albumCount: number;
  loading?: boolean;
}

const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  deleteAllAlbums,
  albumCount,
  loading = false,
}) => {
  const [settings, setSettings] = useState({
    theme: "dark",
  });

  // Симуляция веса папки uploads (заменить на реальную логику)
  const [uploadFolderSize, setUploadFolderSize] = useState("1.2 GB");

  if (!isOpen) return null;

  return (
    <div css={styles.modalOverlay} onClick={onClose}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 css={styles.modalTitle}>Настройки</h2>

        {/* Секция 1: Оформление */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <FaPalette /> &nbsp; Оформление
          </h3>
          <div css={styles.settingsContainer}>
            <div css={styles.themesContainer}>
              <div
                css={styles.themeBox}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "tokyoNight" }))
                }
              >
                Tokyo Night
              </div>
              <div
                css={styles.themeBox}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "midnight" }))
                }
              >
                Midnight
              </div>
              <div
                css={styles.themeBox}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "solarized" }))
                }
              >
                Solarized
              </div>
              <div
                css={styles.themeBox}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "dracula" }))
                }
              >
                Dracula
              </div>
              <div
                css={styles.themeBox}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "nord" }))
                }
              >
                Nord
              </div>
            </div>
          </div>
        </Separator>

        {/* Секция 2: Системная информация */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <GiTechnoHeart /> &nbsp; Системная информация
          </h3>
          <div css={styles.settingsContainer}>
            <p css={styles.infoItem}>
              Вес папки uploads (кеш): {uploadFolderSize}
            </p>
            {/* Здесь нужно добавить логику для обновления размера*/}
          </div>
        </Separator>

        {/* Секция 3: Опасная зона */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <TbAlertOctagonFilled /> &nbsp; Опасная зона
          </h3>
          <div css={styles.settingsContainer}>
            <button
              css={styles.deleteButtonStyle}
              onClick={() => deleteAllAlbums()}
              disabled={loading || albumCount === 0}
            >
              {loading ? "Удаление..." : "Удалить все"}
            </button>
          </div>
        </Separator>

        <button css={styles.closeButton} onClick={onClose} disabled={loading}>
          <AiFillCloseSquare css={styles.closeIcon} />
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;

const styles = {
  modalOverlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }),
  modalContent: css({
    backgroundColor: "#1a1a2e",
    padding: "2rem",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    color: "white",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  }),
  modalTitle: css({
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  }),
  section: css({
    marginBottom: "1.5rem",
    borderBottom: "1px solid #333",
    paddingBottom: "1rem",
  }),
  sectionTitle: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#00ffea",
    marginBottom: "0.5rem",
  }),
  settingsContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }),
  settingItem: css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  infoItem: css({
    fontSize: "1rem",
    color: "#ccc",
  }),
  themesContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    marginTop: 10,
    backgroundColor: "grey",
  }),
  themeBox: css({
    padding: "0.5rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#2e2e3a", // Плейсхолдер, заменить на реальные цвета позже
    color: "white",
    "&:hover": {
      backgroundColor: "#3e3e4a",
    },
  }),
  selectStyle: css({
    marginLeft: "0.5rem",
    padding: "0.25rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#2e2e3a",
    color: "white",
  }),
  closeIcon: css({
    fontSize: 30,
  }),
  closeButton: css({
    display: "flex",
    position: "absolute",
    top: "1rem",
    right: "0.8rem",
    backgroundColor: "transparent",
    color: "#00ffea",
    border: "none",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      color: "#02b2c7",
    },
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  }),
  deleteButtonStyle: css({
    padding: "0.5rem 1rem",
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
  }),
};
