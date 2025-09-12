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

  const [enablePerformanceMode, setEnablePerformanceMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedPerformanceMode = localStorage.getItem("enablePerformanceMode");
      return storedPerformanceMode ? JSON.parse(storedPerformanceMode) : false;
    }
    return false;
  });

  /** Управление состоянием обводок и режима производительности */
  useEffect(() => {
    if (enableAlbumBorder || enablePhotoViewerBorder) {
      setEnablePerformanceMode(false);
    }
  }, [enableAlbumBorder, enablePhotoViewerBorder]);

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
      document.documentElement.style.setProperty("--list-container-border-color", albumBorderColor);
      document.documentElement.style.setProperty("--photo-viewer-border-color", photoViewerBorderColor);
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

      /** Сохранение всех состояний в localStorage */
      localStorage.setItem("appTheme", theme);
      localStorage.setItem("enableAlbumBorder", JSON.stringify(enableAlbumBorder));
      localStorage.setItem("enablePhotoViewerBorder", JSON.stringify(enablePhotoViewerBorder));
      localStorage.setItem("enablePerformanceMode", JSON.stringify(enablePerformanceMode));
    }
  }, [theme, enableAlbumBorder, enablePhotoViewerBorder, enablePerformanceMode]);

  return {
    theme,
    setTheme,
    enableAlbumBorder,
    setEnableAlbumBorder,
    enablePhotoViewerBorder,
    setEnablePhotoViewerBorder,
    enablePerformanceMode,
    setEnablePerformanceMode,
  };
}
