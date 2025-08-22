/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState, useEffect } from "react";
import { FaPalette } from "react-icons/fa6";
import { GiTechnoHeart } from "react-icons/gi";
import { TbAlertOctagonFilled } from "react-icons/tb";
import { AiFillCloseSquare } from "react-icons/ai";
import { PiMemoryFill } from "react-icons/pi";
import Separator from "@/app/shared/separator/Separator";
import { ThemeBox } from "../ThemeBox";
import { useThemeManager } from "@/app/shared/theme/useThemeManager";
import { Theme } from "@/app/shared/theme/themePalette";
import { customFonts } from "@/app/shared/theme/customFonts";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteAllAlbums: () => Promise<void>;
  albumCount: number;
  loading?: boolean;
}

/**
 * Модальное окно настроек с разделами для оформления, системной информации и опасной зоны.
 * @component
 * @returns {JSX.Element} Рендер модального окна с настройками.
 */

const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  deleteAllAlbums,
  albumCount,
  loading = false,
}) => {
  const { theme, setTheme, enableAlbumBorder, setEnableAlbumBorder } =
    useThemeManager();
  const [uploadFolderSize, setUploadFolderSize] = useState("");

  const themes: Theme[] = [
    "SpaceBlue",
    "RoseMoon",
    "Solarized",
    "OnyxStorm",
    "Nord",
  ];

  useEffect(() => {
    if (isOpen) {
      fetch("/api/dirSize")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setUploadFolderSize(data.size || "Неизвестно");
        })
        .catch((error) => {
          console.error("Ошибка при загрузке размера папки:", error);
          setUploadFolderSize("Неизвестно");
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div css={styles.modalOverlay} onClick={onClose}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 css={styles.modalTitle}>Настройки</h2>

        {/* Секция 1: Оформление */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <FaPalette /> &nbsp; <p css={styles.sectionTitleText}>Оформление</p>
          </h3>
          <div css={styles.settingsContainer}>
            <div css={styles.themesContainer}>
              {themes.map((themeName) => (
                <ThemeBox
                  key={themeName}
                  themeName={themeName}
                  currentTheme={theme}
                  onSelect={setTheme}
                />
              ))}
            </div>
            <label css={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enableAlbumBorder}
                onChange={(e) => setEnableAlbumBorder(e.target.checked)}
              />
              <span css={styles.sectionTitleText}>
                Включить обводку для панели альбомов
              </span>
            </label>
          </div>
        </Separator>

        {/* Секция 2: Системная информация */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <GiTechnoHeart /> &nbsp;
            <p css={styles.sectionTitleText}>Системная информация</p>
          </h3>
          <div css={styles.settingsContainer}>
            <p css={styles.infoItem}>
              <PiMemoryFill /> Вес папки uploads (кеш):&nbsp;&nbsp;
              {uploadFolderSize ? uploadFolderSize : "подсчёт.."}
            </p>
          </div>
        </Separator>

        {/* Секция 3: Опасная зона */}
        <Separator css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <TbAlertOctagonFilled /> &nbsp;
            <p css={styles.sectionTitleText}>Опасная зона</p>
          </h3>
          <div css={styles.settingsContainer}>
            <button
              css={styles.deleteButtonStyle}
              onClick={() => deleteAllAlbums()}
              disabled={loading || albumCount === 0}
            >
              <p css={styles.buttonText}>
                {loading ? "Удаление..." : "Удалить все"}
              </p>
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
    backgroundColor: "var(--modal-background, #142b5c)",
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
    fontFamily: customFonts.fonts.ru,
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
  sectionTitleText: css({
    fontFamily: customFonts.fonts.ru,
    margin: 0,
  }),
  buttonText: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: customFonts.fonts.size.md,
    color: "#212121ff",
    margin: 0,
  }),
  settingsContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }),
  infoItem: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    fontSize: "1rem",
    fontFamily: customFonts.fonts.ru,
    color: "#ccc",
  }),
  themesContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: 10,
    backgroundColor: "transparent",
  }),
  checkboxLabel: css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "var(--modal-text-color, white)",
    fontSize: "1rem",
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
