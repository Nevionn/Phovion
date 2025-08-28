/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import FuzzyText from "./components/FuzzyText";

export default function NotFound() {
  return (
    <div css={styles.root}>
      <FuzzyText fontSize="clamp(4rem, 12vw, 12rem)" color="#fff">
        404
      </FuzzyText>
      <FuzzyText
        fontSize="clamp(1.5rem, 5vw, 4rem)"
        color="#fff"
        fontWeight={700}
      >
        Страница не найдена
      </FuzzyText>
    </div>
  );
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#140c20ff",
    textAlign: "center",
  }),
};
