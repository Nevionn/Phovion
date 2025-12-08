/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Separator from "@/app/shared/separator/Separator";
import { ThemeBox } from "./ThemeBox";
import { useThemeManager } from "@/app/shared/theme/useThemeManager";
import { Theme } from "@/app/shared/theme/themePalette";
import { colorConst } from "@/app/shared/theme/colorConstant";
import { tabsStyles } from "@/app/shared/settingsTabStyles/common";

/**
 * Компонент оформления, состоит из чекбоксов, и вложенного компонента ThemeBox для переключения цветовой схемы
 * @component
 */

export default function AppearanceTab() {
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

  const themes: Theme[] = ["SpaceBlue", "RoseMoon", "Solarized", "OnyxStorm", "Nord"];

  return (
    <div css={tabsStyles.tabSection}>
      <h3 css={tabsStyles.sectionTitle}>Оформление</h3>

      <div css={tabsStyles.settingsContainer}>
        {/* Темы */}
        <div css={styles.themesContainer}>
          {themes.map((themeName) => (
            <ThemeBox key={themeName} themeName={themeName} currentTheme={theme} onSelect={setTheme} />
          ))}
        </div>

        {/* Панель альбомов */}
        <p css={tabsStyles.subSectionTitle}>Панель альбомов</p>
        <label css={styles.checkboxLabel}>
          <input type="checkbox" checked={enableAlbumBorder} onChange={(e) => setEnableAlbumBorder(e.target.checked)} />
          <span css={tabsStyles.sectionTitleText}>Включить обводку для панели альбомов</span>
        </label>

        {/* Фото пикер */}
        <p css={tabsStyles.subSectionTitle}>Фото пикер</p>
        <label css={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={enablePhotoViewerBorder}
            onChange={(e) => setEnablePhotoViewerBorder(e.target.checked)}
          />
          <span css={tabsStyles.sectionTitleText}>Включить обводку для панели фото пикера</span>
        </label>

        {/* Фото редактор */}
        <p css={tabsStyles.subSectionTitle}>Фото редактор</p>
        <label css={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={enabledPhotoViewerShadow}
            onChange={(e) => setEnabledPhotoViewerShadow(e.target.checked)}
          />
          <span css={tabsStyles.sectionTitleText}>Включить тень для фото пикера</span>
        </label>

        <label css={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={enabledPhotoEditorShadow}
            onChange={(e) => setEnabledPhotoEditorShadow(e.target.checked)}
          />
          <span css={tabsStyles.sectionTitleText}>Включить тень для фото редактора</span>
        </label>

        <Separator css={styles.horizontalSeparator} />

        {/* Производительность */}
        <p css={tabsStyles.subSectionTitle}>Производительность</p>
        <label css={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={enablePerformanceMode}
            onChange={(e) => {
              const on = e.target.checked;
              setEnablePerformanceMode(on);

              if (on) {
                setEnablePhotoViewerBorder(false);
                setEnableAlbumBorder(false);
                setEnabledPhotoViewerShadow(false);
                setEnabledPhotoEditorShadow(false);
              }
            }}
          />
          <span css={tabsStyles.sectionTitleText}>
            Включить режим производительности
            {enablePerformanceMode && <span css={styles.priorityText}> (приоритет)</span>}
          </span>
        </label>
      </div>
    </div>
  );
}

const styles = {
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
  priorityText: css({
    color: colorConst.settingsModal.designTab.priorityText,
  }),
  horizontalSeparator: css({
    width: "100%",
    height: 1,
    backgroundColor: "#b0adadb2",
    marginTop: 10,
  }),
};
