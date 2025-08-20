/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC } from "react";
import { Theme, themeColors } from "@/app/shared/theme/themePalette";
import { customFonts } from "../shared/theme/customFonts";

interface ThemeBoxProps {
  themeName: Theme;
  currentTheme: Theme;
  onSelect: (theme: Theme) => void;
}

/**
 * Компонент для отображения и выбора одной темы оформления в SettingsModal.
 * Отображает элемент с градиентом и обводкой, зависящими от текущей темы,
 * и позволяет переключить тему при клике.
 *
 * @component
 * @param {ThemeBoxProps} props - Пропсы компонента.
 * @param {Theme} props.themeName - Название темы для отображения.
 * @param {Theme} props.currentTheme - Текущая активная тема для определения состояния обводки.
 * @param {function} props.onSelect - Функция-обработчик клика, вызываемая с выбранной темой.
 * @returns {JSX.Element} Элемент с визуальным представлением темы.
 */

export const ThemeBox: FC<ThemeBoxProps> = ({
  themeName,
  currentTheme,
  onSelect,
}) => {
  const themeData = themeColors[themeName].modals.settingsModal;

  return (
    <div
      css={css`
        ${styles.themeBox}
        background: ${themeData.settingBoxGradient};
        border: ${currentTheme === themeName
          ? `2px solid ${themeData.settingBoxBorder}`
          : "1px solid transparent"};
      `}
      onClick={() => onSelect(themeName)}
    >
      <p css={styles.text}>{themeName}</p>
    </div>
  );
};

const styles = {
  themeBox: css({
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    color: "white",
    "&:hover": {
      backgroundColor: "#3e3e4a",
    },
  }),
  text: css({
    fontFamily: customFonts.fonts.eu,
    margin: 0,
  }),
};
