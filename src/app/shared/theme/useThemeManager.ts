"use client";
import { useState, useEffect } from "react";
import { themeColors, Theme } from "./themePalette";

/**
 * Кастомный хук для управления темой и настройками оформления приложения, хранящимися в localStorage.
 * Функция-инициализатор позволяет получить значения из localStorage только на клиенте.
 *
 * @returns {Object} Объект, содержащий текущую тему, функцию для её изменения, состояние обводки и режим производительности.
 * @property {Theme} theme - Текущая тема из заданного типа Theme.
 * @property {function} setTheme - Функция для обновления темы, запускающая обновление стилей и хранения.
 * @property {boolean} enableAlbumBorder - Состояние включения обводки панели альбомов.
 * @property {function} setEnableAlbumBorder - Функция для переключения обводки панели альбомов.
 * @property {boolean} enablePhotoViewerBorder - Состояние включения обводки панели фото пикера.
 * @property {function} setEnablePhotoViewerBorder - Функция для переключения обводки панели фото пикера.
 * @property {boolean} enablePerformanceMode - Состояние включения режима производительности, отключающего все обводки.
 * @property {function} setEnablePerformanceMode - Функция для переключения режима производительности.
 * @property {boolean} enabledPhotoViewerShadow - Состояние включения тени для фото пикера.
 * @property {function} setEnabledPhotoViewerShadow - Функция для переключения тени для фото пикера.
 * @property {boolean} enabledPhotoEditorShadow - Состояние включения тени для фото редактора.
 * @property {function} setEnabledPhotoEditorShadow - Функция для переключения тени для фото редактора.
 */
