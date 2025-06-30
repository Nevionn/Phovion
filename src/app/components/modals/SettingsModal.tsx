/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState, useEffect } from "react";
import { FaPalette } from "react-icons/fa6";
import { GiTechnoHeart } from "react-icons/gi";
import { TbAlertOctagonFilled } from "react-icons/tb";
import { AiFillCloseSquare } from "react-icons/ai";
import { PiMemoryFill } from "react-icons/pi";
import Separator from "@/app/shared/separator/Separator";
import { themeColors } from "@/app/shared/theme/themePalette";

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
  const [settings, setSettings] = useState<{
    theme: "SpaceBlue" | "RoseMoon" | "solarized" | "dracula" | "nord";
  }>({
    theme: "SpaceBlue", // Начальная тема, должна быть одной из допустимых
  });

  // Симуляция веса папки uploads (заменить на реальную логику)
  const [uploadFolderSize, setUploadFolderSize] = useState("1.2 GB");

  // Применение темы к глобальным стилям
  useEffect(() => {
    const currentTheme = themeColors[settings.theme];
    document.documentElement.style.setProperty(
      "--theme-background",
      currentTheme.mainGradient
    );
    document.documentElement.style.setProperty(
      "--modal-background",
      currentTheme.modalBackground
    );
    document.documentElement.style.setProperty(
      "--modal-text-color",
      currentTheme.modalTextColor
    );
  }, [settings.theme]);

  if (!isOpen) return null;

  return (
    <div css={styles.modalOverlay} onClick={onClose}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 css={styles.modalTitle}>Настройки</h2>

        {/* Секция 1: Оформление */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <FaPalette />   Оформление
          </h3>
          <div css={styles.settingsContainer}>
            <div css={styles.themesContainer}>
              <div
                css={css`
                  ${styles.themeBox}
                  background: ${themeColors["SpaceBlue"].settingBoxGradient};
                  border: ${settings.theme === "SpaceBlue"
                    ? `2px solid ${themeColors["SpaceBlue"].settingBoxBorder}`
                    : "1px solid transparent"};
                `}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "SpaceBlue" }))
                }
              >
                Space Blue
              </div>
              <div
                css={css`
                  ${styles.themeBox}
                  background: ${themeColors["RoseMoon"].settingBoxGradient};
                  border: ${settings.theme === "RoseMoon"
                    ? `2px solid ${themeColors["RoseMoon"].settingBoxBorder}`
                    : "1px solid transparent"};
                `}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "RoseMoon" }))
                }
              >
                Rose Moon
              </div>
              <div
                css={css`
                  ${styles.themeBox}
                  background: ${themeColors["solarized"].settingBoxGradient};
                  border: ${settings.theme === "solarized"
                    ? `2px solid ${themeColors["solarized"].settingBoxBorder}`
                    : "1px solid transparent"};
                `}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "solarized" }))
                }
              >
                Solarized
              </div>
              <div
                css={css`
                  ${styles.themeBox}
                  background: ${themeColors["dracula"].settingBoxGradient};
                  border: ${settings.theme === "dracula"
                    ? `2px solid ${themeColors["dracula"].settingBoxBorder}`
                    : "1px solid transparent"};
                `}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: "dracula" }))
                }
              >
                Dracula
              </div>
              <div
                css={css`
                  ${styles.themeBox}
                  background: ${themeColors["nord"].settingBoxGradient};
                  border: ${settings.theme === "nord"
                    ? `2px solid ${themeColors["nord"].settingBoxBorder}`
                    : "1px solid transparent"};
                `}
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
            <GiTechnoHeart />   Системная информация
          </h3>
          <div css={styles.settingsContainer}>
            <p css={styles.infoItem}>
              <PiMemoryFill /> Вес папки uploads (кеш): {uploadFolderSize}
            </p>
            {/* Здесь нужно добавить логику для обновления размера */}
          </div>
        </Separator>

        {/* Секция 3: Опасная зона */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <TbAlertOctagonFilled />   Опасная зона
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
    backgroundColor: "var(--modal-background, #1a1a2e)",
    padding: "2rem",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    color: "var(--modal-text-color, white)",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  }),
  modalTitle: css({
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "white",
  }),
  section: css({
    marginBottom: "1.5rem",
    borderBottom: "1px solid var(--modal-text-color, #333)",
    paddingBottom: "1rem",
  }),
  sectionTitle: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "var(--modal-text-color, #00ffea)",
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
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    fontSize: "1rem",
    color: "#ccc",
  }),
  themesContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: 10,
    backgroundColor: "transparent",
  }),
  themeBox: css({
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    color: "var(--modal-text-color, white)",
    "&:hover": {
      backgroundColor: "#3e3e4a",
    },
  }),
  selectStyle: css({
    marginLeft: "0.5rem",
    padding: "0.25rem",
    borderRadius: "4px",
    border: "1px solid var(--modal-text-color, #ccc)",
    backgroundColor: "#2e2e3a",
    color: "var(--modal-text-color, white)",
  }),
  closeIcon: css({
    fontSize: 30,
    color: "var(--modal-text-color, #00ffea)",
  }),
  closeButton: css({
    display: "flex",
    position: "absolute",
    top: "1rem",
    right: "0.8rem",
    backgroundColor: "transparent",
    color: "var(--modal-text-color, #00ffea)",
    border: "none",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      color: "var(--modal-text-color)",
      filter: "brightness(1.2)",
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
    color: "white",
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
