import { useState, useEffect } from "react";
import { themeColors } from "./themePalette";
import { Theme } from "./themePalette";

export function useThemeManager() {
  const [theme, setTheme] = useState<Theme>("SpaceBlue");

  useEffect(() => {
    // Загружаем тему из БД при монтировании
    const fetchTheme = async () => {
      try {
        const response = await fetch("/api/theme");
        const data = await response.json();
        if (data.theme && Object.keys(themeColors).includes(data.theme)) {
          setTheme(data.theme);
        }
      } catch (error) {
        console.error("Ошибка при получение темы:", error);
      }
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    // Применяем тему к глобальным стилям
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

    // Сохраняем тему в БД через API
    fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    }).catch((error) => console.error("Ошибка при сохранение темы:", error));
  }, [theme]);

  return { theme, setTheme };
}
