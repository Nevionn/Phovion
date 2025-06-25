/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

const SettingsModal = ({
  isOpen,
  onClose,
  loading = false,
}: SettingsModalProps) => {
  const [settings, setSettings] = useState({
    autoSync: false,
    theme: "dark",
  });

  if (!isOpen) return null;

  const handleToggleAutoSync = () => {
    setSettings((prev) => ({ ...prev, autoSync: !prev.autoSync }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({ ...prev, theme: e.target.value }));
  };

  return (
    <div css={styles.modalOverlay} onClick={onClose}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 css={styles.modalTitle}>Настройки</h2>
        <div css={styles.settingsContainer}>
          <label css={styles.settingItem}>
            <input
              type="checkbox"
              checked={settings.autoSync}
              onChange={handleToggleAutoSync}
              disabled={loading}
            />
            Автосинхронизация
          </label>
          <label css={styles.settingItem}>
            Тема:
            <select
              value={settings.theme}
              onChange={handleThemeChange}
              disabled={loading}
              css={styles.selectStyle}
            >
              <option value="dark">Тёмная</option>
              <option value="light">Светлая</option>
            </select>
          </label>
        </div>
        <button css={styles.closeButton} onClick={onClose} disabled={loading}>
          Закрыть
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
    maxWidth: "400px",
    color: "white",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  }),
  modalTitle: css({
    fontSize: "1.5rem",
    marginBottom: "1rem",
    textAlign: "center",
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
  selectStyle: css({
    marginLeft: "0.5rem",
    padding: "0.25rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#2e2e3a",
    color: "white",
  }),
  closeButton: css({
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundImage: "linear-gradient(211deg, #846392 0%, #604385 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
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
