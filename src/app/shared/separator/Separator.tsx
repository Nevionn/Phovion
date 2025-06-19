/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

interface SeparatorProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Separator: FC<SeparatorProps> = (props) => {
  const separatorStyles = css({
    display: "block",
  });

  return <div css={separatorStyles} {...props} />;
};

export default Separator;
