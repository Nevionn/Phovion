/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { customFonts } from "@/app/shared/theme/customFonts";

type DescriptionProps = {
  description: string | null;
};

/**
 * Компонент для описания альбома
 * @component
 * @returns {JSX.Element}
 */

function Description({ description }: DescriptionProps) {
  console.log(description);
  return (
    <div css={style.descriptionContainer}>
      <span css={[style.descriptionText, style.multiLineText]}>{description || ""}</span>
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
};
