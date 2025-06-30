import { useState, useEffect } from "react";
import { themeColors, Theme } from "./themePalette";

/**
 * Кастомный хук для управления темой приложения, хранящейся в localStorage.
 * Инициализирует тему по умолчанию и синхронизирует её с CSS-переменными.
 *
 * @returns {Object} Объект, содержащий текущую тему и функцию для её изменения.
 * @property {Theme} theme - Текущая тема из заданного типа Theme.
 * @property {function} setTheme - Функция для обновления темы, запускающая обновление стилей и хранения.
 */

export function useThemeManager() {
  // Инициализируем с дефолтной темой, так как localStorage недоступен на сервере
  const [theme, setTheme] = useState<Theme>("SpaceBlue");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("appTheme") as Theme | null;
      if (storedTheme && Object.keys(themeColors).includes(storedTheme)) {
        setTheme(storedTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Применяем тему к глобальным стилям и сохраняем в localStorage только на клиенте
    if (typeof window !== "undefined") {
      const currentTheme = themeColors[theme];
      document.documentElement.style.setProperty(
        "--theme-background",
        currentTheme.mainGradient
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
    }
  }, [theme]);

  return { theme, setTheme };
}
