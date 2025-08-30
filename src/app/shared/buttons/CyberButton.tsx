/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../../shared/buttons/cyber-button.css";
import { customFonts } from "../theme/customFonts";
import { ComponentProps } from "react";

interface CyberButtonProps extends ComponentProps<"button"> {
  label: string;
  hue?: number; // Только основной hue — всё остальное остаётся из глобального стиля
}

export default function CyberButton({
  label,
  onClick,
  hue = 0, // по умолчанию красный
}: CyberButtonProps) {
  const style = {
    "--primary-hue": hue.toString(),
  } as React.CSSProperties;

  return (
    <button className="cybr-btn" style={style} css={externalStyles.text} onClick={onClick}>
      {label}
      <span aria-hidden className="cybr-btn__glitch">
        {label}
      </span>
      <span className="cybr-btn__tag"></span>
    </button>
  );
}

const externalStyles = {
  text: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: 17,
  }),
};
