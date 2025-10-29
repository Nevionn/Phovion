/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useEffect } from "react";
import { PiMemoryFill } from "react-icons/pi";
import { FaGitlab } from "react-icons/fa6";
import { VscGithubInverted } from "react-icons/vsc";
import { ThemeBox } from "./ThemeBox";
import { DecryptedText } from "@/app/shared/DecryptedText";
import { useThemeManager } from "@/app/shared/theme/useThemeManager";
import { Theme } from "@/app/shared/theme/themePalette";
import { customFonts } from "@/app/shared/theme/customFonts";
import PhovionImage from "../../../../../preview/Phovion.webp";
import Separator from "@/app/shared/separator/Separator";
import { colorConst } from "@/app/shared/theme/colorConstant";

interface TabContentProps {
  activeTab: string;
  onClose: () => void;
  deleteAllAlbums: () => Promise<void>;
  albumCount: number;
  loading?: boolean;
  uploadFolderSize: string;
  setUploadFolderSize: (size: string) => void;
  imageFitMode: string;
  setImageFitMode: (mode: string) => void;
  widthDescription: string;
  setWidthDescription: (mode: string) => void;
  themes: Theme[];
}

export const TabContent: FC<TabContentProps> = ({
  activeTab,
  onClose,
  deleteAllAlbums,
  albumCount,
  loading,
  uploadFolderSize,
  setUploadFolderSize,
  imageFitMode,
  setImageFitMode,
  widthDescription,
  setWidthDescription,
  themes,
}) => {
  const {
    theme,
    setTheme,
    enablePerformanceMode,
    enableAlbumBorder,
    setEnablePerformanceMode,
    setEnableAlbumBorder,
    enablePhotoViewerBorder,
    setEnablePhotoViewerBorder,
    enabledPhotoViewerShadow,
    setEnabledPhotoViewerShadow,
    enabledPhotoEditorShadow,
    setEnabledPhotoEditorShadow,
  } = useThemeManager();

  useEffect(() => {
    if (activeTab === "Системная информация") {
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
  }, [activeTab, setUploadFolderSize]);

  const handleImageFitChange = (mode: string) => {
    setImageFitMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("imageFitMode", mode);
    }
  };

  const handleDescriptionWidth = (mode: string) => {
    setWidthDescription(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("descriptionWidth", mode);
    }
  };

  return (
    <div css={styles.tabContent}>
      {activeTab === "Оформление" && (
        <div css={styles.tabSection}>
          <h3 css={styles.sectionTitle}>Оформление</h3>
          <div css={styles.settingsContainer}>
            <div css={styles.themesContainer}>
              {themes.map((themeName) => (
                <ThemeBox key={themeName} themeName={themeName} currentTheme={theme} onSelect={setTheme} />
              ))}
            </div>
            <p css={styles.subSectionTitle}>Панель альбомов</p>
            <label css={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enableAlbumBorder}
                onChange={(e) => setEnableAlbumBorder(e.target.checked)}
              />
              <span css={styles.sectionTitleText}>Включить обводку для панели альбомов</span>
            </label>
            <p css={styles.subSectionTitle}>Фото пикер</p>
            <label css={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enablePhotoViewerBorder}
                onChange={(e) => setEnablePhotoViewerBorder(e.target.checked)}
              />
              <span css={styles.sectionTitleText}>Включить обводку для панели фото пикера</span>
            </label>
            <p css={styles.subSectionTitle}>Фото редактор</p>
            <label css={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enabledPhotoViewerShadow}
                onChange={(e) => setEnabledPhotoViewerShadow(e.target.checked)}
              />
              <span css={styles.sectionTitleText}>Включить тень для фото пикера</span>
            </label>

            <label css={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enabledPhotoEditorShadow}
                onChange={(e) => setEnabledPhotoEditorShadow(e.target.checked)}
              />
              <span css={styles.sectionTitleText}>Включить тень для фото редактора</span>
            </label>

            <Separator css={styles.horizontalSeparator} />

            <p css={styles.subSectionTitle}>Производительность</p>
            <label css={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enablePerformanceMode}
                onChange={(e) => {
                  setEnablePerformanceMode(e.target.checked);
                  if (e.target.checked) {
                    setEnablePhotoViewerBorder(false);
                    setEnableAlbumBorder(false);
                    setEnabledPhotoViewerShadow(false);
                    setEnabledPhotoEditorShadow(false);
                  }
                }}
              />
              <span css={styles.sectionTitleText}>
                Включить режим производительности
                {enablePerformanceMode && <span css={styles.priorityText}> (приоритет)</span>}
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
              <PiMemoryFill /> Вес папки uploads (кеш):
              <DecryptedText text={uploadFolderSize ? uploadFolderSize : "подсчёт.."} speed={30} />
            </p>
          </div>
        </div>
      )}
      {activeTab === "Поведение" && (
        <div css={styles.tabSection}>
          <h3 css={styles.sectionTitle}>Поведение</h3>
          <div css={styles.settingsContainerBehavior}>
            {/* Блок 1 */}
            <div css={styles.optionBlock}>
              <div css={styles.optionHeader}>
                <p css={styles.optionTitle}>Режим отображения оригинального изображения</p>
                <div css={styles.optionButtons}>
                  <label css={styles.optionButton}>
                    <input
                      type="radio"
                      value="contain"
                      checked={imageFitMode === "contain"}
                      onChange={() => handleImageFitChange("contain")}
                      css={styles.radioInput}
                    />
                    <span>Contain</span>
                  </label>
                  <label css={styles.optionButton}>
                    <input
                      type="radio"
                      value="fill"
                      checked={imageFitMode === "fill"}
                      onChange={() => handleImageFitChange("fill")}
                      css={styles.radioInput}
                    />
                    <span>Fill</span>
                  </label>
                </div>
              </div>
            </div>
            {/* Блок 2 */}
            <div css={styles.optionBlock}>
              <div css={styles.optionHeader}>
                <p css={styles.optionTitle}>Ширина блока описания альбома</p>
                <div css={styles.optionButtons}>
                  <label css={styles.optionButton}>
                    <input
                      type="radio"
                      value="100%"
                      checked={widthDescription === "100%"}
                      onChange={() => handleDescriptionWidth("100%")}
                      css={styles.radioInput}
                    />
                    <span>
                      <span css={styles.numberText}>100</span>
                      <span css={styles.percentText}>%</span>
                    </span>
                  </label>
                  <label css={styles.optionButton}>
                    <input
                      type="radio"
                      value="40%"
                      checked={widthDescription === "40%"}
                      onChange={() => handleDescriptionWidth("40%")}
                      css={styles.radioInput}
                    />
                    <span>
                      <span css={styles.numberText}>40</span>
                      <span css={styles.percentText}>%</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "Горячие клавиши" && (
        <div css={styles.tabSection}>
          <h3 css={styles.sectionTitle}>Горячие клавиши</h3>
          <div css={styles.settingsContainer}>
            <p css={styles.infoItem}>Используйте следующие комбинации для управления:</p>
            <div css={styles.keyShortcutsContainer}>
              <div css={styles.keyShortcut}>
                <span css={styles.keyButton}>←</span>
                <span css={styles.keyDescription}>Переключение на предыдущую фотографию</span>
              </div>
              <div css={styles.keyShortcut}>
                <span css={styles.keyButton}>→</span>
                <span css={styles.keyDescription}>Переключение на следующую фотографию</span>
              </div>
              <div css={styles.keyShortcut}>
                <span css={styles.keyButton}>Esc</span>
                <span css={styles.keyDescription}>Закрыть окно (Настройки, просмотр фотографий)</span>
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
            <img src={PhovionImage.src} alt="Phovion" css={css({ maxWidth: "100%", height: "auto" })} />
          </h1>
          <div css={[styles.settingsContainer, { gap: 0 }]}>
            <p css={styles.infoItem}>
              Локальное веб-приложение для создания и управления альбомами с фотографиями. Работает прямо в браузере, не
              требуя серверной инфраструктуры.
            </p>
            <p css={styles.infoItem}>Разработано Nevionn для удобного хранения и просмотра ваших изображений.</p>
            <p css={styles.infoItem}>Версия: 1.1.1</p>
            <div css={styles.contactsContainer}>
              <p css={styles.infoItem}>
                <VscGithubInverted />
                <a
                  href="https://github.com/Nevionn/Phovion"
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.link}
                >
                  GitHub
                </a>
              </p>
              <p css={styles.infoItem}>
                <FaGitlab color="orange" />
                <a
                  href="https://gitlab.com/web4450122/phovion"
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.link}
                >
                  GitLab
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      {activeTab === "Опасная зона" && (
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
      )}
    </div>
  );
};

const styles = {
  tabContent: css({
    width: "70%", // 2/3 ширины
    padding: "1rem",
    overflowY: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    msOverflowStyle: "none", // Edge не поддерживает стилизацию

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
  settingsContainerBehavior: css({
    display: "flex",
    flexDirection: "column",
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
    textAlign: "start",
    fontSize: 36,
    margin: 0,
  }),
  priorityText: css({
    color: colorConst.settingsModal.designTab.priorityText,
  }),
  metallicText: css({
    background: "linear-gradient(45deg, #1da8eeff, #4a657a, #d1d9ddff, #4a657a, #0f9af1ff)",
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
  radioInput: css({
    display: "none",
  }),
  optionBlock: css({
    display: "flex",
    flexDirection: "column",
    backgroundColor: "transparent",
    borderRadius: "6px",
    padding: "0.5rem 0",
  }),
  optionHeader: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
  }),
  optionTitle: css({
    color: "#fff",
    fontFamily: customFonts.fonts.ru,
    fontSize: "1.1rem",
    margin: 0,
  }),
  optionButtons: css({
    display: "flex",
    gap: "0.5rem",
  }),
  optionButton: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.6rem 1.5rem",
    backgroundColor: "#2a2a3e",
    borderRadius: "6px",
    color: "#ccc",
    fontFamily: customFonts.fonts.ru,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      backgroundColor: "#3a3a4e",
    },
    "& input:checked + span": {
      color: "#00ffea",
      fontWeight: "bold",
    },
  }),
  numberText: css({
    fontFamily: customFonts.fonts.ru, // основной шрифт (цифры)
    fontSize: "1rem",
    textAlign: "center",
  }),
  percentText: css({
    fontFamily: "serif",
    fontSize: "1rem",
    marginLeft: "2px",
    textAlign: "center",
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
  horizontalSeparator: css({
    width: "100%",
    height: 1,
    backgroundColor: "white",
    marginTop: 10,
  }),
};
