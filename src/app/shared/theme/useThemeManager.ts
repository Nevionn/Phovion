"use client";
import { useState, useEffect } from "react";
import { themeColors, Theme } from "./themePalette";

/**
 * Кастомный хук для управления темой и настройками оформления приложения, хранящимися в localStorage.
 * Функция-инициализатор позволяет получить значения из localStorage только на клиенте.
 *
 * @returns {Object} Объект, содержащий текущую тему, функцию для её изменения, состояние обводки и функцию для её переключения.
 * @property {Theme} theme - Текущая тема из заданного типа Theme.
 * @property {function} setTheme - Функция для обновления темы, запускающая обновление стилей и хранения.
 * @property {boolean} enableAlbumBorder - Состояние включения обводки панели альбомов.
 * @property {function} setEnableAlbumBorder - Функция для переключения обводки панели альбомов.
 */
export function useThemeManager() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("appTheme") as Theme | null;
      return storedTheme && Object.keys(themeColors).includes(storedTheme)
        ? storedTheme
        : "SpaceBlue";
    }
    return "SpaceBlue"; // Дефолт на сервере
  });

  const [enableAlbumBorder, setEnableAlbumBorder] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedBorder = localStorage.getItem("enableAlbumBorder");
      return storedBorder ? JSON.parse(storedBorder) : true;
    }
    return true;
  });

  useEffect(() => {
    // Применяем тему и обводку к глобальным стилям и сохраняем в localStorage
    if (typeof window !== "undefined") {
      const currentTheme = themeColors[theme];
      document.documentElement.style.setProperty(
        "--theme-background",
        currentTheme.mainGradient
      );
      document.documentElement.style.setProperty(
        "--list-container-border-color",
        enableAlbumBorder
          ? currentTheme.albumListContainerBorder
          : "transparent" // Выключаем обводку панели альбомов, если галочка снята
      );
      document.documentElement.style.setProperty(
        "--modal-background",
        currentTheme.modalBackground
      );
      document.documentElement.style.setProperty(
        "--modal-text-color",
        currentTheme.modalTextColor
      );
      localStorage.setItem("appTheme", theme);
      localStorage.setItem(
        "enableAlbumBorder",
        JSON.stringify(enableAlbumBorder)
      );
    }
  }, [theme, enableAlbumBorder]);

  return { theme, setTheme, enableAlbumBorder, setEnableAlbumBorder };
}
