/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { customFonts } from "@/app/shared/theme/customFonts";
import Separator from "@/app/shared/separator/Separator";
import { tabsStyles } from "@/app/shared/settingsTabStyles/common";

export default function BehaviorTab() {
  const [imageFitMode, setImageFitMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("imageFitMode") || "contain";
    }
    return "contain";
  });

  const [widthDescriptionStringBlock, setWidthDescriptionStringBlock] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("descriptionWidth") || "100%";
    }
    return "100%";
  });

  const handleImageFitChange = (mode: string) => {
    setImageFitMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("imageFitMode", mode);
    }
  };

  const handleDescriptionWidth = (mode: string) => {
    setWidthDescriptionStringBlock(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("descriptionWidth", mode);
    }
  };

  type ExtensionSettings = {
    enabled: boolean;
    showStatic: boolean;
    showAnimated: boolean;
  };

  // Состояние настроек расширений (читаем из localStorage)
  const [extensionSettings, setExtensionSettings] = useState<ExtensionSettings>(() => {
    if (typeof window === "undefined") {
      return { enabled: false, showStatic: true, showAnimated: true };
    }
    try {
      const raw = localStorage.getItem("extensionSettings");
      return raw ? (JSON.parse(raw) as ExtensionSettings) : { enabled: false, showStatic: true, showAnimated: true };
    } catch {
      return { enabled: false, showStatic: true, showAnimated: true };
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("extensionSettings", JSON.stringify(extensionSettings));
    }
  }, [extensionSettings]);

  const updateSetting = (key: keyof ExtensionSettings, value: boolean) => {
    // Если выключили внешний — сбрасываем вложенные
    if (key === "enabled" && value === false) {
      setExtensionSettings({
        enabled: false,
        showStatic: false,
        showAnimated: false,
      });
      return;
    }

    // Если включили внешний — просто включаем, внутренние не трогаем
    if (key === "enabled" && value === true) {
      setExtensionSettings((prev) => ({ ...prev, enabled: true }));
      return;
    }

    setExtensionSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div css={tabsStyles.tabSection}>
      <h3 css={tabsStyles.sectionTitle}>Поведение</h3>
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
                  checked={widthDescriptionStringBlock === "100%"}
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
                  checked={widthDescriptionStringBlock === "40%"}
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

        <Separator css={styles.horizontalSeparator} />

        {/* Блок 3 */}
        <div css={styles.extCheckBlock}>
          <p css={styles.extCheckBlockTitle}>Включить отображение расширений файла у миниатюры изображения</p>

          <label css={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={extensionSettings.enabled}
              onChange={(e) => updateSetting("enabled", e.target.checked)}
            />
            <span>Доступные форматы</span>
          </label>

          {extensionSettings.enabled && (
            <div css={styles.subOptions}>
              <label css={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={extensionSettings.showStatic}
                  onChange={(e) => updateSetting("showStatic", e.target.checked)}
                />
                <span>Показывать статические форматы (JPG, JPEG, PNG)</span>
              </label>

              <label css={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={extensionSettings.showAnimated}
                  onChange={(e) => updateSetting("showAnimated", e.target.checked)}
                />
                <span>Показывать анимированные форматы (GIF, WEBP, AVIF)</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  settingsContainerBehavior: css({
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 480px)": {
      gap: "0.8rem",
    },
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
  radioInput: css({
    display: "none",
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
  extCheckBlock: css({
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "14px 0",
  }),
  extCheckBlockTitle: css({
    color: "#fff",
    fontFamily: customFonts.fonts.ru,
    fontSize: "1.1rem",
    margin: 0,
  }),
  checkboxRow: css({
    fontFamily: customFonts.fonts.ru,
    display: "flex",
    alignItems: "center",
    gap: 8,
    "& input[type='checkbox']": {
      width: 16,
      height: 16,
      cursor: "pointer",
    },
    "& span": {
      cursor: "pointer",
      userSelect: "none",
    },
  }),
  subOptions: css({
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingLeft: 24,
    opacity: 0.9,
  }),
  horizontalSeparator: css({
    width: "100%",
    height: 1,
    backgroundColor: "#b0adadb2",
    marginTop: 10,
  }),
};
