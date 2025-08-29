/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import FuzzyText from "./components/FuzzyText";
import CyberButton from "./shared/buttons/CyberButton";

export default function NotFound() {
  const router = useRouter();
  return (
    <div css={styles.root}>
      <FuzzyText fontSize="clamp(4rem, 12vw, 12rem)" color="#fff">
        404
      </FuzzyText>
      <FuzzyText fontSize="clamp(1.5rem, 5vw, 4rem)" color="#fff" fontWeight={700}>
        Страница не найдена
      </FuzzyText>
      <div css={styles.homeButtonItem}>
        <CyberButton label="На главную страницу" hue={260} onClick={() => router.push("/")} />
      </div>
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
  homeButtonItem: css({
    marginTop: "2rem",
  }),
};
