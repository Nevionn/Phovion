/** @jsxImportSource @emotion/react */
"use client";
import "./globals.css";
import AlbumsListContainer from "./components/AlbumsListContainer";
import { useThemeManager } from "./shared/theme/useThemeManager";

export default function Home() {
  useThemeManager();
  return (
    <main>
      <AlbumsListContainer />
    </main>
  );
}
