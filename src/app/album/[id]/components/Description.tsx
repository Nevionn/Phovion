/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { customFonts } from "@/app/shared/theme/customFonts";

type DescriptionProps = {
  description: string | null;
};

/**
 * Компонент для описания альбома, отображает описание альбома с поддержкой переносов строк и автоматическим преобразованием ссылок в гиперссылки.
 *
 * @param {DescriptionProps}
 * @returns {JSX.Element}
 */
function Description({ description }: DescriptionProps) {
  console.log("Description log:", description);

  if (!description) {
    return (
      <div css={style.descriptionContainer}>
        <span css={[style.descriptionText, style.multiLineText]}>{"\u00A0"}</span>
      </div>
    );
  }

  // поиск URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = description.split(urlRegex);

  const renderContent = parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Если часть — это URL, рендерим как гиперссылку
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" css={style.link}>
          {part}
        </a>
      );
    }
    // Если часть — обычный текст, рендерим как есть
    return (
      <span key={index} css={style.descriptionText}>
        {part}
      </span>
    );
  });

  return (
    <div css={style.descriptionContainer}>
      <span css={[style.descriptionText, style.multiLineText]}>{renderContent}</span>
    </div>
  );
}

export default Description;

const style = {
  descriptionContainer: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: "1rem",
    width: "40%",
    textAlign: "left",
    overflow: "hidden",
    overflowWrap: "anywhere",
    wordBreak: "break-all",
  }),
  descriptionText: css({
    color: "white",
    fontFamily: customFonts.fonts.ru,
    fontSize: "17px",
    lineHeight: "1.5",
    opacity: 0.9,
  }),
  multiLineText: css({
    whiteSpace: "pre-wrap", // Сохраняет \n и оборачивает текст
  }),
  link: css({
    color: "#a855f7",
    textDecoration: "underline",
    "&:hover": {
      color: "#d8b4fe",
    },
  }),
};
