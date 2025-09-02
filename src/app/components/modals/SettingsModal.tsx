/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState, useEffect } from "react";
import { FaKeyboard, FaPalette } from "react-icons/fa6";
import { GiTechnoHeart } from "react-icons/gi";
import { TbAlertOctagonFilled } from "react-icons/tb";
import { TabContent } from "./settingsModalComponents/TabContent";
import { Theme } from "@/app/shared/theme/themePalette";
import { customFonts } from "@/app/shared/theme/customFonts";
import { PiTreeStructureBold } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";

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
const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, deleteAllAlbums, albumCount, loading = false }) => {
  const [uploadFolderSize, setUploadFolderSize] = useState("");
  const [imageFitMode, setImageFitMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("imageFitMode") || "contain";
    }
    return "contain";
  });
  const [activeTab, setActiveTab] = useState("Оформление");

  const themes: Theme[] = ["SpaceBlue", "RoseMoon", "Solarized", "OnyxStorm", "Nord"];

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
                css={css(styles.tabButton, activeTab === tab.name && styles.activeTabButton)}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon} &nbsp; <span css={styles.tabText}>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Правая часть: Контент таба */}
          <TabContent
            activeTab={activeTab}
            onClose={onClose}
            deleteAllAlbums={deleteAllAlbums}
            albumCount={albumCount}
            loading={loading}
            uploadFolderSize={uploadFolderSize}
            setUploadFolderSize={setUploadFolderSize}
            imageFitMode={imageFitMode}
            setImageFitMode={setImageFitMode}
            themes={themes}
          />
        </div>

        <button css={styles.closeButton} onClick={onClose} disabled={loading}>
          <FaTimes css={styles.closeIcon} />
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
};