export function useThemeManager() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("appTheme") as Theme | null;
      return storedTheme && Object.keys(themeColors).includes(storedTheme) ? storedTheme : "SpaceBlue";
    }
    return "SpaceBlue";
  });

  const [enableAlbumBorder, setEnableAlbumBorder] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedBorder = localStorage.getItem("enableAlbumBorder");
      return storedBorder ? JSON.parse(storedBorder) : true;
    }
    return true;
  });

  const [enablePhotoViewerBorder, setEnablePhotoViewerBorder] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const photoViewerStoredBorder = localStorage.getItem("enablePhotoViewerBorder");
      return photoViewerStoredBorder ? JSON.parse(photoViewerStoredBorder) : true;
    }
    return true;
  });

  const [enabledPhotoViewerShadow, setEnabledPhotoViewerShadow] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const photoViewerStoredShadow = localStorage.getItem("enabledPhotoViewerShadow");
      return photoViewerStoredShadow ? JSON.parse(photoViewerStoredShadow) : true;
    }
    return true;
  });

  const [enabledPhotoEditorShadow, setEnabledPhotoEditorShadow] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const photoEditorStoredShadow = localStorage.getItem("enabledPhotoEditorShadow");
      return photoEditorStoredShadow ? JSON.parse(photoEditorStoredShadow) : true;
    }
    return true;
  });

  const [enablePerformanceMode, setEnablePerformanceMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedPerformanceMode = localStorage.getItem("enablePerformanceMode");
      return storedPerformanceMode ? JSON.parse(storedPerformanceMode) : false;
    }
    return false;
  });

  /** Управление состоянием обводок и режима производительности */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPerformanceMode = localStorage.getItem("enablePerformanceMode");

      if (storedPerformanceMode && JSON.parse(storedPerformanceMode)) {
        setEnableAlbumBorder(false);
        setEnablePhotoViewerBorder(false);
        setEnabledPhotoViewerShadow(false);
        setEnabledPhotoEditorShadow(false);
      } else if (enableAlbumBorder || enablePhotoViewerBorder || enabledPhotoViewerShadow || enabledPhotoEditorShadow) {
        setEnablePerformanceMode(false);
      }
    }
  }, [enableAlbumBorder, enablePhotoViewerBorder, enabledPhotoViewerShadow, enabledPhotoEditorShadow]);

  /** Применение стилей и сохранение в localStorage */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentTheme = themeColors[theme];

      document.documentElement.style.setProperty("--theme-background", currentTheme.pages.main.mainGradient);
      document.documentElement.style.setProperty(
        "--theme-photo-page-background",
        currentTheme.pages.photoPage.backgroundColor
      );

      const albumBorderColor = enablePerformanceMode
        ? "transparent"
        : enableAlbumBorder
        ? currentTheme.pages.main.albumListContainerBorder
        : "transparent";

      const photoViewerBorderColor = enablePerformanceMode
        ? "transparent"
        : enablePhotoViewerBorder
        ? currentTheme.modals.photoViewer.borderColor
        : "transparent";

      const photoViewerShadow = enablePerformanceMode
        ? "transparent"
        : enabledPhotoViewerShadow
        ? currentTheme.modals.photoViewer.boxShadow
        : "transparent";

      const photoEditorShadow = enablePerformanceMode
        ? "transparent"
        : enabledPhotoEditorShadow
        ? currentTheme.modals.photoEditor.boxShadow
        : "transparent";

      document.documentElement.style.setProperty("--list-container-border-color", albumBorderColor);
      document.documentElement.style.setProperty("--photo-viewer-border-color", photoViewerBorderColor);
      document.documentElement.style.setProperty("--photo-viewer-border-shadow", photoViewerShadow);
      document.documentElement.style.setProperty("--photo-editor-shadow", photoEditorShadow);

      document.documentElement.style.setProperty(
        "--modal-background",
        currentTheme.modals.settingsModal.modalBackground
      );
      document.documentElement.style.setProperty(
        "--modal-text-color",
        currentTheme.modals.settingsModal.modalTextColor
      );
      document.documentElement.style.setProperty(
        "--create-album-modal-input-fields-color",
        currentTheme.modals.createAlbumModal.inputFieldBg
      );
      document.documentElement.style.setProperty(
        "--create-album-modal-input-fields-border-color-target",
        currentTheme.modals.createAlbumModal.inputFieldBorderTarget
      );
      document.documentElement.style.setProperty(
        "--create-album-modal-input-fields-border-color-non-target",
        currentTheme.modals.createAlbumModal.inputFieldBorderNonTarget
      );
      document.documentElement.style.setProperty(
        "--create-album-button-color",
        currentTheme.globalButtons.openCreateAlbumModalButton.bgColor
      );
      document.documentElement.style.setProperty(
        "--settings-modal-activeTab-button",
        currentTheme.modals.settingsModal.activeTabButtonColor
      );
      document.documentElement.style.setProperty("--scroll-bar-thumb-color", currentTheme.scrollBar.thumb);
      document.documentElement.style.setProperty("--scroll-bar-track-color", currentTheme.scrollBar.track);

      /** Сохранение всех состояний в localStorage */
      localStorage.setItem("appTheme", theme);
      localStorage.setItem("enableAlbumBorder", JSON.stringify(enableAlbumBorder));
      localStorage.setItem("enablePhotoViewerBorder", JSON.stringify(enablePhotoViewerBorder));
      localStorage.setItem("enabledPhotoViewerShadow", JSON.stringify(enabledPhotoViewerShadow));
      localStorage.setItem("enabledPhotoEditorShadow", JSON.stringify(enabledPhotoEditorShadow));
      localStorage.setItem("enablePerformanceMode", JSON.stringify(enablePerformanceMode));
    }
  }, [
    theme,
    enableAlbumBorder,
    enablePhotoViewerBorder,
    enablePerformanceMode,
    enabledPhotoViewerShadow,
    enabledPhotoEditorShadow,
  ]);

  return {
    theme,
    setTheme,
    enableAlbumBorder,
    setEnableAlbumBorder,
    enablePhotoViewerBorder,
    setEnablePhotoViewerBorder,
    enablePerformanceMode,
    setEnablePerformanceMode,
    enabledPhotoViewerShadow,
    setEnabledPhotoViewerShadow,
    enabledPhotoEditorShadow,
    setEnabledPhotoEditorShadow,
  };
}
