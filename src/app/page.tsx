/** @jsxImportSource @emotion/react */
"use client";
import "./globals.css";
import { useThemeManager } from "./shared/theme/useThemeManager";
import { css } from "@emotion/react";
import { UI_PASS } from "../../passconfig";
import { LoginBoard } from "./components/LoginBoard";
import { redirect } from "next/navigation";

/**
 * Корневая страница
 * При установленном пароле, запросит его подтверждения, в ином случае откроется страница всех альбомов
 */

export default function Home() {
  useThemeManager();

  if (!UI_PASS || UI_PASS.length === 0) {
    redirect("/albumsPage");
  }
  return (
    <main css={styles.root}>
      <LoginBoard />
    </main>
  );
}

const styles = {
  root: css({
    height: "100%",
    overflow: "auto",
  }),
};
