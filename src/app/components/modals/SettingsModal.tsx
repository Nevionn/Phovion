/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState, useEffect } from "react";
import { FaPalette } from "react-icons/fa6";
import { GiTechnoHeart } from "react-icons/gi";
import { TbAlertOctagonFilled } from "react-icons/tb";
import { AiFillCloseSquare } from "react-icons/ai";
import { PiMemoryFill } from "react-icons/pi";
import { PiTreeStructureBold } from "react-icons/pi";
import { FaKeyboard } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { FaGitlab } from "react-icons/fa6";
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
 * Модальное окно настроек с таб-режимом для разделов: Оформление, Системная информация, Поведение, Опасная зона, Горячие клавиши.
 * @component
 * @returns {JSX.Element} Рендер модального окна с настройками в таб-режиме.
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
  const [imageFitMode, setImageFitMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("imageFitMode") || "contain";
    }
    return "contain";
  });
  const [activeTab, setActiveTab] = useState("Оформление");

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

  const handleImageFitChange = (mode: string) => {
    setImageFitMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("imageFitMode", mode);
    }
  };

  if (!isOpen) return null;

  return (
    <div css={styles.modalOverlay} onClick={onClose}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 css={styles.modalTitle}>Настройки</h2>

        <div css={styles.tabContainer}>
          {/* Левая часть: Список табов */}
          <div css={styles.tabSidebar}>
            {[
              { name: "Оформление", icon: <FaPalette /> },
              { name: "Системная информация", icon: <GiTechnoHeart /> },
              { name: "Поведение", icon: <PiTreeStructureBold /> },
              { name: "Горячие клавиши", icon: <FaKeyboard /> },
              { name: "О программе", icon: <BsInfoSquare /> },
              { name: "Опасная зона", icon: <TbAlertOctagonFilled /> },
            ].map((tab) => (
              <button
                key={tab.name}
                css={css(
                  styles.tabButton,
                  activeTab === tab.name && styles.activeTabButton
                )}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon} &nbsp; <span css={styles.tabText}>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Правая часть: Контент таба */}
          <div css={styles.tabContent}>
            {activeTab === "Оформление" && (
              <div css={styles.tabSection}>
                <h3 css={styles.sectionTitle}>Оформление</h3>
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
              </div>
            )}
            {activeTab === "Системная информация" && (
              <div css={styles.tabSection}>
                <h3 css={styles.sectionTitle}>Системная информация</h3>
                <div css={styles.settingsContainer}>
                  <p css={styles.infoItem}>
                    <PiMemoryFill /> Вес папки uploads (кеш):&nbsp;&nbsp;
                    {uploadFolderSize ? uploadFolderSize : "подсчёт.."}
                  </p>
                </div>
              </div>
            )}
            {activeTab === "Поведение" && (
              <div css={styles.tabSection}>
                <h3 css={styles.sectionTitle}>Поведение</h3>
                <div css={styles.settingsContainer}>
                  <div css={styles.behaviorRow}>
                    <p css={styles.infoItem}>Режим отображения изображения:</p>
                    <div css={styles.radioCardContainer}>
                      <label css={styles.radioCard}>
                        <input
                          type="radio"
                          value="contain"
                          checked={imageFitMode === "contain"}
                          onChange={() => handleImageFitChange("contain")}
                          css={styles.radioInput}
                        />
                        <span css={styles.radioLabel}>Contain</span>
                      </label>
                      <label css={styles.radioCard}>
                        <input
                          type="radio"
                          value="fill"
                          checked={imageFitMode === "fill"}
                          onChange={() => handleImageFitChange("fill")}
                          css={styles.radioInput}
                        />
                        <span css={styles.radioLabel}>Fill</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Горячие клавиши" && (
              <div css={styles.tabSection}>
                <h3 css={styles.sectionTitle}>Горячие клавиши</h3>
                <div css={styles.settingsContainer}>
                  <p css={styles.infoItem}>
                    Используйте следующие комбинации для управления:
                  </p>
                  <div css={styles.keyShortcutsContainer}>
                    <div css={styles.keyShortcut}>
                      <span css={styles.keyButton}>←</span>
                      <span css={styles.keyDescription}>
                        Переключение на предыдущую фотографию
                      </span>
                    </div>
                    <div css={styles.keyShortcut}>
                      <span css={styles.keyButton}>→</span>
                      <span css={styles.keyDescription}>
                        Переключение на следующую фотографию
                      </span>
                    </div>
                    <div css={styles.keyShortcut}>
                      <span css={styles.keyButton}>Esc</span>
                      <span css={styles.keyDescription}>Закрыть окно</span>
                    </div>
                    <div css={styles.keyShortcut}>
                      <span css={styles.keyButton}>Del</span>
                      <span css={styles.keyDescription}>Удалить фото</span>
                    </div>
                    <div css={styles.keyShortcut}>
                      <span css={styles.keyButton}>I</span>
                      <span css={styles.keyDescription}>Развернуть фото</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "О программе" && (
              <div css={styles.tabSection}>
                <h3 css={styles.sectionTitle}>О программе</h3>
                <h1 css={styles.lableText}>
                  <span css={styles.metallicText}>Phovion</span>
                </h1>
                <div css={styles.settingsContainer}>
                  <p css={styles.infoItem}>
                    Локальное веб-приложение для создания и управления альбомами
                    с фотографиями. Работает прямо в браузере, не требуя
                    серверной инфраструктуры.
                  </p>
                  <p css={styles.infoItem}>
                    Разработано Nevionn для удобного хранения и просмотра ваших
                    изображений.
                  </p>
                  <p css={styles.infoItem}>Версия: 1.0.0</p>
                  <div css={styles.contactsContainer}>
                    <p css={styles.infoItem}>
                      <FaGitlab color="orange" />
                      <a
                        href="https://gitlab.com/web4450122/phovion"
                        target="_blank"
                        rel="noopener noreferrer"
                        css={styles.link}
                      >
                        Репозиторий на GitLab
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Опасная зона" && (
              <div css={styles.tabSection}>
                <h3 css={styles.sectionTitle}>Опасная зона</h3>
                <p css={styles.infoItem}>
                  Удалить все существующие альбомы и фотографии
                </p>
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
              </div>
            )}
          </div>
        </div>

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
    maxWidth: "900px",
    color: "var(--modal-text-color, white)",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    "@media (max-width: 768px)": {
      width: "95%",
      maxWidth: "600px",
      padding: "1.5rem",
    },
    "@media (max-width: 480px)": {
      width: "100%",
      maxWidth: "100%",
      padding: "1rem",
      borderRadius: "0",
    },
  }),
  modalTitle: css({
    fontSize: "1.5rem",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "white",
    "@media (max-width: 480px)": {
      fontSize: "1.2rem",
      marginBottom: "1rem",
    },
  }),
  tabContainer: css({
    display: "flex",
    gap: "1rem",
    height: "60vh",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      height: "auto",
    },
  }),
  tabSidebar: css({
    width: "30%", // 1/3 ширины
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "1rem",
    borderRadius: "4px",
    overflowY: "auto",
    "@media (max-width: 768px)": {
      width: "100%",
      padding: "0.8rem",
    },
  }),
  tabButton: css({
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    color: "var(--modal-text-color, #ccc)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "var(--modal-text-color, #00ffea)",
    },
    "@media (max-width: 480px)": {
      padding: "0.3rem 0.8rem",
      fontSize: "0.9rem",
    },
  }),
  activeTabButton: css({
    backgroundColor: "var(--settings-modal-activeTab-button)",
    color: "var(--modal-text-color, #00ffea)",
    fontWeight: "bold",
  }),
  tabText: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: 17,
    letterSpacing: customFonts.fonts.size.ls,
    marginLeft: "0.5rem",
    "@media (max-width: 480px)": {
      fontSize: "14px",
    },
  }),
  tabContent: css({
    width: "70%", // 2/3 ширины
    padding: "1rem",
    overflowY: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    "@media (max-width: 768px)": {
      width: "100%",
      padding: "0.8rem",
    },
  }),
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
  sectionTitleText: css({
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    margin: 0,
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
  settingsContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (max-width: 480px)": {
      gap: "0.8rem",
    },
  }),
  behaviorRow: css({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    "@media (max-width: 480px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
  }),
  lableText: css({
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    fontSize: 36,
  }),
  metallicText: css({
    background:
      "linear-gradient(45deg, #1da8eeff, #4a657a, #d1d9ddff, #4a657a, #0f9af1ff)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    animation: "shine 5s ease-in-out infinite",
    "@media (max-width: 480px)": {
      fontSize: 20,
    },

    "@keyframes shine": {
      "0%": { backgroundPosition: "0% 0%" },
      "25%": { backgroundPosition: "100% 0%" },
      "50%": { backgroundPosition: "100% 100%" },
      "75%": { backgroundPosition: "0% 100%" },
      "100%": { backgroundPosition: "0% 0%" },
    },
  }),

  contactsContainer: css({
    marginTop: "1rem",
    "@media (max-width: 480px)": {
      marginTop: "0.5rem",
    },
  }),
  link: css({
    color: "#00ffea",
    textDecoration: "none",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    "&:hover": {
      textDecoration: "underline",
      color: "#00ccaa",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
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
  themesContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: 10,
    backgroundColor: "transparent",
    "@media (max-width: 480px)": {
      gap: "4px",
      marginTop: 5,
    },
  }),
  checkboxLabel: css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "var(--modal-text-color, white)",
    fontSize: "1rem",
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
      gap: "0.3rem",
    },
  }),
  closeIcon: css({
    fontSize: 30,
    color: "var(--modal-text-color, #00ffea)",
    "@media (max-width: 480px)": {
      fontSize: 25,
    },
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
    "@media (max-width: 480px)": {
      top: "0.5rem",
      right: "0.5rem",
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
  radioCardContainer: css({
    display: "flex",
    gap: "1rem",
    marginLeft: "1rem",
    "@media (max-width: 480px)": {
      flexDirection: "column",
      gap: "0.5rem",
      marginLeft: "0",
    },
  }),
  radioCard: css({
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    backgroundColor: "#2a2a3e",
    border: "2px solid transparent",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: "#3a3a4e",
    },
    "& input:checked + span": {
      fontWeight: "bold",
      color: "#00ffea",
    },
    "& input:focus + span": {
      outline: "none",
      borderColor: "#00ffea",
    },
    "@media (max-width: 480px)": {
      padding: "0.3rem 0.8rem",
    },
  }),
  radioInput: css({
    display: "none",
  }),
  radioLabel: css({
    fontFamily: customFonts.fonts.ru,
    color: "#fff",
    margin: 0,
    userSelect: "none",
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
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
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3)",
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
};
