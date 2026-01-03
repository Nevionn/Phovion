/** @jsxImportSource @emotion/react */
"use client";
import "../globals.css";
import AlbumsListContainer from "../components/AlbumsListContainer";
import { useThemeManager } from "../shared/theme/useThemeManager";
import { css } from "@emotion/react";

/**
 * Страница списка всех альбомов
 */

export default function albumsPage() {
  useThemeManager();
  return (
    <main css={styles.root}>
      <AlbumsListContainer />
    </main>
  );
}

const styles = {
  root: css({
    height: "100%",
    overflow: "auto",
  }),
};
