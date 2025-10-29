/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
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
  const [widthMode, setWidthMode] = useState("100%");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("descriptionWidth");
      if (saved) setWidthMode(saved);
    }
  }, []);

  if (!description) {
    return (
      <div css={style.descriptionContainer(widthMode)}>
        <span css={[style.descriptionText, style.multiLineText]}>{"\u00A0"}</span>
      </div>
    );
  }

  // поиск URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = description.split(urlRegex);

  const renderContent = parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" css={style.link}>
          {part}
        </a>
      );
    }
    return (
      <span key={index} css={style.descriptionText}>
        {part}
      </span>
    );
  });

  return (
    <div css={style.descriptionContainer(widthMode)}>
      <span css={[style.descriptionText, style.multiLineText]}>{renderContent}</span>
    </div>
  );
}

export default Description;

const style = {
  descriptionContainer: (widthMode: string) =>
    css({
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: "1rem",
      width: widthMode === "40%" ? "40%" : "100%",
      textAlign: "left",
      overflow: "hidden",
      overflowWrap: "anywhere",
      wordBreak: "break-all",
      transition: "width 0.3s ease",
    }),
  descriptionText: css({
    color: "white",
    fontFamily: customFonts.fonts.ru,
    fontSize: "17px",
    lineHeight: "1.5",
    opacity: 0.9,
  }),
  multiLineText: css({
    whiteSpace: "pre-wrap",
  }),
  link: css({
    color: "#a855f7",
    textDecoration: "underline",
    "&:hover": {
      color: "#d8b4fe",
    },
  }),
};
